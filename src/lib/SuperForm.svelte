<script lang="ts">
    import type { SuperForm } from "sveltekit-superforms";
    import { SuperInput } from "$lib";
    import type { FieldConfig, Layout } from "./index.js";
    import type { Snippet } from "svelte";
    import { merge } from "lodash-es";

    type Form = SuperForm<Record<string, unknown>, unknown>;

    let {
        id = undefined,
        form,
        layout = form.layout,
        action = form.action,
        header,
        buttons,
        footer,
    }: {
        id?: string | undefined;
        form: Form & { layout: Layout<Form>; action: string };
        layout?: Layout<Form> | undefined;
        action?: string;
        header?: Snippet;
        buttons?: Snippet;
        footer?: Snippet;
    } = $props();

    const { enhance } = form;

    let final: Layout<Form> = $derived(
        layout != undefined ? merge(form.layout, layout) : form.layout
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
