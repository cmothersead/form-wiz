import { merge } from "lodash-es";
import {
    type FormPathLeaves,
    type SuperValidated,
    superValidate,
    type SuperForm,
    superForm,
    type FormOptions,
    dateProxy,
    formFieldProxy,
    numberProxy,
    type JSONSchema,
} from "sveltekit-superforms";
import { z, type ZodTypeAny } from "zod";

export const InputType = {
    checkbox: "checkbox",
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
    select: "select",
    tel: "tel",
    text: "text",
    time: "time",
    typeahead: "typeahead",
    url: "url",
} as const;

export type Item = { value: any; label: string; detail?: string };
export type FieldConfig = {
    type?: keyof typeof InputType;
    label?: string;
    colSpan?: number;
    items?: Item[];
    searchable?: boolean;
    indexType?: "string" | "number";
    hidden?: boolean;
    min?: number | Date;
    max?: number | Date;
};
export type PartialLayout<T extends Record<string, unknown>> = {
    title?: string;
    columns?: number;
    fields?: { [key in keyof T]?: FieldConfig | false };
};
export type Layout<T extends Record<string, unknown>> = {
    title?: string;
    columns: number;
    fields: Record<keyof T, FieldConfig | false>;
};
// Copied directly from Superforms documentation
type SuperValidateOptions<T extends ZodTypeAny> = {
    errors?: boolean; // Add or remove errors from output (valid status is always preserved)
    id?: string; // Form id, for multiple forms support. Set automatically by default
    preprocessed?: (keyof z.infer<T>)[]; // Bypass superValidate data coercion for posted fields in this array
    defaults?: T; // Override default values from the schema
    jsonSchema?: JSONSchema; // Override JSON schema from the adapter
    strict?: boolean; // If true, validate exactly the posted data, no defaults added
    allowFiles?: boolean; // If false, set all posted File objects to undefined
};

export { default as Form } from "./SuperForm.svelte";
export { default as Input } from "./Input.svelte";
export { default as SuperInput } from "./SuperInput.svelte";
export { default as Typeahead } from "./Typeahead.svelte";
export { default as LabeledIcon } from "./LabeledIcon.svelte";

export async function wizCreate<T extends ZodTypeAny>(
    schema: T,
    adapter: unknown,
    action: string,
    layout?: PartialLayout<z.infer<T>>,
    options?: SuperValidateOptions<T>
) {
    function getLayoutOptions(schema: T): Layout<z.infer<T>> {
        const defaultLayout = {
            columns: 1,
            fields: {},
        } as Layout<z.infer<T>>;

        return Object.entries(schema._def.shape()).reduce(
            (layout, [name, value]) => {
                while ((value as ZodTypeAny)._def.innerType) {
                    value = (value as ZodTypeAny)._def.innerType;
                }
                switch (
                    (value as ZodTypeAny)._def.typeName
                        .toLowerCase()
                        .replace("zod", "")
                ) {
                    case "number":
                        layout.fields[name as keyof z.infer<T>] = {
                            type: "number",
                        };
                        break;
                    case "date":
                        layout.fields[name as keyof z.infer<T>] = {
                            type: "date",
                        };
                        break;
                    case "boolean":
                        layout.fields[name as keyof z.infer<T>] = {
                            type: "checkbox",
                        };
                        break;
                    default:
                        layout.fields[name as keyof z.infer<T>] = {};
                        break;
                }
                return layout;
            },
            defaultLayout
        );
    }
    const form = await superValidate(adapter(schema), options);
    const layoutOptions: Layout<z.infer<T>> = merge(
        getLayoutOptions(schema),
        layout
    );

    return { ...form, action, layout: layoutOptions };
}

export function wizValidate<T extends ZodTypeAny>(
    request: Request,
    schema: T,
    adapter: unknown
) {
    return superValidate(request, adapter(schema));
}

export function wizForm<T extends ZodTypeAny, M = any>(
    validated: SuperValidated<z.infer<T>, M> & {
        layout: Layout<z.infer<T>>;
        action: string;
    },
    options: FormOptions<z.infer<T>, M> = {}
) {
    return {
        action: validated.action,
        layout: validated.layout,
        ...superForm(validated, options),
    };
}

type DefaultOptions = {
    trueStringValue: string;
    format:
        | "date"
        | "datetime"
        | "time"
        | "date-utc"
        | "datetime-utc"
        | "time-utc"
        | "date-local"
        | "datetime-local"
        | "time-local"
        | "iso";
    delimiter?: "." | ",";
    empty: "null" | "undefined";
    emptyIfZero?: boolean;
};

const defaultOptions: DefaultOptions = {
    trueStringValue: "true",
    format: "datetime-local",
    emptyIfZero: true,
    empty: "null",
};

export function typedFormFieldProxy<
    T extends ZodTypeAny,
    Path extends FormPathLeaves<z.infer<T>>
>(
    form: SuperForm<z.infer<T>>,
    path: Path,
    type: "number" | "int" | "boolean" | "date" | "string" = "string",
    options: DefaultOptions = defaultOptions
) {
    const proxy = formFieldProxy(form, path);
    if (type === "date") {
        proxy.value = dateProxy(form.form, path, options);
    }
    if (type === "number") {
        proxy.value = numberProxy(form.form, path);
    }
    return proxy;
}
