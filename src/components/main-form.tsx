import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import Spinner from "./ui/spinner";
import { Textarea } from "./ui/textarea";
import "@/index.css";
import {
  type FormValues,
  type MainFormValues,
  mainFormSchema,
} from "@/lib/schemas/form-schema";
import { countChars } from "@/lib/utils";
import { Settings, CornerUpRight } from "lucide-react";
import TokenCount from "./ui/token-count";
import { usePromptDataContext } from "@/contexts/prompt-data-context";

function MainForm({
  onNavigate,
  onSubmit,
  isLoading,
  error,
}: {
  onNavigate: (to: string) => void;
  onSubmit: (data: FormValues) => void;
  isLoading: boolean;
  error?: string | null;
}) {
  const [estimatedTokens, setEstimatedTokens] = useState(0);
  const { promptData, isSettingsValid, coverLetterText } =
    usePromptDataContext();

  const form = useForm<MainFormValues>({
    resolver: zodResolver(mainFormSchema),
    mode: "onChange",
    defaultValues: {
      salutation: "Dear Hiring Manager,",
      // jobDescription: "",
      jobDescription:
        "We are Awesome Co. and we are looking for a Software Engineer to join our team. You will be working on our core product, which is a platform that helps people write better cover letters. You will be responsible for building new features, fixing bugs, and improving the performance of our platform. The ideal candidate is passionate about writing clean code, has experience with React and Node.js, and is a great team player. If you are interested in this position, please send us your resume and a cover letter explaining why you are a good fit for this role.",
      additionalNotes: "",
    },
  });

  const {
    control,
    formState: { isValid },
    watch,
  } = form;

  function handleSubmit(data: MainFormValues) {
    const compositeData = { ...data, settings: promptData.settings };
    onSubmit(compositeData);
  }

  // TODO: Move to utils
  function getEstimatedTokens(formValues: MainFormValues) {
    const systemPromptChars = 500; // approx

    const {
      name = "",
      workExperience = "",
      wordLimit = 300,
    } = promptData.settings;

    const countableFormValues = {
      ...formValues,
      settings: { name, workExperience, wordLimit },
    };

    const formCharacterCount = countChars(countableFormValues);
    const total = formCharacterCount + systemPromptChars;

    return Math.round(total / 4);
  }

  // Calculate estimated tokens on main form change
  useEffect(() => {
    const subscription = watch((formValues) => {
      const tokens = getEstimatedTokens(formValues as MainFormValues);
      setEstimatedTokens(tokens);
    });

    return () => subscription.unsubscribe();
  }, [watch, promptData.settings]); // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate estimated tokens on prompt data change (settings)
  useEffect(() => {
    const tokens = getEstimatedTokens(form.getValues());
    setEstimatedTokens(tokens);
  }, [promptData]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative flex h-full min-w-full flex-col p-8 text-left">
      <Button
        variant="ghost"
        size="icon"
        className={`absolute right-4 top-4 ${!isSettingsValid ? "text-red-500" : ""}`}
        onClick={() => onNavigate("settings")}
      >
        <Settings />
      </Button>
      <h1 className="text-base font-bold">Generate cover letter</h1>
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="mt-4 flex flex-col gap-4">
              <FormField
                control={control}
                name="salutation"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="flex text-xs">
                      Salutation
                      <FormMessage className="text-xs" />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Dear Hiring Manager," {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="flex text-xs">
                      Job Description
                      <FormMessage className="text-xs" />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Paste job description here"
                        rows={10}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="flex text-xs">
                      Additional Notes (Optional)
                      <FormMessage className="text-xs" />
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={!isValid || !isSettingsValid}
                  className="flex-1"
                >
                  Generate
                </Button>
                {coverLetterText && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="self-end"
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                      event.preventDefault();
                      onNavigate("back to cover letter");
                    }}
                  >
                    <CornerUpRight />
                  </Button>
                )}
              </div>
              <TokenCount>
                Estimated token count in prompt: {estimatedTokens}
              </TokenCount>
            </div>
          </form>
        </Form>
      </FormProvider>
      {error && <div className="text-red-500">{error}</div>}
      {isLoading && (
        <div className="mt-4 flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}

export default MainForm;
