import _ from "lodash";
const { merge } = _;
import {
    type FormPathLeaves,
    type SuperValidated,
    superValidate,
    type SuperValidateOptions,
    type SuperForm,
    superForm,
    type FormOptions,
    dateProxy,
    formFieldProxy,
    numberProxy,
} from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { AnyZodObject, z } from "zod";

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
    columns?: number;
    fields?: { [key in keyof T]?: FieldConfig | false };
};
export type Layout<T extends Record<string, unknown>> = {
    columns: number;
    fields: Record<keyof T, FieldConfig | false>;
};

export { default as Form } from "./SuperForm.svelte";
export { default as Input } from "./Input.svelte";
export { default as SuperInput } from "./SuperInput.svelte";
export { default as Typeahead } from "./Typeahead.svelte";
export { default as LabeledIcon } from "./LabeledIcon.svelte";

export async function wizCreate<T extends AnyZodObject>(
    schema: T,
    action: string,
    layout?: PartialLayout<z.infer<T>>,
    options?: SuperValidateOptions
) {
    function getLayoutOptions(schema: T): Layout<z.infer<T>> {
        const defaultLayout = {
            columns: 1,
            fields: {},
        };

        return Object.entries(schema._def.shape()).reduce(
            (layout, [name, value]) => {
                while (value._def.innerType) {
                    value = value._def.innerType;
                }
                switch (value._def.typeName.toLowerCase().replace("zod", "")) {
                    case "number":
                        layout.fields[name] = { type: "number" };
                        break;
                    case "date":
                        layout.fields[name] = { type: "date" };
                        break;
                    case "boolean":
                        layout.fields[name] = { type: "checkbox" };
                        break;
                    default:
                        layout.fields[name] = {};
                        break;
                }
                return layout;
            },
            Object.assign({}, defaultLayout)
        );
    }
    const form = await superValidate(zod(schema));
    const layoutOptions: Layout<z.infer<T>> = merge(
        getLayoutOptions(schema),
        layout
    );

    return { form, action, layout: layoutOptions };
}

export function wizForm<T extends AnyZodObject, M = any>(
    validated: {
        form: SuperValidated<z.infer<T>, M>;
        layout: Layout<z.infer<T>>;
        action: string;
    },
    options: FormOptions<z.infer<T>, M> = {}
) {
    return {
        action: validated.action,
        layout: validated.layout,
        form: superForm(validated.form, options),
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
    T extends AnyZodObject,
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
