<script lang="ts">
    import { typedFormFieldProxy } from "./index.js";

    import type {
        FormPathLeaves,
        ZodValidation,
        SuperForm,
    } from "sveltekit-superforms";
    import type { z, AnyZodObject } from "zod";

    import { Input, type Item, InputType } from "./index.js";
    import _ from "lodash";
    const { startCase } = _;

    type T = $$Generic<AnyZodObject>;

    let {
        form,
        field,
        id = String(field),
        autocomplete = "off",
        disabled = false,
        files = undefined,
        label = startCase(String(field)),
        multiple = false,
        name = String(field),
        placeholder = "",
        type = "text",
        colSpan = 1,
        items = [],
        searchable = false,
        indexType = "string",
        min = "",
        max = "",
        hidden = false,
        labelClass = "",
        inputClass = "",
    }: {
        form: SuperForm<ZodValidation<T>, unknown>;
        field: FormPathLeaves<z.infer<T>>;
        id: string;
        autocomplete: AutoFill | null | undefined;
        disabled: boolean;
        files: FileList | null | undefined;
        label: string;
        multiple: boolean;
        name: string;
        placeholder: string;
        type: keyof typeof InputType;
        colSpan: number;
        items: Item[];
        searchable: boolean;
        indexType: "string" | "number";
        min: string;
        max: string;
        hidden: boolean;
        labelClass: string;
        inputClass: string;
    } = $props();

    const dateTypes = [
        "date",
        "datetime",
        "datetime-local",
        "month",
        "time",
        "week",
    ];
    const numberTypes = ["number", "range"];
    const superType = dateTypes.includes(type)
        ? "date"
        : numberTypes.includes(type)
          ? "number"
          : type === "checkbox"
            ? "boolean"
            : type === "typeahead"
              ? indexType
              : "string";

    const { value, errors } = typedFormFieldProxy(form, field, superType);

    const baseInputClasses = "";
    const baseLabelClasses = "";
    let labelClasses = $derived(`${baseLabelClasses} ${labelClass}`);
    let inputClasses = $derived(`${baseInputClasses} ${inputClass}`);
</script>

<Input
    {id}
    {name}
    {autocomplete}
    {disabled}
    {files}
    {label}
    {multiple}
    {items}
    {searchable}
    {placeholder}
    {type}
    bind:value={$value}
    {errors}
    inputClass={inputClasses}
    labelClass={labelClasses}
    {colSpan}
    {min}
    {max}
    {hidden}
/>
<div class="bg-red-400" hidden></div>
