import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
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
import { type FormValues, formSchema } from "@/lib/schemas/form-schema";
import { useFormContext } from "react-hook-form";
import { Input } from "./input";
import { Textarea } from "./textarea";

function SettingsAccordion({
  accordionValue,
  setAccordionValue,
  hasErrors,
}: {
  accordionValue: string;
  setAccordionValue: (value: string) => void;
  hasErrors: boolean;
}) {
  const { control } = useFormContext<FormValues>();
  const models = formSchema.shape.settings.shape.model._def.values;

  function handleAccordionChange(value: string) {
    setAccordionValue(value);
  }

  return (
    <Accordion
      type="single"
      collapsible
      className=""
      value={accordionValue}
      onValueChange={handleAccordionChange}
    >
      <AccordionItem value="fields" className="">
        <AccordionTrigger
          className={`rounded-lg border bg-neutral-800 px-4 text-sm ${hasErrors ? "border-red-500 text-red-500" : ""}`}
          data-testid="settings-accordion-trigger"
        >
          Settings
        </AccordionTrigger>
        <AccordionContent className="px-4">
          <div className="mt-4 flex flex-col gap-4">
            <FormField
              control={control}
              name="settings.apiKey"
              render={({ field, formState: { errors } }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="flex text-xs">
                    OpenAI API Key
                    {errors?.settings?.apiKey?.message &&
                      `. ${errors?.settings?.apiKey?.message}`}
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
                name="settings.name"
                render={({ field, formState: { errors } }) => (
                  <FormItem className="flex flex-1 flex-col gap-1">
                    <FormLabel className="flex text-xs">
                      Name
                      {errors?.settings?.name?.message &&
                        `. ${errors?.settings?.name?.message}`}
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
                name="settings.model"
                render={({ field, formState: { errors } }) => (
                  <FormItem className="flex flex-1 flex-col gap-1">
                    <FormLabel className="flex text-xs">
                      Model
                      {errors?.settings?.model?.message &&
                        `. ${errors?.settings?.model?.message}`}
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
                name="settings.temperature"
                render={({ field, formState: { errors } }) => (
                  <FormItem className="flex flex-1 flex-col gap-1">
                    <FormLabel className="text-xs">
                      Temperature
                      {errors?.settings?.temperature?.message &&
                        `. ${errors?.settings?.temperature?.message}`}
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
                name="settings.wordLimit"
                render={({ field, formState: { errors } }) => (
                  <FormItem className="flex flex-1 flex-col gap-1">
                    <FormLabel className="flex text-xs">
                      Word Limit
                      {errors?.settings?.wordLimit?.message &&
                        `. ${errors?.settings?.wordLimit?.message}`}
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
                name="settings.workExperience"
                render={({ field, formState: { errors } }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="flex text-xs">
                      Work Experience
                      {errors?.settings?.workExperience?.message &&
                        `. ${errors?.settings?.workExperience?.message}`}
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {/*  TODO: Add skillset? */}
            {/* TODO: Add additional settings - e.g. British English */}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default SettingsAccordion;
