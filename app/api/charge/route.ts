// app/api/charge/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, amount } = body;

    // Construct the payload for MobiusPay (NMI)
    // Note: We use URLSearchParams because NMI expects form-urlencoded or XML, not JSON.
    const payload = new URLSearchParams();
    payload.append("security_key", process.env.MOBIUSPAY_API_KEY!);
    payload.append("type", "sale");
    payload.append("amount", amount);
    payload.append("payment_token", token); // The token from the frontend

    // Send request to the NMI Gateway URL (MobiusPay uses this)
    const response = await fetch("https://secure.nmi.com/api/transact.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload.toString(),
    });

    const responseText = await response.text();
    const responseParams = new URLSearchParams(responseText);

    // Parse the NMI response
    const responseCode = responseParams.get("response");
    const responseTextMsg = responseParams.get("responsetext");
    const transactionId = responseParams.get("transactionid");

    if (responseCode === "1") {
      // Success
      return NextResponse.json({ success: true, transactionId });
    } else {
      // Decline or Error
      return NextResponse.json(
        { success: false, message: responseTextMsg },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Payment Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
