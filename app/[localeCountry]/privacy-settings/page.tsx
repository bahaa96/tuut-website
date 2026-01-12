import { Metadata } from "next";
import { PrivacySettingsClient } from "./PrivacySettingsClient";

export const metadata: Metadata = {
  title: "Privacy Settings - Tuut",
  description: "Manage your privacy and cookie preferences",
};

export default function PrivacySettingsPage() {
  return <PrivacySettingsClient />;
}
