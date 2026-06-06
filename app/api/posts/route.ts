import { NextResponse } from "next/server";
import { getLatestNews } from "../../../services/news";

export async function GET() {
  const news = await getLatestNews();
  return NextResponse.json({ news });
}
