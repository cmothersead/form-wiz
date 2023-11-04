<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import type { InputType, Item } from "$lib";
    import { Typeahead } from "$lib";

    export let id: string;
    export let name = "";
    export let autocomplete = "off";
    export let disabled = false;
    export let errors: Writable<string[] | undefined> = writable([]);
    export let files = undefined;
    export let label = "";
    export let multiple = false;
    export let placeholder = "";
    export let type: keyof typeof InputType;
    export let items: Item[] = [];
    export let searchable = false;
    export let min = "";
    export let max = "";
    export let hidden = false;

    export let value: string | number | Date | boolean;
    let checked = type === "checkbox" && value === true ? true : false;
    $: if (type === "checkbox") value = checked;

    export let labelClass = "";
    export let inputClass = "";
    const baseInputClasses = type === "checkbox" ? "checkbox" : "input";
    const baseLabelClasses =
        type === "checkbox" ? "flex gap-2 items-center h-full" : "label";
    $: inputClasses = `${baseInputClasses} ${inputClass}`.trim();
    $: labelClasses = `${baseLabelClasses} ${labelClass}`.trim();

    export let colSpan = 1;
</script>

<label
    for={id}
    class={labelClasses}
    style="grid-column-start: span {colSpan}"
    {hidden}
>
    <span>{label}</span>
    {#if type === "text"}
        <input
            {id}
            {...$$restProps}
            class={inputClasses}
            type="text"
            bind:value
            {disabled}
            {name}
            {placeholder}
            {autocomplete}
        />
    {:else if type === "password"}
        <input
            {id}
            {...$$restProps}
            class={inputClasses}
            type="password"
            bind:value
            {disabled}
            {name}
            {placeholder}
        />
    {:else if type === "color"}
        <input
            {id}
            {...$$restProps}
            class={inputClasses}
            type="color"
            bind:value
            {disabled}
            {name}
            {placeholder}
        />
    {:else if type === "email"}
        <input
            {id}
            {...$$restProps}
            class={inputClasses}
            type="email"
            bind:value
            {disabled}
            {multiple}
            {name}
            {placeholder}
            {autocomplete}
        />
    {:else if type === "file"}
        <input
            {id}
            {...$$restProps}
            class={inputClasses}
            type="file"
            bind:files
            bind:value
            {disabled}
            {multiple}
            {name}
            {placeholder}
        />
    {:else if type === "url"}
        <input
            {id}
            {...$$restProps}
            class={inputClasses}
            type="url"
            bind:value
            {disabled}
            {name}
            {placeholder}
        />
    {:else if type === "number"}
        <input
            {id}
            {...$$restProps}
            class={inputClasses}
            type="number"
            bind:value
            {name}
            {disabled}
            {placeholder}
            {min}
            {max}
        />
    {:else if type === "date"}
        <input
            {id}
            {...$$restProps}
            class={inputClasses}
            type="date"
            value={value
                ? new Date(value).toISOString().split("T")[0]
                : undefined}
            on:blur={(e) => (value = e.currentTarget.value)}
            on:input={(e) => {
                const val = e.currentTarget.value;
                if (/^[1-9]\d{3}-\d\d-\d\d$/.test(val)) value = val;
            }}
            {disabled}
            {name}
            {placeholder}
        />
    {:else if type === "datetime-local"}
        <input
            {id}
            {...$$restProps}
            class={inputClasses}
            type="datetime-local"
            bind:value
            {disabled}
            {name}
            {placeholder}
            {min}
            {max}
        />
    {:else if type === "month"}
        <input
            {id}
            {...$$restProps}
            class={inputClasses}
            type="month"
            bind:value
            {disabled}
            {name}
            {placeholder}
        />
    {:else if type === "range"}
        <input
            {id}
            {...$$restProps}
            type="range"
            bind:value
            class={inputClasses}
            {name}
            {disabled}
            {placeholder}
        />
    {:else if type === "search"}
        <input
            {id}
            {...$$restProps}
            class={inputClasses}
            type="search"
            bind:value
            {disabled}
            {name}
            {placeholder}
            {autocomplete}
        />
    {:else if type === "tel"}
        <input
            {id}
            {...$$restProps}
            class={inputClasses}
            type="tel"
            bind:value
            {disabled}
            {name}
            {placeholder}
        />
    {:else if type === "typeahead"}
        <Typeahead
            {id}
            {name}
            bind:value
            {items}
            {searchable}
            inputClass={inputClasses}
        />
    {:else if type == "select"}
        <select
            {id}
            {...$$restProps}
            {name}
            class={inputClasses}
            bind:value
            {disabled}
        >
            {#each items as { value, label }}
                <option {value}>{label}</option>
            {/each}
            <slot />
        </select>
    {:else if type == "checkbox"}
        <input
            {id}
            {...$$restProps}
            {name}
            class={inputClasses}
            type="checkbox"
            bind:checked
            {disabled}
        />
    {/if}
    {#if $errors && $errors.length > 0}
        <small class="text-error-500">{$errors}</small>
    {/if}
</label>
