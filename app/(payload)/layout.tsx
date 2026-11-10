import config from "@payload-config";
import { RootLayout, handleServerFunctions } from "@payloadcms/next/layouts";
import { importMap } from "./admin/importMap";
import "@payloadcms/next/css";

export default function PayloadLayout({ children }: { children: React.ReactNode }) {
  return RootLayout({
    children,
    config,
    importMap,
    serverFunction: handleServerFunctions,
  });
}
