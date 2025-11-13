import { merge } from "lodash-es";
import {
    type SuperValidated,
    superValidate,
    type SuperForm,
    superForm,
    type FormOptions,
    type JSONSchema,
    type FormPathLeaves,
    formFieldProxy,
    dateProxy,
    numberProxy,
} from "sveltekit-superforms";
import type { ValidationAdapter } from "sveltekit-superforms/adapters";

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
type SuperValidateOptions<T> = {
    errors?: boolean; // Add or remove errors from output (valid status is always preserved)
    id?: string; // Form id, for multiple forms support. Set automatically by default
    preprocessed?: (keyof T)[]; // Bypass superValidate data coercion for posted fields in this array
    defaults?: T; // Override default values from the schema
    jsonSchema?: JSONSchema; // Override JSON schema from the adapter
    strict?: boolean; // If true, validate exactly the posted data, no defaults added
    allowFiles?: boolean; // If false, set all posted File objects to undefined
};

export { default as WizForm } from "./WizForm.svelte";
export { default as Input } from "./Input.svelte";
export { default as WizInput } from "./WizInput.svelte";
export { default as Typeahead } from "./Typeahead.svelte";
export { default as LabeledIcon } from "./LabeledIcon.svelte";

export async function wizCreate<T extends Record<string, unknown>>(
    adapter: ValidationAdapter<T>,
    action: string,
    layout?: PartialLayout<T>,
    options?: SuperValidateOptions<T>
): Promise<SuperValidated<T> & { action: string; layout: Layout<T> }> {
    function getLayoutOptions(adapter: ValidationAdapter<T>): Layout<T> {
        const defaultLayout = {
            columns: 1,
            fields: {},
        } as Layout<T>;

        if (adapter.jsonSchema.properties == undefined) {
            return defaultLayout;
        }

        return Object.entries(adapter.jsonSchema.properties).reduce(
            (layout, [name, value]) => {
                switch (value.type) {
                    case "number":
                        layout.fields[name as keyof T] = {
                            type: "number",
                        };
                        break;
                    case "date":
                        layout.fields[name as keyof T] = {
                            type: "date",
                        };
                        break;
                    case "boolean":
                        layout.fields[name as keyof T] = {
                            type: "checkbox",
                        };
                        break;
                    default:
                        layout.fields[name as keyof T] = {};
                        break;
                }
                return layout;
            },
            defaultLayout
        );
    }
    const form = await superValidate(adapter, options);
    const layoutOptions: Layout<T> = merge(getLayoutOptions(adapter), layout);

    return { ...form, action, layout: layoutOptions };
}

export function wizValidate<T extends Record<string, unknown>>(
    request: Request,
    schema: T,
    adapter: (schema: T) => ValidationAdapter<T>
) {
    return superValidate(request, adapter(schema));
}

export function wizForm<T extends Record<string, unknown>, M = any>(
    validated: SuperValidated<T, M> & {
        layout: Layout<T>;
        action: string;
    },
    options: FormOptions<T, M> = {}
): SuperForm<T> & {
    layout: Layout<T>;
    action: string;
} {
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
    T extends Record<string, unknown>,
    Path extends FormPathLeaves<T>
>(
    form: SuperForm<T>,
    path: Path,
    type: "number" | "int" | "boolean" | "date" | "string" = "string",
    options: DefaultOptions = defaultOptions
) {
    const proxy = formFieldProxy(form, path);
    if (type === "date") {
        proxy.value = dateProxy(form.form, path, options);
    }
    if (type === "number") {
        proxy.value = numberProxy(form.form, path, options);
    }
    return proxy;
}
