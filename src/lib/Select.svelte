<script lang="ts">
    let {
        errors = [],
        label = "",
        name = "",
        options = [],
        value = "",
        class: classNames = "",
    }: {
        errors: string[] | undefined;
        label: string;
        name: string;
        options: { value: string | number; label: string }[];
        value: string;
        class: string;
    } = $props();

    const baseClasses = "input rounded-md cursor-pointer";
    let classes = $derived(`${baseClasses} ${classNames}`);
</script>

<label class="label">
    <span>{label}</span>
    <select {name} class={classes} bind:value>
        {#each options as { value, label }}
            <option {value}>{label}</option>
        {/each}
    </select>
    {#if errors && errors.length > 0}
        <small class="text-error-500">{errors}</small>
    {/if}
</label>
