import { NextResponse } from "next/server";

export async function GET() {
  const layouts = [
    {
      id: "exclusive",
      name: "Exclusive",
      description: "모던하고 세련된 디자인의 웨딩 페이지",
      thumbnail: "/layouts/exclusive.jpg",
    },
    {
      id: "classic",
      name: "Classic",
      description: "전통적이고 우아한 디자인의 웨딩 페이지",
      thumbnail: "/layouts/classic.jpg",
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "심플하고 깔끔한 디자인의 웨딩 페이지",
      thumbnail: "/layouts/minimal.jpg",
    },
  ];

  return NextResponse.json(layouts);
}
