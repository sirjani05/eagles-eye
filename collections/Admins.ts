import type { CollectionConfig } from "payload";

export const Admins: CollectionConfig = {
  slug: "admins",
  auth: {
    tokenExpiration: 60 * 60,
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    cookies: {
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
  admin: {
    useAsTitle: "email",
  },
  access: {
    create: ({ req }) => req.user?.collection === "admins",
    read: ({ req }) => req.user?.collection === "admins",
    update: ({ req }) => req.user?.collection === "admins",
    delete: ({ req }) => req.user?.collection === "admins",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      maxLength: 100,
    },
  ],
};
