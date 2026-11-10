import type { CollectionConfig } from "payload";

const isAdmin = (user: { collection?: string } | null | undefined) =>
  user?.collection === "admins";

export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 800, height: 600, position: "centre" },
    ],
  },
  access: {
    read: () => true,
    create: ({ req }) => isAdmin(req.user),
    update: ({ req }) => isAdmin(req.user),
    delete: ({ req }) => isAdmin(req.user),
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      maxLength: 250,
    },
  ],
};
