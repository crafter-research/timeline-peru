import { glob } from "astro/loaders";

import { defineCollection, z } from "astro:content";

const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: z.object({
    date: z.coerce.date(),
    title: z.string(),
    category: z.enum(["politica", "cultura", "economia", "conflictos"]),
    era: z.enum([
      "preinca",
      "inca",
      "conquista",
      "colonia",
      "republica",
      "contemporaneo",
    ]),
    image: z.string().optional(),
  }),
});

export const collections = { events };
