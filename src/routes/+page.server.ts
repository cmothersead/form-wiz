import { z } from "zod";
import { wizCreate } from "$lib/index.js";

export async function load() {
    const schema = z
        .object({
            test: z.string(),
            test2: z.number(),
            date: z.date(),
            bool: z.boolean(),
            omitted: z.string(),
        })
        .omit({ omitted: true });

    const form = await wizCreate(schema);
    return { form };
}
