<script lang="ts" generics="T extends AnyZodObject">
  import type { ZodValidation } from "sveltekit-superforms";
  import type { SuperForm } from "sveltekit-superforms/client";
  import type { AnyZodObject, z } from "zod";
  import type { InputType, Item } from "$lib";
  import { LabeledIcon, SuperInput } from "$lib";
  import type { Layout } from "./index.js";
  import { enhance } from "$app/forms";
  import { merge } from 'lodash';

  type Form = SuperForm<ZodValidation<T>, unknown>;

  let enhanceCallback = "";
  export { enhanceCallback as enhance };
  const test = enhanceCallback;
  export let id: string | undefined = undefined;
  export let form: Form;
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
  const defaultLayout: Layout<Form> = {
    columns: 1,
    fields: Object.entries($formData).reduce((acc, [name, value]) => {
      console.log({ name, value, nan: typeof value == "number" });
      if (typeof value === "number") {
        return { ...acc, [name]: { type: "number" } };
      }
      return { ...acc, [name]: { type: "text" } };
    }, {}),
  };
  console.log({ defaultLayout });
  $: final =
    layout != undefined
      ? merge(defaultLayout, layout)
      : defaultLayout;

  // const { enhance } = useEnhance ? form : dummyEnhance;
  $: fields = Object.entries(final.fields);
  $: console.log({ fields });
  $: console.log({ final });
</script>

<form
  {id}
  {action}
  class="container mx-auto p-4 grid gap-y-2 gap-x-4"
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
