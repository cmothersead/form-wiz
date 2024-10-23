<script lang="ts" generics="T extends AnyZodObject">
    import type { ZodValidation } from "sveltekit-superforms";
    import type { SuperForm } from "sveltekit-superforms/client";
    import type { AnyZodObject } from "zod";
    import { LabeledIcon, SuperInput } from "$lib";
    import type { FieldConfig, Layout } from "./index.js";
    import _ from "lodash";

    const { merge } = _;

    type Form = SuperForm<ZodValidation<T>, unknown>;

    let {
        id = undefined,
        form: formWithLayout,
        layout = formWithLayout.layout,
        action = formWithLayout.action,
    }: {
        id?: string | undefined;
        form: { form: Form; layout: Layout<Form>; action: string };
        layout?: Layout<Form> | undefined;
        action?: string;
    } = $props();

    const { form } = formWithLayout;
    const { enhance } = form;

    // let final: Layout<Form> = $derived(
    //     layout != undefined ? merge(defaultLayout, layout) : defaultLayout
    // );

    let fields: [string, FieldConfig][] = $state([]);
    $effect(() => {
        if (layout.fields != undefined) {
            fields = Object.entries(layout.fields).filter(
                ([, field]) => field != false
            ) as [string, FieldConfig][];
        }
    });
</script>

<form {id} {action} class="container mx-auto p-4" method="POST" use:enhance>
    <div class="flex flex-col gap-4">
        <div
            class="grid gap-2"
            style="grid-template-columns: repeat({layout.columns}, minmax(0, 1fr))"
        >
            {#each fields as [field, { type, label, colSpan, items, searchable, indexType, hidden, min, max }]}
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
                    {min}
                    {max}
                />
            {/each}
        </div>
        <button class="btn variant-filled">Submit</button>
    </div>
</form>
