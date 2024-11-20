<script lang="ts" generics="T extends AnyZodObject">
    import type { SuperForm } from "sveltekit-superforms";
    import type { z, AnyZodObject } from "zod";
    import { LabeledIcon, SuperInput } from "$lib";
    import type { FieldConfig, Layout } from "./index.js";
    import _ from "lodash";
    import type { Snippet } from "svelte";

    const { merge } = _;

    type Form = SuperForm<z.infer<T>, unknown>;

    let {
        id = undefined,
        form: formWithLayout,
        layout = formWithLayout.layout,
        action = formWithLayout.action,
        header,
        buttons,
        footer,
    }: {
        id?: string | undefined;
        form: { form: Form; layout: Layout<Form>; action: string };
        layout?: Layout<Form> | undefined;
        action?: string;
        header?: Snippet;
        buttons?: Snippet;
        footer?: Snippet;
    } = $props();

    const { form } = formWithLayout;
    const { enhance } = form;

    let final: Layout<Form> = $derived(
        layout != undefined
            ? merge(formWithLayout.layout, layout)
            : formWithLayout.layout
    );

    let fields: [string, FieldConfig][] = $state([]);
    $effect(() => {
        if (final.fields != undefined) {
            fields = Object.entries(final.fields).filter(
                ([, field]) => field != false
            ) as [string, FieldConfig][];
        }
    });
</script>

<form {id} {action} class="p-4" method="POST" use:enhance>
    <div class="flex flex-col gap-4">
        {@render header?.()}
        {#if layout.title}
            <div class="text-2xl text-center">{layout.title}</div>
        {/if}
        <div
            class="grid gap-2"
            style="grid-template-columns: repeat({final.columns}, minmax(0, 1fr))"
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
        {#if buttons}
            {@render buttons()}
        {:else}
            <button class="btn preset-filled">Submit</button>
        {/if}
        {@render footer?.()}
    </div>
</form>
