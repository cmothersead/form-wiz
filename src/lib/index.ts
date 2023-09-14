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
    stringProxy,
    intProxy,
    booleanProxy,
    numberProxy,
    dateProxy,
    fieldProxy,
    formFieldProxy,
} from "sveltekit-superforms/client";
import type { SuperValidateOptions } from "sveltekit-superforms/server";
import type { AnyZodObject, z } from "zod";

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
        [key in FormPathLeaves<z.infer<Schema<F>>>]?: FieldConfig;
    };
    noButtons?: boolean;
    buttons?: { icon?: string; text: string; classes?: string }[];
};

export { default as Form } from "./SuperForm.svelte";
export { default as Input } from "./Input.svelte";
export { default as SuperInput } from "./SuperInput.svelte";
export { default as Typeahead } from "./Typeahead.svelte";
export { default as LabeledIcon } from "./LabeledIcon.svelte";

export async function wizValidate<T extends ZodValidation<any>>(
    data: unknown,
    schema?: T | SuperValidateOptions,
    options?: SuperValidateOptions
) {
    if (data && typeof data === "object" && "safeParseAsync" in data) {
        options = schema as SuperValidateOptions | undefined;
        schema = data as T;
        data = null;
    }
    const defaultLayout = {
        columns: 1,
        fields: {},
    };

    function getLayoutOptions(
        schema: ZodValidation<any>
    ): Layout<typeof schema> {
        return Object.entries(schema._def.shape()).reduce(
            (layout, [name, value]) => {
                switch (value._def.typeName.toLowerCase().replace("zod", "")) {
                    case "number":
                        layout.fields[name] = { type: "number" };
                        break;
                    case "date":
                        layout.fields[name] = { type: "date" };
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
    const form = await superValidate(data, schema, options);
    const layoutOptions: Layout<typeof form> = getLayoutOptions(schema);

    return { form, layoutOptions };
}

export function wizForm<T extends ZodValidation<AnyZodObject>, M = any>(
    validated: { form: SuperValidated<T, M>; layoutOptions: Layout<T> },
    options: FormOptions<UnwrapEffects<T>, M> = {}
) {
    return {
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
    format: "iso",
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
    switch (type) {
        case "number":
        case "int":
            proxy.value = numberProxy(form.form, path, options);
            break;
        case "boolean":
            proxy.value = booleanProxy(form.form, path, options);
            break;
        case "date":
            proxy.value = dateProxy(form.form, path, options);
            break;
        default:
            proxy.value = stringProxy(form.form, path, options);
            break;
    }
    return proxy;
}
