import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const DATA_FILE = join(process.cwd(), "data", "state.json");

export async function GET() {
  const data = JSON.parse(readFileSync(DATA_FILE, "utf-8"));
  return NextResponse.json(data);
}

export async function POST(request) {
  const body = await request.json();
  writeFileSync(DATA_FILE, JSON.stringify(body, null, 2));
  return NextResponse.json({ ok: true });
}
