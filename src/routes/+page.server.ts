import { z } from "zod";
import { superValidate } from "sveltekit-superforms";
import { zod4 as zod, valibot, arktype } from "sveltekit-superforms/adapters";
import { wizCreate } from "$lib/index.js";

const schema = z
    .object({
        test: z.string(),
        teste: z.email(),
        test2: z.number(),
        test3: z.string(),
        date: z.date(),
        bool: z.boolean(),
        omitted: z.string(),
    })
    .omit({ omitted: true });

export async function load() {
    const form = await wizCreate(zod(schema), "?/update", {
        columns: 2,
        fields: {
            test: { colSpan: 2 },
            test3: {
                type: "typeahead",
                items: [
                    { label: "test1", value: 1 },
                    { label: "test2", value: 2 },
                ],
            },
        },
    });
    return { form };
}
