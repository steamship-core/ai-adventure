import SettingGroupForm from "@/components/editor/setting-group-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

export default function Page() {
  return <SettingGroupForm />;
}
