<script lang="ts">
    import Form from "$lib/SuperForm.svelte";
    import type { Layout } from "$lib/index.js";
    import { superForm } from "sveltekit-superforms/client";
    export let data;
    const form = superForm(data.form, { taintedMessage: null });
</script>

<h1>Welcome to your library project</h1>
<p>
    Create your package using @sveltejs/package and preview/showcase your work
    with SvelteKit
</p>
<p>
    Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
<Form {form} enhance={() => console.log("enhanced")} />
