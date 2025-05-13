import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const query = {
    select: {
      id: true,
      desc: true,
      catSlug: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      slug: true,
      title: true,
      _count: {
        select: {
          Like: true,
          Comment: true,
        },
      },
    },
  };

  const editorQuery = {
    where: { isEditorsPick: true },

    orderBy: {
      createdAt: "desc",
    },
    take: 4,
    select: {
      id: true,
      desc: true,
      catSlug: true,
      createdAt: true,
      img: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      slug: true,
      title: true,
    },
  };

  try {
    // const [popularPosts, editorsPicks] = await prisma.post.findMany(query);
    const [popularPosts, editorsPicks] = await prisma.$transaction([
      prisma.post.findMany(query),
      prisma.post.findMany(editorQuery),
    ]);
    const postsWithPopularity = popularPosts.map((post) => ({
      ...post,
      popularity: post._count.Like + post._count.Comment * 2,
    }));
    const topPopularPosts = postsWithPopularity
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 4);
    return new NextResponse(
      JSON.stringify({ topPopularPosts, editorsPicks }, { status: 200 })
    );
  } catch {
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong" }, { status: 500 })
    );
  }
};
