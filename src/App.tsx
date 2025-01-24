import { ReactNode, useState } from "react";
import CoverLetterPage from "./components/cover-letter-page";
import MainForm from "./components/main-form";
import SettingsForm from "./components/settings-form";
import { useAppDataContext } from "./contexts/app-data-context";
import "./index.css";
import { type FormValues } from "./lib/schemas/form-schema";
import { OpenAI } from "openai";
import { ChatResponse } from "./types/chat";
import { AppDataContext, defaultValues } from "./contexts/app-data-context";

function AppContent() {
  const [page, setPage] = useState<"main" | "settings" | "cover-letter">(
    "main",
  );
  const [slide, setSlide] = useState<"left" | "right">("left");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usageData, setUsageData] = useState({
    total: 0,
    prompt: 0,
    completion: 0,
  });

  const { coverLetterText, setCoverLetterText } = useAppDataContext();

  function handleSubmit(data: FormValues) {
    console.log("Request data :", data);

    fetchCoverLetterText(data);
  }

  async function navigateTo(to: "main" | "settings" | "cover-letter") {
    switch (to) {
      case "main":
        setSlide("left");
        await sleep(550);
        setPage("main");
        break;

      case "settings":
        setSlide("right");
        setPage("settings");
        break;

      case "cover-letter":
        setSlide("right");
        setPage("cover-letter");
        break;

      default:
    }
  }

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // TODO: Decompose fetch
  // TODO: Use TanStack Query
  async function fetchCoverLetterText(fromValues: FormValues) {
    setCoverLetterText("");
    setError(null);
    setIsLoading(true);

    let data = null;

    try {
      /*
      const data = await import("./mock-response.json");
      await sleep(1000);
      /*/
      const {
        salutation,
        jobDescription,
        model,
        temperature,
        wordLimit,
        additionalNotes,
        settings: {
          apiKey,
          name,
          workExperience,
          portfolioSite,
          skillSet,
          additionalSettings,
        },
      } = fromValues;

      const prompt = `Here is a job description, write a cover letter for this job on behalf of the user: ${jobDescription}.`;

      try {
        const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

        const chatCompletion = await openai.chat.completions.create({
          messages: [
            {
              role: "system",
              content: `You are an expert in recruitment and job applications. Write a cover letter for this job no more than ${wordLimit} words long. Explain why the user is a good fit for the job.`,
            },
            {
              role: "system",
              content: "Do not start with a subject line",
            },
            {
              role: "system",
              content: `Only mention skills included in the users work experience. Do not improvise mention of other skills if the user has not specified them.`,
            },
            {
              role: "system",
              content: `Use the users work experience to explain why they are a good fit for the job: ${workExperience}`,
            },
            {
              role: "system",
              content: `Make sure to include the salutation ${salutation}`,
            },
            {
              role: "system",
              content: portfolioSite
                ? `Include a paragraph with one sentence like: A selection of my work can be viewed at ${portfolioSite}`
                : "",
            },
            {
              role: "system",
              content: skillSet
                ? `The user has the following skills: ${skillSet}`
                : "",
            },
            {
              role: "user",
              content: additionalSettings ?? "",
            },
            {
              role: "user",
              content: additionalNotes ?? "",
            },
            {
              role: "system",
              content: `Sign off with the users name ${name}`,
            },
            { role: "user", content: prompt },
          ],
          temperature,
          model,
        });

        data = { chatCompletion };
      } catch (error) {
        console.error(error);
        setError((error as Error).message);
      }
      //*/

      if (!data) {
        throw new Error("API response is empty");
      }

      console.log("Response data :", data);

      const {
        chatCompletion: {
          usage: { total_tokens, prompt_tokens, completion_tokens },
        },
      } = data as ChatResponse;

      setUsageData({
        total: total_tokens,
        prompt: prompt_tokens,
        completion: completion_tokens,
      });

      setCoverLetterText(
        data.chatCompletion.choices[0].message.content as string,
      );

      navigateTo("cover-letter");
    } catch (error) {
      console.error(error);

      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* TODO: Set max width */}
      <div className="h-screen w-screen overflow-hidden">
        <div
          className={`flex h-full transition-transform duration-500 ease-in-out`}
          style={{
            transform: `translateX(${slide === "left" ? "0" : "-100%"})`,
          }}
        >
          {/* Page One */}
          <MainForm
            onNavigate={navigateTo}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />

          {/* Page Two */}
          {page === "cover-letter" ? (
            <CoverLetterPage
              text={coverLetterText as string}
              onNavigate={() => navigateTo("main")}
              usageData={usageData}
            />
          ) : (
            <SettingsForm onNavigate={() => navigateTo("main")} />
          )}
        </div>
      </div>
    </>
  );
}

function AppDataProvider({ children }: { children: ReactNode }) {
  const [appData, setAppData] = useState<FormValues>(defaultValues);
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

function App() {
  return (
    <AppDataProvider>
      <AppContent />
    </AppDataProvider>
  );
}

export default App;
