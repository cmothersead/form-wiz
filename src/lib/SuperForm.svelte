<script lang="ts">
  import type { FormPathLeaves, ZodValidation } from "sveltekit-superforms";
  import type { SuperForm } from "sveltekit-superforms/client";
  import type { AnyZodObject, z } from "zod";
  import type { InputType, Item } from "$lib";
  import SuperInput from "./SuperInput.svelte";
  import { LabeledIcon } from "$lib/components";

  type T = $$Generic<AnyZodObject>;
  type Form = SuperForm<ZodValidation<T>, unknown>;
  type Fields = FormPathLeaves<z.infer<T>>;
  type FieldConfig = {
    type?: keyof typeof InputType;
    label?: string;
    colSpan?: number;
    items?: Item[];
    searchable?: boolean;
    indexType?: "string" | "number";
  };

  export let id: string | undefined = undefined;
  export let form: Form;
  export let layout: {
    columns: number;
    fields: {
      [key in Fields]: FieldConfig;
    };
    noButtons?: boolean;
    buttons?: { icon?: string; text: string; classes?: string }[];
  };
  export let action = "";
  export let useEnhance = false;
  const dummyEnhance = {
    enhance: (el: any) => {
      return {
        destroy: () => {},
      };
    },
  };
  const { enhance } = useEnhance ? form : dummyEnhance;
  $: fields = Object.entries(layout.fields) as unknown as [
    Fields,
    FieldConfig
  ][];
</script>

<form
  {id}
  {action}
  class="container mx-auto p-4 grid gap-y-2 gap-x-4"
  style="grid-template-columns: repeat({layout.columns}, minmax(0, 1fr))"
  method="POST"
  use:enhance
>
  {#each fields as [field, { type, label, colSpan, items, searchable, indexType }]}
    <SuperInput
      {form}
      {field}
      {type}
      {label}
      {colSpan}
      {items}
      {searchable}
      {indexType}
    />
  {/each}
  {#if !layout.noButtons}
    {#if layout.buttons}
      {#each layout.buttons as { icon, text, classes }}
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
