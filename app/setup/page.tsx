import { redirect } from "next/navigation";

async function SetupPage() {
  // Redirect directly to home since we removed credits system
  redirect("/home");
}

export default SetupPage;
