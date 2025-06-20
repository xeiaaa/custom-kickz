import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { useSilhouetteEditor } from "../silhouette.context";

interface MaterialSelectorProps {
  selectedMaterial: string;
  onMaterialChange: (value: string) => void;
}

export function MaterialSelector({
  selectedMaterial,
  onMaterialChange,
}: MaterialSelectorProps) {
  const { materials } = useSilhouetteEditor();

  return (
    <div className="w-full max-w-md mx-auto mt-4 mb-8">
      <Select value={selectedMaterial} onValueChange={onMaterialChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select material" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Material</SelectLabel>
            {materials.map((mat) => (
              <SelectItem key={mat.uuid} value={mat.name || mat.uuid}>
                {mat.name || mat.uuid}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
