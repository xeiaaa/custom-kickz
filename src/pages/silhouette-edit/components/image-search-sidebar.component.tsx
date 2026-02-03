import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersectionObserver } from "usehooks-ts";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSilhouetteEditor } from "../silhouette.context";
import * as THREE from "three";

const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const googleCseId = import.meta.env.VITE_GOOGLE_CSE_ID;
const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

// A simple debounce hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

interface ImageSearchSidebarProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  silhouetteName: string;
  onColorsUpdated?: (newColors: string[]) => void;
}

interface GoogleImage {
  link: string;
  title: string;
  mime: string;
  image: {
    thumbnailLink: string;
  };
}

interface ColorResponse {
  [key: string]: string;
}

const fetchImages = async ({
  searchTerm,
  pageParam = 1,
}: {
  searchTerm: string;
  pageParam?: number;
}): Promise<{ items: GoogleImage[]; nextPage?: number }> => {
  if (!googleApiKey || !googleCseId) {
    throw new Error(
      "Google API Key or CSE ID is missing. Please add VITE_GOOGLE_API_KEY and VITE_GOOGLE_CSE_ID to your .env file."
    );
  }

  const res = await fetch(
    `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${googleCseId}&q=${searchTerm}&searchType=image&num=10&start=${pageParam}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch images from Google");
  }

  const data = await res.json();
  const nextPage = data.queries?.nextPage?.[0]?.startIndex;

  return {
    items: (data.items || []).filter(
      (item: GoogleImage) => item.mime && item.mime.startsWith("image/")
    ),
    nextPage: nextPage,
  };
};

const generateColorwayFromImage = async (
  imageUrl: string,
  silhouetteName: string,
  materialNames: string[]
): Promise<ColorResponse> => {
  if (!openaiApiKey) {
    throw new Error(
      "OpenAI API Key is missing. Please add VITE_OPENAI_API_KEY to your .env file."
    );
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `

Here are the parts of a ${silhouetteName} shoe:

${JSON.stringify(materialNames)}

Your task:

Analyze the image and extract the color theme based on the main focus of the picture.

ONLY USE colors that are visually present in the subject's actual appearance. Do not invent or assume colors that are not there.

Match the tone, mood, and style of the subject. If the subject is soft, muted, or elegant, avoid using overly saturated or neon colors.

The main body of the shoe (e.g., vamp, quarter, toe, central) should reflect the dominant clothing color of the subject.

Accent parts like laces, swoosh, and outsole may take inspiration from secondary accessories, trim, or visual details.

Output instructions:

Return ONLY a valid JSON object mapping each part to a hex color string.

Do NOT include any markdown formatting, code fences, or extra text.

Do NOT include any explanations, comments, or additional formatting.

The response must be parseable JSON only.

Ensure all parts from the list are included in the output.

Example format:
{"back.down": "#5C2C24", "back.top": "#5C2C24", "vamp": "#5C2C24"}

              `,
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate colorway from image");
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No response content from OpenAI");
  }

  try {
    // Clean the content to remove any markdown formatting
    let cleanedContent = content.trim();

    // Remove markdown code fences if present
    if (cleanedContent.startsWith("```json")) {
      cleanedContent = cleanedContent.replace(/^```json\s*/, "");
    }
    if (cleanedContent.startsWith("```")) {
      cleanedContent = cleanedContent.replace(/^```\s*/, "");
    }
    if (cleanedContent.endsWith("```")) {
      cleanedContent = cleanedContent.replace(/\s*```$/, "");
    }

    return JSON.parse(cleanedContent);
  } catch {
    throw new Error("Invalid JSON response from OpenAI");
  }
};

export function ImageSearchSidebar({
  isOpen,
  onOpenChange,
  silhouetteName,
  onColorsUpdated,
}: ImageSearchSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isGeneratingColorway, setIsGeneratingColorway] = useState(false);
  const [generatingImageUrl, setGeneratingImageUrl] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { materialsMap } = useSilhouetteEditor();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error: searchError,
  } = useInfiniteQuery({
    queryKey: ["googleImages", debouncedSearchTerm],
    queryFn: ({ pageParam }) =>
      fetchImages({ searchTerm: debouncedSearchTerm, pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // We have fetched 10 items per page. Stop after 4 pages (40 items).
      const totalItems = allPages.reduce(
        (acc, page) => acc + page.items.length,
        0
      );
      if (totalItems >= 40 || !lastPage.nextPage) {
        return undefined;
      }
      return lastPage.nextPage;
    },
    enabled: !!debouncedSearchTerm,
    staleTime: Infinity,
  });

  const { ref } = useIntersectionObserver({
    onChange: (isIntersecting) => {
      if (isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    rootMargin: "0px 0px 400px 0px", // Trigger when 400px from the bottom
  });

  const images = data?.pages.flatMap((page) => page.items) ?? [];

  const handleImageClick = async (imageUrl: string) => {
    setIsGeneratingColorway(true);
    setGeneratingImageUrl(imageUrl);
    setError(null);

    try {
      const materialNames = Array.from(materialsMap.keys());
      const colorway = await generateColorwayFromImage(
        imageUrl,
        silhouetteName,
        materialNames
      );

      // Apply colors to materials
      materialsMap.forEach((material) => {
        const color = colorway[material.name];
        if (color) {
          (material as THREE.MeshStandardMaterial).color.set(color);
        }
      });

      // Close the sidebar after successful generation
      onOpenChange(false);

      if (onColorsUpdated) {
        const newColors = Object.values(colorway);
        onColorsUpdated(newColors);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate colorway"
      );
    } finally {
      setIsGeneratingColorway(false);
      setGeneratingImageUrl(null);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-6 overflow-y-auto bg-neutral-50 dark:bg-neutral-950 border-l border-black/5 dark:border-white/10">
        <SheetHeader className="text-left px-0 pb-0">
          <SheetTitle className="text-xl font-black tracking-tighter uppercase text-neutral-900 dark:text-white">
            Generate Theme from Image
          </SheetTitle>
          <SheetDescription className="text-neutral-500 dark:text-neutral-400">
            Search for an image to inspire a new colorway for your silhouette.
          </SheetDescription>
        </SheetHeader>
        <div className="py-6">
          <Input
            placeholder="e.g., 'Naruto Uzumaki, Hello Kitty, etc.'"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-xl border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 focus-visible:border-yellow-400/50 focus-visible:ring-yellow-400/20 h-11 px-4"
          />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {isLoading && (
            <p className="col-span-full text-neutral-500 dark:text-neutral-400">
              Loading images...
            </p>
          )}
          {searchError && (
            <p className="col-span-full text-red-500 dark:text-red-400">
              {searchError.message}
            </p>
          )}
          {images.map((img) => (
            <button
              key={img.link}
              onClick={() => handleImageClick(img.link)}
              disabled={isGeneratingColorway}
              className="aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border border-black/5 dark:border-white/5 hover:border-yellow-400/50 dark:hover:border-yellow-400/50 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:ring-offset-2 focus:ring-offset-neutral-50 dark:focus:ring-offset-neutral-950 disabled:opacity-50 disabled:cursor-not-allowed relative"
            >
              <img
                src={img.image.thumbnailLink}
                alt={img.title}
                className="w-full h-full object-contain"
              />
              {isGeneratingColorway && generatingImageUrl === img.link && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    Generating...
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
        <div ref={ref} className="col-span-full flex justify-center py-4">
          {isFetchingNextPage ? (
            <p className="text-neutral-500 dark:text-neutral-400">
              Loading more...
            </p>
          ) : hasNextPage ? (
            <Button
              onClick={() => fetchNextPage()}
              variant="outline"
              className="mt-4 rounded-full border-black/10 dark:border-white/10 hover:border-yellow-400/50 dark:hover:border-yellow-400/50 hover:bg-yellow-400/10"
            >
              Load More
            </Button>
          ) : (
            images.length > 0 && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                You've reached the end.
              </p>
            )
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
