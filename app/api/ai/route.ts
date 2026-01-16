import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const userMessage = body.message;

  return NextResponse.json({
    reply: `COMMANDER AI received: ${userMessage}`,
    action: "Analyze client pain and suggest next step"
  });
}
