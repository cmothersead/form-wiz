import _ from "lodash";
const { merge } = _;
import type {
    FormPathLeaves,
    SuperValidated,
    UnwrapEffects,
    ZodValidation,
} from "sveltekit-superforms";
import {
    superValidate,
    type SuperForm,
    superForm,
    type FormOptions,
    dateProxy,
    formFieldProxy,
    numberProxy,
} from "sveltekit-superforms/client";
import type { SuperValidateOptions } from "sveltekit-superforms/server";
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
};
export type Schema<F> = F extends ZodValidation<infer T>
    ? T
    : F extends SuperForm<ZodValidation<infer T>, unknown>
    ? T
    : F extends SuperValidated<infer T, unknown>
    ? T
    : never;
export type Layout<
    F extends
        | ZodValidation<T>
        | SuperForm<ZodValidation<T>, unknown>
        | SuperValidated<T, unknown>,
    T extends AnyZodObject = Schema<F>
> = {
    columns?: number;
    fields?: {
        [key in FormPathLeaves<z.infer<Schema<F>>>]?: FieldConfig | false;
    };
};

export { default as Form } from "./SuperForm.svelte";
export { default as Input } from "./Input.svelte";
export { default as SuperInput } from "./SuperInput.svelte";
export { default as Typeahead } from "./Typeahead.svelte";
export { default as LabeledIcon } from "./LabeledIcon.svelte";

export async function wizCreate<T extends ZodValidation<AnyZodObject>>(
    schema: T,
    action: string,
    layout?: Layout<SuperValidated<T>>,
    options?: SuperValidateOptions
) {
    function getLayoutOptions(schema: T): Layout<SuperValidated<T>> {
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
    const form = await superValidate(schema, options);
    const layoutOptions: Layout<SuperValidated<T>> = merge(
        getLayoutOptions(schema),
        layout
    );

    return { form, action, layoutOptions };
}

export function wizForm<T extends ZodValidation<AnyZodObject>, M = any>(
    validated: {
        form: SuperValidated<T, M>;
        layoutOptions: Layout<T>;
        action: string;
    },
    options: FormOptions<UnwrapEffects<T>, M> = {}
) {
    return {
        action: validated.action,
        layoutOptions: validated.layoutOptions,
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
    T extends ZodValidation<AnyZodObject>,
    Path extends FormPathLeaves<z.infer<UnwrapEffects<T>>>
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
        proxy.value = numberProxy(form.form, path);
    }
    return proxy;
}
