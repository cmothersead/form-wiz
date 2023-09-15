<script lang="ts" generics="T extends AnyZodObject">
  import type { ZodValidation } from "sveltekit-superforms";
  import type { SuperForm } from "sveltekit-superforms/client";
  import type { AnyZodObject } from "zod";
  import { LabeledIcon, SuperInput } from "$lib";
  import type { FieldConfig, Layout } from "./index.js";
  import { enhance } from "$app/forms";
  import { merge } from "lodash";

  type Form = SuperForm<ZodValidation<T>, unknown>;

  let enhanceCallback = "";
  export { enhanceCallback as enhance };
  const test = enhanceCallback;
  export let id: string | undefined = undefined;
  let formWithLayout: { form: Form; layoutOptions: Layout<Form> };
  export { formWithLayout as form };
  const { form, layoutOptions: defaultLayout } = formWithLayout;
  export let layout: Layout<Form> | undefined = undefined;
  export let action = "";
  // export let useEnhance = false;
  const dummyEnhance = {
    enhance: (el: any) => {
      return {
        destroy: () => {},
      };
    },
  };
  const formData = form.form;
  let final: Layout<Form>;
  $: final = layout != undefined ? merge(defaultLayout, layout) : defaultLayout;

  // const { enhance } = useEnhance ? form : dummyEnhance;
  let fields: [string, FieldConfig][];
  $: if (final.fields != undefined) {
    fields = Object.entries(final.fields);
  }
</script>

<form
  {id}
  {action}
  class="container mx-auto p-4 grid gap-2 items-center"
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
