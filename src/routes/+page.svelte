<script lang="ts">
    import { wizForm } from "$lib";
    import SuperDebug from "sveltekit-superforms";
    import SuperForm from "$lib/SuperForm.svelte";
    let { data } = $props();
    // let { layout } = $derived(data.form);
    const wizform = wizForm(data.form);
    const form = wizform.form;
</script>

<h1>Welcome to your library project</h1>
<p>
    Create your package using @sveltejs/package and preview/showcase your work
    with SvelteKit
</p>
<p>
    Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
<SuperDebug data={$form} />
<SuperForm form={wizform} />
