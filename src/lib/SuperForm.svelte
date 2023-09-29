<script lang="ts" generics="T extends AnyZodObject">
    import type { ZodValidation } from "sveltekit-superforms";
    import type { SuperForm } from "sveltekit-superforms/client";
    import type { AnyZodObject } from "zod";
    import { LabeledIcon, SuperInput } from "$lib";
    import type { FieldConfig, Layout } from "./index.js";
    import { merge } from "lodash";

    type Form = SuperForm<ZodValidation<T>, unknown>;

    export let id: string | undefined = undefined;
    let formWithLayout: {
        form: Form;
        layoutOptions: Layout<Form>;
        action: string;
    };
    export { formWithLayout as form };
    const {
        form,
        layoutOptions: defaultLayout,
        action: defaultAction,
    } = formWithLayout;
    const { enhance } = form;
    export let layout: Layout<Form> | undefined = undefined;
    export let action = defaultAction;
    let final: Layout<Form>;
    $: final =
        layout != undefined ? merge(defaultLayout, layout) : defaultLayout;

    let fields: [string, FieldConfig][];
    $: if (final.fields != undefined) {
        fields = Object.entries(final.fields);
    }
</script>

<form
    {id}
    {action}
    class="container mx-auto p-4 grid gap-2"
    style="grid-template-columns: repeat({final.columns}, minmax(0, 1fr))"
    method="POST"
    use:enhance
>
    {#each fields as [field, { type, label, colSpan, items, searchable, indexType, hidden }]}
        <SuperInput
            {form}
            {field}
            {type}
            {label}
            {colSpan}
            {items}
            {searchable}
            {indexType}
            {hidden}
        />
    {/each}
    {#if !final.noButtons}
        {#if final.buttons}
            {#each final.buttons as { icon, text, classes }}
                <button class="btn rounded-md variant-filled w-min {classes}">
                    {#if icon}
                        <LabeledIcon {icon}>{text}</LabeledIcon>
                    {:else}
                        {text}
                    {/if}
                </button>
            {/each}
        {:else}
            <button class="btn rounded-md variant-filled w-min">Submit</button>
        {/if}
    {/if}
</form>
