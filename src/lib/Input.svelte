<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import type { InputType, Item } from "$lib";
    import { Typeahead } from "$lib";

    let {
        id,
        name = "",
        autocomplete = "off",
        disabled = false,
        errors = writable([]),
        files = undefined,
        label = "",
        multiple = false,
        placeholder = "",
        type,
        items = [],
        searchable = false,
        min = "",
        max = "",
        hidden = false,
        value = $bindable(),
        labelClass = "",
        inputClass = "",
        colSpan = 1,
        ...rest
    }: {
        id: string;
        name: string;
        autocomplete: AutoFill | null | undefined;
        disabled: boolean;
        errors: Writable<string[] | undefined>;
        files: FileList | null | undefined;
        label: string;
        multiple: boolean;
        placeholder: string;
        type: keyof typeof InputType;
        items: Item[];
        searchable: boolean;
        min: string;
        max: string;
        hidden: boolean;
        value: string | number | Date | boolean;
        labelClass: string;
        inputClass: string;
        colSpan: number;
    } = $props();

    let checked = $state(type === "checkbox" && value === true ? true : false);
    $effect(() => {
        if (type === "checkbox") value = checked;
    });

    const baseInputClasses = type === "checkbox" ? "checkbox" : "input";
    const baseLabelClasses =
        type === "checkbox" ? "flex gap-2 items-center h-full" : "label";
    let inputClasses = $derived(`${baseInputClasses} ${inputClass}`.trim());
    let labelClasses = $derived(`${baseLabelClasses} ${labelClass}`.trim());
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
            {...rest}
            {id}
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
            {...rest}
            {id}
            class={inputClasses}
            type="password"
            bind:value
            {disabled}
            {name}
            {placeholder}
        />
    {:else if type === "color"}
        <input
            {...rest}
            {id}
            class={inputClasses}
            type="color"
            bind:value
            {disabled}
            {name}
            {placeholder}
        />
    {:else if type === "email"}
        <input
            {...rest}
            {id}
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
            {...rest}
            {id}
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
            {...rest}
            {id}
            class={inputClasses}
            type="url"
            bind:value
            {disabled}
            {name}
            {placeholder}
        />
    {:else if type === "number"}
        <input
            {...rest}
            {id}
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
            {...rest}
            {id}
            class={inputClasses}
            type="date"
            value={value
                ? new Date(value).toISOString().split("T")[0]
                : undefined}
            onblur={(e) => (value = e.currentTarget.value)}
            oninput={(e) => {
                const val = e.currentTarget.value;
                if (/^[1-9]\d{3}-\d\d-\d\d$/.test(val)) value = val;
            }}
            {disabled}
            {name}
            {placeholder}
        />
    {:else if type === "datetime-local"}
        <input
            {...rest}
            {id}
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
            {...rest}
            {id}
            class={inputClasses}
            type="month"
            bind:value
            {disabled}
            {name}
            {placeholder}
        />
    {:else if type === "range"}
        <input
            {...rest}
            {id}
            type="range"
            bind:value
            class={inputClasses}
            {name}
            {disabled}
            {placeholder}
        />
    {:else if type === "search"}
        <input
            {...rest}
            {id}
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
            {...rest}
            {id}
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
            {...rest}
            {id}
            {name}
            class={inputClasses}
            bind:value
            {disabled}
        >
            {#each items as { value, label }}
                <option {value}>{label}</option>
            {/each}
        </select>
    {:else if type == "checkbox"}
        <input
            {...rest}
            {id}
            {name}
            class={inputClasses}
            type="checkbox"
            bind:checked
            {disabled}
        />
    {/if}
    {#if $errors && $errors.length > 0}
        <small class="text-error-500">{errors}</small>
    {/if}
</label>
