<script lang="ts">
    import type { FormPathLeaves, ZodValidation } from "sveltekit-superforms";
    import type { z, AnyZodObject } from "zod";

    import { Input, type Item, InputType } from "$lib";
    import {
        formFieldProxy,
        type SuperForm,
    } from "sveltekit-superforms/client";
    import { startCase } from "lodash";

    type T = $$Generic<AnyZodObject>;

    export let form: SuperForm<ZodValidation<T>, unknown>;
    export let field: FormPathLeaves<z.infer<T>>;

    export let id = String(field);
    export let autocomplete = "off";
    export let disabled = false;
    export let files = undefined;
    export let label = startCase(String(field));
    export let multiple = false;
    export let name = String(field);
    export let placeholder = "";
    export let type: keyof typeof InputType = "text";
    export let colSpan = 1;
    export let items: Item[] = [];
    export let searchable = false;
    export let indexType: "string" | "number" = "string";
    export let min = "";
    export let max = "";
    export let hidden = false;

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
        : type === InputType.typeahead
        ? indexType
        : "string";

    const { value, errors } = formFieldProxy(form, field);

    export let labelClass = "";
    export let inputClass = "";
    const baseInputClasses = "";
    const baseLabelClasses = "";
    $: labelClasses = `${baseLabelClasses} ${labelClass}`;
    $: inputClasses = `${baseInputClasses} ${inputClass}`;
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
    {$errors}
    inputClass={inputClasses}
    labelClass={labelClasses}
    {colSpan}
    {min}
    {max}
    {hidden}
/>
