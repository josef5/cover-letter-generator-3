import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { FormValues } from "@/lib/schemas/form-schema";

export type PromptDataContextValue = {
  data: FormValues;
  setData: (data: FormValues) => void;
  isSettingsValid: boolean;
  setIsSettingsValid: (value: boolean) => void;
};

export const PromptDataContext = createContext<PromptDataContextValue>(
  {} as PromptDataContextValue,
);

export function PromptDataProvider({ children }: { children: ReactNode }) {
  // TODO: Consolidate this with the main form
  const [data, setData] = useState<FormValues>({
    salutation: "Dear Hiring Manager,",
    jobDescription: "",
    additionalNotes: "",
    settings: {
      apiKey: "",
      name: "",
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      wordLimit: 300,
      workExperience: "",
    },
  });

  const [isSettingsValid, setIsSettingsValid] = useState<boolean>(false);

  const value = {
    data,
    setData,
    isSettingsValid,
    setIsSettingsValid,
  };

  return (
    <PromptDataContext.Provider value={value}>
      {children}
    </PromptDataContext.Provider>
  );
}

export function usePromptDataContext() {
  const context = useContext<PromptDataContextValue>(PromptDataContext);
  if (context === undefined) {
    throw new Error(
      "usePromptDataContext must be used within a PromptDataProvider",
    );
  }
  return context;
}
