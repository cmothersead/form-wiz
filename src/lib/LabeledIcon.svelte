<script lang="ts">
	import Icon from '@iconify/svelte';

	let classes = '';
	export { classes as class };
	export let icon: string;
</script>

<div class="flex space-x-2 items-center {classes}">
	<Icon {icon} />
	<div>
		<slot />
	</div>
</div>
