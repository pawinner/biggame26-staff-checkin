import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const appscriptUrl = process.env.APPSCRIPT_URL;
  if (!appscriptUrl) {
    return NextResponse.json(
      { success: false, error: "APPSCRIPT_URL env variable is not set" },
      { status: 500 }
    );
  }

  try {
    // Try to get session name directly (requires the updated doGet in Apps Script)
    let url = `${appscriptUrl}?action=getSessionName`;
    let res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Google Apps Script returned status ${res.status}`);
    }
    let data = await res.json();
    
    // Fallback if Apps Script is not yet updated and returned an error about email
    if (!data.success && (data.error?.includes("Email") || data.error?.includes("required"))) {
      url = `${appscriptUrl}?action=getUser&email=pawinner%40docchula.com`;
      res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Google Apps Script fallback returned status ${res.status}`);
      }
      data = await res.json();
    }
    
    if (data.success) {
      return NextResponse.json({ success: true, sessionName: data.sessionName });
    } else {
      return NextResponse.json({ success: false, error: data.error }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
