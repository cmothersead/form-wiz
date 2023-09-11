<script lang="ts">
	import { writable, type Writable } from 'svelte/store';

	export let errors: Writable<string[] | undefined> = writable([]);
	export let label = '';
	export let name = '';
	export let options: { value: string | number; label: string }[] = [];
	export let value = '';

	let classNames = '';
	export { classNames as class };
	const baseClasses = 'input rounded-md cursor-pointer';
	$: classes = `${baseClasses} ${classNames}`;
</script>

<label class="label">
	<span>{label}</span>
	<select {name} class={classes} bind:value>
		{#each options as { value, label }}
			<option {value}>{label}</option>
		{/each}
		<slot />
	</select>
	{#if $errors && $errors.length > 0}
		<small class="text-error-500">{$errors}</small>
	{/if}
</label>
