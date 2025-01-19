import { useState } from "react";
import { Button } from "./ui/button";
import CopiableTextarea from "./ui/copiable-textarea";
import TokenCount from "./ui/token-count";
import { Undo2 } from "lucide-react";

function CoverLetterPage({
  text,
  onNavigate,
}: {
  text: string;
  onNavigate: () => void;
}) {
  const [coverLetterText, setCoverLetterText] = useState(text);

  return (
    <div className="relative flex h-full min-w-full flex-col p-8 text-left">
      <Button
        variant="ghost"
        size="icon"
        className={`absolute right-4 top-4`}
        onClick={onNavigate}
      >
        <Undo2 />
      </Button>
      <h1 className="text-base font-bold">Cover Letter</h1>
      <CopiableTextarea
        value={coverLetterText}
        className="mt-4"
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
          setCoverLetterText(event.target?.value)
        }
      />
      {/* <TokenCount>
        Tokens Used: {usageData.total} (Prompt: {usageData.prompt}
        /Completion: {usageData.completion})
      </TokenCount> */}
    </div>
  );
}

export default CoverLetterPage;
