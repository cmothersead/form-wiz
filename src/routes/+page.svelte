<script lang="ts">
    import Form from "$lib/SuperForm.svelte";
    import { wizForm } from "$lib/index.js";
    import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";
    export let data;
    const form = wizForm(data.form, { taintedMessage: null });
</script>

<h1>Welcome to your library project</h1>
<p>
    Create your package using @sveltejs/package and preview/showcase your work
    with SvelteKit
</p>
<p>
    Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
<SuperDebug data={form.form.form} />
<Form {form} />
