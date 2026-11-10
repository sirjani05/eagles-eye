import type { CollectionConfig } from "payload";
import { revalidateTag } from "next/cache";

const isAdmin = (user: { collection?: string } | null | undefined) =>
  user?.collection === "admins";

export const Providers: CollectionConfig = {
  slug: "providers",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "providerType", "verified"],
  },
  access: {
    read: () => true,
    create: ({ req }) =>
      isAdmin(req.user) ||
      (req.user?.collection === "users" &&
        "accountType" in req.user &&
        req.user.accountType === "provider"),
    update: ({ req }) => {
      if (isAdmin(req.user)) return true;
      return req.user?.collection === "users"
        ? { owner: { equals: req.user.id } }
        : false;
    },
    delete: ({ req }) => {
      if (isAdmin(req.user)) return true;
      return req.user?.collection === "users"
        ? { owner: { equals: req.user.id } }
        : false;
    },
  },
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        if (req.user?.collection === "users") {
          return { ...data, owner: req.user.id };
        }
        return data;
      },
    ],
    afterChange: [
      ({ doc }) => {
        revalidateTag("providers", "max");
        revalidateTag(`provider:${doc.slug}`, "max");
        return doc;
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidateTag("providers", "max");
        revalidateTag(`provider:${doc.slug}`, "max");
        return doc;
      },
    ],
  },
  fields: [
    { name: "name", type: "text", required: true, maxLength: 150 },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    {
      name: "providerType",
      type: "select",
      required: true,
      options: ["independent-college", "academy", "training-centre"],
      index: true,
    },
    { name: "location", type: "text", required: true, maxLength: 150 },
    { name: "description", type: "textarea", required: true },
    {
      name: "owner",
      type: "relationship",
      relationTo: "users",
      index: true,
      access: {
        update: ({ req }) => isAdmin(req.user),
      },
      admin: { position: "sidebar" },
    },
    {
      name: "verified",
      type: "checkbox",
      defaultValue: false,
      index: true,
      access: {
        create: ({ req }) => isAdmin(req.user),
        update: ({ req }) => isAdmin(req.user),
      },
    },
    {
      name: "foundedYear",
      type: "number",
      min: 1000,
      max: new Date().getFullYear(),
    },
    { name: "learnerCount", type: "number", min: 0 },
    { name: "completionRate", type: "number", min: 0, max: 100 },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
    },
  ],
};
