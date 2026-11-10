import type { CollectionConfig } from "payload";

const isAdmin = (user: { collection?: string } | null | undefined) =>
  user?.collection === "admins";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7,
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    cookies: {
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "accountType", "createdAt"],
  },
  access: {
    create: () => false,
    read: ({ req }) => {
      if (isAdmin(req.user)) return true;
      return req.user ? { id: { equals: req.user.id } } : false;
    },
    update: ({ req }) => {
      if (isAdmin(req.user)) return true;
      return req.user ? { id: { equals: req.user.id } } : false;
    },
    delete: ({ req }) => isAdmin(req.user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      maxLength: 100,
    },
    {
      name: "accountType",
      type: "select",
      required: true,
      defaultValue: "learner",
      options: ["learner", "provider"],
      index: true,
      access: {
        update: ({ req }) => isAdmin(req.user),
      },
    },
    {
      name: "savedProgrammes",
      type: "relationship",
      relationTo: "programmes",
      hasMany: true,
      index: true,
      access: {
        update: ({ req }) => isAdmin(req.user) || Boolean(req.user),
      },
    },
    {
      name: "onboardingComplete",
      type: "checkbox",
      defaultValue: false,
    },
  ],
};
