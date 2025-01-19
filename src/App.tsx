import { useState } from "react";
import CoverLetterPage from "./components/cover-letter-page";
import MainForm from "./components/main-form";
import SettingsForm from "./components/settings-form";
import { PromptDataProvider } from "./contexts/prompt-data-context";
import "./index.css";
import { type FormValues } from "./lib/schemas/form-schema";
import type { UserData } from "./types/data";

function App() {
  const [page, setPage] = useState<"main" | "settings" | "result">("main");
  const [slide, setSlide] = useState<"left" | "right">("left");
  const [coverLetterText, setCoverLetterText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estimatedTokens, setEstimatedTokens] = useState(0);
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

  async function fetchCoverLetterText(userData: UserData) {
    setCoverLetterText("");
    setError(null);
    setIsLoading(true);

    try {
      //*
      const data = await import("./mock-response.json");
      await sleep(1000);
      // const data = await window.api.fetchCompletion(userData);
      /*/
      if (!data) {
        throw new Error("API response is empty");
      }
      //*/

      const {
        chatCompletion: {
          usage: { total_tokens, prompt_tokens, completion_tokens },
        },
      } = data;

      setUsageData({
        total: total_tokens,
        prompt: prompt_tokens,
        completion: completion_tokens,
      });

      setCoverLetterText(data.chatCompletion.choices[0].message.content);
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
          <MainForm onNavigate={handleShowSettings} onSubmit={handleSubmit} />

          {/* Page Two */}
          {page === "result" ? (
            <CoverLetterPage
              text={coverLetterText}
              onNavigate={handleCloseCoverLetter}
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
