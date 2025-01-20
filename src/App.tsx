import { useState } from "react";
import CoverLetterPage from "./components/cover-letter-page";
import MainForm from "./components/main-form";
import SettingsForm from "./components/settings-form";
import {
  AppDataProvider,
  useAppDataContext,
} from "./contexts/app-data-context";
import "./index.css";
import { type FormValues } from "./lib/schemas/form-schema";
import { OpenAI } from "openai";
import { ChatResponse } from "./types/chat";

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

  async function fetchCoverLetterText(userData: FormValues) {
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
        additionalNotes,
        settings: {
          apiKey,
          name,
          model,
          temperature,
          wordLimit,
          workExperience,
        },
      } = userData;

      const prompt = `Here is a job description, write a cover letter for this job on behalf of the user: ${jobDescription}.`;

      try {
        const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

        const chatCompletion = await openai.chat.completions.create({
          messages: [
            {
              role: "system",
              content:
                "You are an expert in recruitment and job applications. Write a cover letter for this job.",
            },
            {
              role: "system",
              content: `Use the users work experience to explain why they are a good fit for the job: ${workExperience}`,
            },
            {
              role: "system",
              content:
                "Although we call it a letter it will be sent digitally, so we dont need subject line or an address or date.",
            },
            {
              role: "system",
              content: "Do not start with a subject line",
            },
            {
              role: "system",
              content: `Make sure to include the salutation ${salutation}`,
            },
            {
              role: "system",
              content: `Sign off with the users name ${name}`,
            },
            {
              role: "system",
              content: `The cover letter should be no more than ${wordLimit} words long and should explain why you are a good fit for the job.`,
            },
            { role: "system", content: additionalNotes ?? "" },
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

function App() {
  return (
    <AppDataProvider>
      <AppContent />
    </AppDataProvider>
  );
}

export default App;
