import { useState } from "react";
import CoverLetterPage from "./components/cover-letter-page";
import MainForm from "./components/main-form";
import SettingsForm from "./components/settings-form";
import { PromptDataProvider } from "./contexts/prompt-data-context";
import "./index.css";
import { type FormValues } from "./lib/schemas/form-schema";
import { OpenAI } from "openai";
import { ChatResponse } from "./types/chat";

function App() {
  const [page, setPage] = useState<"main" | "settings" | "result">("main");
  const [slide, setSlide] = useState<"left" | "right">("left");
  const [coverLetterText, setCoverLetterText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usageData, setUsageData] = useState({
    total: 0,
    prompt: 0,
    completion: 0,
  });

  function handleSubmit(data: FormValues) {
    console.log("data :", data);

    fetchCoverLetterText(data);
  }

  function handleShowSettings() {
    setPage("settings");
    setSlide("right");
  }

  function handleCloseSettings() {
    setPage("main");
    setSlide("left");
  }

  async function handleCloseCoverLetter() {
    setSlide("left");

    await sleep(550);
    setPage("main");
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

      console.log("data :", data);

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
      setSlide("right");
      setPage("result");
    } catch (error) {
      console.error(error);

      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PromptDataProvider>
      <div className="h-screen w-screen overflow-hidden">
        <div
          className={`flex h-full transition-transform duration-500 ease-in-out`}
          style={{
            transform: `translateX(${slide === "left" ? "0" : "-100%"})`,
          }}
        >
          {/* Page One */}
          <MainForm
            onNavigate={handleShowSettings}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />

          {/* Page Two */}
          {page === "result" ? (
            <CoverLetterPage
              text={coverLetterText}
              onNavigate={handleCloseCoverLetter}
              usageData={usageData}
            />
          ) : (
            <SettingsForm onNavigate={handleCloseSettings} />
          )}
        </div>
      </div>
    </PromptDataProvider>
  );
}

export default App;
