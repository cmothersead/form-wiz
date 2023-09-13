import type { FormPathLeaves, ZodValidation } from "sveltekit-superforms";
import type { SuperForm } from "sveltekit-superforms/client";
import type { AnyZodObject, ZodObject, z } from "zod";

export const InputType = {
    color: "color",
    date: "date",
    "datetime-local": "datetime-local",
    email: "email",
    file: "file",
    month: "month",
    number: "number",
    password: "password",
    range: "range",
    search: "search",
    tel: "tel",
    text: "text",
    time: "time",
    typeahead: "typeahead",
    url: "url",
} as const;

export type Item = { value: any; label: string };
type FieldConfig = {
    type?: keyof typeof InputType;
    label?: string;
    colSpan?: number;
    items?: Item[];
    searchable?: boolean;
    indexType?: "string" | "number";
};
type Schema<F> = F extends SuperForm<ZodValidation<infer T>, unknown>
    ? T
    : never;
export type Layout<
    F extends SuperForm<ZodValidation<T>, unknown>,
    T extends AnyZodObject = Schema<F>
> = {
    columns?: number;
    fields?: {
        [key in FormPathLeaves<z.infer<Schema<F>>>]: FieldConfig;
    };
    noButtons?: boolean;
    buttons?: { icon?: string; text: string; classes?: string }[];
};

export { default as Form } from "./SuperForm.svelte";
export { default as Input } from "./Input.svelte";
export { default as SuperInput } from "./SuperInput.svelte";
export { default as Typeahead } from "./Typeahead.svelte";
export { default as LabeledIcon } from "./LabeledIcon.svelte";
