import { useState } from "react";
import MainForm from "./components/main-form";
import SettingsForm from "./components/settings-form";
import "./index.css";
import { type FormValues } from "./lib/schemas/form-schema";
import type { UserData } from "./types/data";

function App() {
  const [page, setPage] = useState<"main" | "settings" | "result">("main");
  const [coverLetterText, setCoverLetterText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estimatedTokens, setEstimatedTokens] = useState(0);
  const [usageData, setUsageData] = useState({
    total: 0,
    prompt: 0,
    completion: 0,
  });

  function onSubmit(data: FormValues) {
    // window.api?.setStoreValues(data.settings);

    fetchCoverLetterText(data);
  }

  function handleShowSettings() {
    setPage("settings");
  }

  function handleCloseSettings() {
    setPage("main");
  }

  async function fetchCoverLetterText(userData: UserData) {
    setCoverLetterText("");
    setError(null);
    setIsLoading(true);

    try {
      /* if (!window.api?.fetchCompletion) {
        throw new Error("API not available");
      } */

      const data = await import("./mock-response.json");
      // const data = await window.api.fetchCompletion(userData);

      if (!data) {
        throw new Error("API response is empty");
      }

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
            transform: `translateX(${page === "main" ? "0" : "-100%"})`,
          }}
        >
          {/* Page One */}
          <MainForm onNavigate={handleShowSettings} />

          {/* Page Two */}
          <SettingsForm onNavigate={handleCloseSettings} />
        </div>
      </div>
    </>
  );
}

export default App;
