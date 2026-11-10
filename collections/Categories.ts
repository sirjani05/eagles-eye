import type { CollectionConfig } from "payload";

const isAdmin = (user: { collection?: string } | null | undefined) =>
  user?.collection === "admins";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "updatedAt"],
  },
  access: {
    read: () => true,
    create: ({ req }) => isAdmin(req.user),
    update: ({ req }) => isAdmin(req.user),
    delete: ({ req }) => isAdmin(req.user),
  },
  fields: [
    { name: "name", type: "text", required: true, maxLength: 100 },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "description", type: "textarea" },
    {
      name: "icon",
      type: "text",
      maxLength: 100,
    },
  ],
};
