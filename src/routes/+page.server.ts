import { z } from "zod";
import { superValidate } from "sveltekit-superforms/server";

export async function load() {
  const schema = z.object({
    test: z.string(),
    test2: z.number()
  });

  const form = await superValidate(schema);
  return { form };
}
