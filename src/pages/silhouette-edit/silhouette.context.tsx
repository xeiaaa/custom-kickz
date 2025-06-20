import React, { createContext, useContext, useState } from "react";
import * as THREE from "three";

interface SilhouetteEditorContextType {
  materials: THREE.Material[];
  materialsMap: Map<string, THREE.Material>;
  setMaterialsMap: React.Dispatch<
    React.SetStateAction<Map<string, THREE.Material>>
  >;
}

const SilhouetteEditorContext = createContext<
  SilhouetteEditorContextType | undefined
>(undefined);

export const SilhouetteEditorProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [materialsMap, setMaterialsMap] = useState<Map<string, THREE.Material>>(
    new Map()
  );

  const materials = Array.from(materialsMap.values());

  return (
    <SilhouetteEditorContext.Provider
      value={{ materials, materialsMap, setMaterialsMap }}
    >
      {children}
    </SilhouetteEditorContext.Provider>
  );
};

export function useSilhouetteEditor() {
  const context = useContext(SilhouetteEditorContext);
  if (!context) {
    throw new Error(
      "useSilhouetteEditor must be used within a SilhouetteEditorProvider"
    );
  }
  return context;
}
