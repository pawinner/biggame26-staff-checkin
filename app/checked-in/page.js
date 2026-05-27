import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

export default async function CheckedInPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="screen active">
      <div className="card centered">
        <div className="status-icon ok">✓</div>
        <div className="status-title ok">Check-in Complete</div>
        <p className="status-msg">
          Welcome, <strong>{session.user?.name}</strong>!<br />
          You have successfully checked in for Big Game 2026.
        </p>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button type="submit" className="btn btn-ghost">
            ออกจากระบบ / Logout
          </button>
        </form>
      </div>
    </div>
  );
}
