import { z } from "zod";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { wizCreate } from "$lib/index.js";

const schema = z
    .object({
        test: z.string(),
        test2: z.number(),
        date: z.date(),
        bool: z.boolean(),
        omitted: z.string(),
    })
    .omit({ omitted: true });

export async function load() {
    const form = await wizCreate(schema, "?/update");
    return { form };
}
