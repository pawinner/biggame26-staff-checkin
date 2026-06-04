import { redirect } from "next/navigation";
import { auth } from "@/auth";
import CheckInClient from "./CheckInClient";

export default async function CheckedInPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return <CheckInClient userEmail={session?.user?.email} />;
}
