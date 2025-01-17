import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type SettingsValues, settingsSchema } from "@/lib/schemas/form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

function SettingsForm({ onNavigate }: { onNavigate: () => void }) {
  // const { control } = useFormContext<FormValues>();
  const models = settingsSchema.shape.model._def.values;

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    mode: "onChange",
    defaultValues: {
      apiKey: "",
      name: "",
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      wordLimit: 300,
      workExperience: "",
    },
    /* {
        apiKey: "abc123",
        name: "Jose Espejo",
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        wordLimit: 300,
        workExperience:
          "I am a frontend developer with 4 years of experience in React, Vue and TypeScript. In my last job I worked at a leading marketing agency; Tribal Worldwide, where our main client was Volkswagen and its subsidies Skoda and SEAT. I was a part of a team that developed and maintained a series of web apps in React and Typescript. A selection of my work can be viewed at https://joseespejo.info",
      }, */
  });

  const {
    control,
    // handleSubmit,
    formState: { isValid, errors },
    watch,
  } = form;

  return (
    <div className="relative flex h-full min-w-full flex-col p-8 text-left">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4"
        onClick={onNavigate}
      >
        <X />
      </Button>
      <h1 className="text-base font-bold">Settings</h1>
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})}>
            <div className="mt-4 flex flex-col gap-4">
              <FormField
                control={control}
                name="apiKey"
                render={({ field, formState: { errors } }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="flex text-xs">
                      OpenAI API Key{" "}
                      {errors?.apiKey?.message &&
                        `. ${errors?.apiKey?.message}`}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your API key"
                        {...field}
                        className="w-full autofill:shadow-[inset_0_0_0px_1000px_hsl(var(--background))]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="row-of-inputs flex justify-between gap-4">
                <FormField
                  control={control}
                  name="name"
                  render={({ field, formState: { errors } }) => (
                    <FormItem className="flex flex-1 flex-col gap-1">
                      <FormLabel className="flex text-xs">
                        Name
                        {errors?.name?.message && `. ${errors?.name?.message}`}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. John Smith"
                          {...field}
                          className="w-full autofill:shadow-[inset_0_0_0px_1000px_hsl(var(--background))]"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="model"
                  render={({ field, formState: { errors } }) => (
                    <FormItem className="flex flex-1 flex-col gap-1">
                      <FormLabel className="flex text-xs">
                        Model
                        {errors?.model?.message &&
                          `. ${errors?.model?.message}`}
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger
                            className="w-full"
                            data-testid="settings-model-select-trigger"
                          >
                            <SelectValue placeholder="Model" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            {models.map((model) => (
                              <SelectItem key={model} value={model}>
                                {model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="temperature"
                  render={({ field, formState: { errors } }) => (
                    <FormItem className="flex flex-1 flex-col gap-1">
                      <FormLabel className="text-xs">
                        Temperature
                        {errors?.temperature?.message &&
                          `. ${errors?.temperature?.message}`}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step={0.1}
                          placeholder="0.7"
                          min={0.0}
                          max={2.0}
                          {...field}
                          onChange={(event) =>
                            field.onChange(Number(event.target.value))
                          }
                          className="w-full autofill:shadow-[inset_0_0_0px_1000px_hsl(var(--background))]"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="wordLimit"
                  render={({ field, formState: { errors } }) => (
                    <FormItem className="flex flex-1 flex-col gap-1">
                      <FormLabel className="flex text-xs">
                        Word Limit
                        {errors?.wordLimit?.message &&
                          `. ${errors?.wordLimit?.message}`}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="200"
                          step="100"
                          {...field}
                          onChange={(event) =>
                            field.onChange(Number(event.target.value))
                          }
                          className="w-full autofill:shadow-[inset_0_0_0px_1000px_hsl(var(--background))]"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-1">
                <FormField
                  control={control}
                  name="workExperience"
                  render={({ field, formState: { errors } }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="flex text-xs">
                        Work Experience
                        {errors?.workExperience?.message &&
                          `. ${errors?.workExperience?.message}`}
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={10} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {/*  TODO: Add skillset? */}
              {/* TODO: Add additional settings - e.g. British English */}
              <Button type="submit" disabled={!isValid}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
}

export default SettingsForm;
