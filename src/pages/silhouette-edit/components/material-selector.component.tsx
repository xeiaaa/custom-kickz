import React, { useRef, useState, useEffect } from "react";
import { useSilhouetteEditor } from "../silhouette.context";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MaterialSelectorProps {
  selectedMaterial: string;
  onMaterialChange: (value: string) => void;
}

export function MaterialSelector({
  selectedMaterial,
  onMaterialChange,
}: MaterialSelectorProps) {
  const { materials } = useSilhouetteEditor();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const checkScrollability = () => {
      const el = scrollContainerRef.current;
      if (el) {
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth);
      }
    };

    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScrollability);
      window.addEventListener("resize", checkScrollability);
      checkScrollability(); // Initial check
    }

    return () => {
      if (el) {
        el.removeEventListener("scroll", checkScrollability);
        window.removeEventListener("resize", checkScrollability);
      }
    };
  }, [materials]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollAmount =
        direction === "left" ? -el.clientWidth / 2 : el.clientWidth / 2;
      el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full pt-4">
      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-zinc-900/80 rounded-full p-1 shadow-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        <div
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
        >
          {materials.map((mat) => (
            <div
              key={mat.uuid}
              onClick={() => onMaterialChange(mat.name || mat.uuid)}
              className={`cursor-pointer flex-shrink-0 flex flex-col items-center justify-center space-y-2 p-2 rounded-lg transition-all duration-200 ${
                selectedMaterial === (mat.name || mat.uuid)
                  ? "bg-blue-100 dark:bg-blue-900 border-blue-500"
                  : "bg-gray-100 dark:bg-zinc-800"
              }`}
            >
              <div className="w-24 h-24 bg-gray-200 dark:bg-zinc-700 rounded-md flex items-center justify-center">
                <span className="text-xs text-gray-500">Image</span>
              </div>
              <span
                className={`text-xs font-medium ${
                  selectedMaterial === (mat.name || mat.uuid)
                    ? "text-blue-600 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {mat.name || mat.uuid}
              </span>
            </div>
          ))}
        </div>
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-zinc-900/80 rounded-full p-1 shadow-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
}
