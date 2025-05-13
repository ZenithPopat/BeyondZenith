import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export const GET = async () => {
  const query = {
    orderBy: {
      createdAt: "desc",
    },
  };

  try {
    const latestPost = await prisma.post.findFirst(query);
    return new NextResponse(JSON.stringify(latestPost), { status: 200 });
  } catch {
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong" }, { status: 500 })
    );
  }
};
