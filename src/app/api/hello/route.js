import { NextResponse } from "next/server";

const helloPosts = [
  { id: 1, title: "안녕하세요" },
  { id: 2, title: "hello" },
]

// 서버 생성
export async function GET() {
  return NextResponse.json(helloPosts);
}