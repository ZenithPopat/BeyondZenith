import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

// To get single post

export const GET = async (req, { params }) => {
  const { slug } = await params;
  try {
    const post = await prisma.post.update({
      where: { slug },
      data: { views: { increment: 1 } },
      include: { user: true },
    });

    return new NextResponse(JSON.stringify(post, { status: 200 }));
  } catch {
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong" }, { status: 500 })
    );
  }
};
