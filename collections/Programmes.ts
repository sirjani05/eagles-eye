import type { CollectionConfig } from "payload";
import { revalidateTag } from "next/cache";

const isAdmin = (user: { collection?: string } | null | undefined) =>
  user?.collection === "admins";

export const Programmes: CollectionConfig = {
  slug: "programmes",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "provider", "category", "status", "featured"],
  },
  access: {
    read: ({ req }) => {
      if (isAdmin(req.user)) return true;
      if (req.user?.collection === "users") {
        return {
          or: [
            { status: { equals: "published" } },
            { "provider.owner": { equals: req.user.id } },
          ],
        };
      }
      return { status: { equals: "published" } };
    },
    create: ({ req }) =>
      isAdmin(req.user) ||
      (req.user?.collection === "users" &&
        "accountType" in req.user &&
        req.user.accountType === "provider"),
    update: ({ req }) => {
      if (isAdmin(req.user)) return true;
      return req.user?.collection === "users"
        ? { "provider.owner": { equals: req.user.id } }
        : false;
    },
    delete: ({ req }) => {
      if (isAdmin(req.user)) return true;
      return req.user?.collection === "users"
        ? { "provider.owner": { equals: req.user.id } }
        : false;
    },
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (req.user?.collection !== "users") return data;
        if (operation === "create") data.status = "draft";
        const providerId =
          typeof data.provider === "object" && data.provider !== null
            ? data.provider.id
            : data.provider;
        if (!providerId) throw new Error("A provider is required for this programme.");

        const ownedProvider = await req.payload.find({
          collection: "providers",
          where: {
            and: [
              { id: { equals: providerId } },
              { owner: { equals: req.user.id } },
            ],
          },
          limit: 1,
          overrideAccess: true,
        });
        if (!ownedProvider.docs.length) {
          throw new Error("You can only manage programmes for your own provider profile.");
        }
        return data;
      },
    ],
    afterChange: [
      ({ doc }) => {
        revalidateTag("programmes", "max");
        revalidateTag(`programme:${doc.slug}`, "max");
        return doc;
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidateTag("programmes", "max");
        revalidateTag(`programme:${doc.slug}`, "max");
        return doc;
      },
    ],
  },
  fields: [
    { name: "title", type: "text", required: true, maxLength: 180 },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "summary", type: "textarea", required: true, maxLength: 500 },
    { name: "fullDescription", type: "richText", required: true },
    {
      name: "provider",
      type: "relationship",
      relationTo: "providers",
      required: true,
      index: true,
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
      index: true,
    },
    {
      name: "level",
      type: "select",
      required: true,
      options: ["beginner", "intermediate", "advanced"],
      index: true,
    },
    { name: "tuitionFeeGBP", type: "number", required: true, min: 0, index: true },
    {
      name: "format",
      type: "select",
      required: true,
      options: ["online", "in-person", "hybrid"],
      index: true,
    },
    { name: "durationWeeks", type: "number", required: true, min: 1, index: true },
    { name: "qualification", type: "text", required: true, maxLength: 150 },
    { name: "entryRequirements", type: "textarea", required: true },
    {
      name: "learningMethods",
      type: "array",
      minRows: 1,
      fields: [{ name: "method", type: "text", required: true, maxLength: 100 }],
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      index: true,
      access: {
        create: ({ req }) => isAdmin(req.user),
        update: ({ req }) => isAdmin(req.user),
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: ["draft", "published", "archived"],
      index: true,
      access: {
        create: ({ req }) => isAdmin(req.user),
        update: ({ req }) => isAdmin(req.user),
      },
    },
  ],
};
