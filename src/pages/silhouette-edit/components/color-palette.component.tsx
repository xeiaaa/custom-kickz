import React from "react";
import { Button } from "@/components/ui/button";

interface ColorPaletteProps {
  colors: string[];
  onColorSelect: (color: string) => void;
  onAddColor: (color: string) => void;
  onRandomize: () => void;
}

export function ColorPalette({
  colors,
  onColorSelect,
  onAddColor,
  onRandomize,
}: ColorPaletteProps) {
  const [newColor, setNewColor] = React.useState("#ffffff");

  const handleAddColor = () => {
    onAddColor(newColor);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Color
        </p>
        <Button onClick={onRandomize} variant="outline" size="sm">
          Randomize
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {colors.map((color) => (
            <button
              key={color}
              className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 shadow-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-100 dark:focus:ring-offset-zinc-800"
              style={{ backgroundColor: color }}
              onClick={() => onColorSelect(color)}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 pt-2 border-l border-gray-200 dark:border-zinc-700 pl-4">
          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="w-10 h-10 p-1 border-none rounded-md cursor-pointer bg-transparent"
          />
          <input
            type="text"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="w-28 p-2 border rounded-md dark:bg-zinc-700 dark:text-white"
            placeholder="#RRGGBB"
          />
          <Button onClick={handleAddColor} size="sm">
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
