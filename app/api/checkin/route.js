import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const appscriptUrl = process.env.APPSCRIPT_URL;
  if (!appscriptUrl) {
    return NextResponse.json(
      { success: false, error: "APPSCRIPT_URL env variable is not set" },
      { status: 500 }
    );
  }

  try {
    const url = `${appscriptUrl}?action=getUser&email=${encodeURIComponent(session.user.email)}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Google Apps Script returned status ${res.status}`);
    }
    const data = await res.json();
    if (!data.success && data.error === "Email not found in CheckIn sheet") {
      return NextResponse.json({ success: false, error: data.error, emailNotFound: true });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST() {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const appscriptUrl = process.env.APPSCRIPT_URL;
  if (!appscriptUrl) {
    return NextResponse.json(
      { success: false, error: "APPSCRIPT_URL env variable is not set" },
      { status: 500 }
    );
  }

  try {
    const url = `${appscriptUrl}?action=checkIn&email=${encodeURIComponent(session.user.email)}`;
    const res = await fetch(url, { method: "POST" });
    if (!res.ok) {
      throw new Error(`Google Apps Script returned status ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
