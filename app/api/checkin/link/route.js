import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, surname } = await request.json();
    if (!name || name.trim() === "") {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }
    const finalSurname = surname || "";

    const appscriptUrl = process.env.APPSCRIPT_URL;
    if (!appscriptUrl) {
      return NextResponse.json(
        { success: false, error: "APPSCRIPT_URL env variable is not set" },
        { status: 500 }
      );
    }

    const url = `${appscriptUrl}?action=linkEmail&email=${encodeURIComponent(session.user.email)}&name=${encodeURIComponent(name)}&surname=${encodeURIComponent(finalSurname)}`;
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
