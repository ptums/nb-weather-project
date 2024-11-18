import React, { createContext, useState, useContext, ReactNode } from "react";

interface ToggleViewContextType {
  toggleView: boolean;
  setToggleView: React.Dispatch<React.SetStateAction<boolean>>;
  decision: string;
  setDecision: (decision: string) => void;
}

const ToggleViewContext = createContext<ToggleViewContextType | undefined>(
  undefined
);

export const ToggleViewProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toggleView, setToggleView] = useState(false);
  const [decision, setDecision] = useState("history");

  return (
    <ToggleViewContext.Provider
      value={{ toggleView, setToggleView, decision, setDecision }}
    >
      {children}
    </ToggleViewContext.Provider>
  );
};

export const useToggleView = (): ToggleViewContextType => {
  const context = useContext(ToggleViewContext);
  if (context === undefined) {
    throw new Error("useToggleView must be used within a ToggleViewProvider");
  }
  return context;
};
