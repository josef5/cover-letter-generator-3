import { FormValues } from "@/lib/schemas/form-schema";
import { createContext, ReactNode, useContext, useState } from "react";

export type AppDataContextValue = {
  appData: FormValues;
  setAppData: (data: FormValues) => void;
  isSettingsValid: boolean;
  setIsSettingsValid: (value: boolean) => void;
  coverLetterText?: string;
  setCoverLetterText: (text: string) => void;
};

export const AppDataContext = createContext<AppDataContextValue>(
  {} as AppDataContextValue,
);

export function AppDataProvider({ children }: { children: ReactNode }) {
  // TODO: Consolidate this with the main form
  const [appData, setAppData] = useState<FormValues>({
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
    appData,
    setAppData,
    isSettingsValid,
    setIsSettingsValid,
    coverLetterText,
    setCoverLetterText,
  };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppDataContext() {
  const context = useContext<AppDataContextValue>(AppDataContext);
  if (context === undefined) {
    throw new Error("useAppDataContext must be used within a AppDataProvider");
  }
  return context;
}
