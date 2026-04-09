import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.token || !body.password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 422 },
      );
    }

    const upstream = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1"}/auth/reset-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
