import { FormValues } from "@/lib/schemas/form-schema";
import { createContext, ReactNode, useContext, useState } from "react";

export type PromptDataContextValue = {
  promptData: FormValues;
  setPromptData: (data: FormValues) => void;
  isSettingsValid: boolean;
  setIsSettingsValid: (value: boolean) => void;
  coverLetterText?: string;
  setCoverLetterText: (text: string) => void;
};

export const PromptDataContext = createContext<PromptDataContextValue>(
  {} as PromptDataContextValue,
);

// TODO: Convert to AppContext including cover letter text

export function PromptDataProvider({ children }: { children: ReactNode }) {
  // TODO: Consolidate this with the main form
  const [promptData, setPromptData] = useState<FormValues>({
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
  const [coverLetterText, setCoverLetterText] = useState("");

  const value = {
    promptData,
    setPromptData,
    isSettingsValid,
    setIsSettingsValid,
    coverLetterText,
    setCoverLetterText,
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
