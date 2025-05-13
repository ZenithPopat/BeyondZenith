import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

// To get all comments of a post

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const postSlug = searchParams.get("postSlug");

  if (!postSlug) {
    return new NextResponse("Missing postSlug", { status: 400 });
  }

  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify(
        { message: "You must be logged in to like" },
        { status: 401 }
      )
    );
  }

  try {
    const count = await prisma.like.count({
      where: { postSlug },
    });
    const userHasLiked = await prisma.like.findFirst({
      where: { postSlug, userId: session.user.id },
    });
    return new NextResponse(
      JSON.stringify({
        count,
        isLiked: !!userHasLiked,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new NextResponse("Error fetching like count", { status: 500 });
  }
};

// To toggle like on a post

export const POST = async (req) => {
  const session = await getAuthSession();

  if (!session) {
    return new NextResponse(
      JSON.stringify(
        { message: "You must be logged in to like the post" },
        { status: 401 }
      )
    );
  }

  const { postSlug } = await req.json();
  const userEmail = session.user.email;

  try {
    // const like = await req.json();
    const like = await prisma.like.findUnique({
      where: {
        userEmail_postSlug: {
          userEmail,
          postSlug,
        },
      },
    });

    // const comment = await prisma.comment.create({
    //   data: { ...body, userEmail: session.user.email },
    // });

    if (like) {
      await prisma.like.delete({
        where: {
          userEmail_postSlug: {
            userEmail,
            postSlug,
          },
        },
      });
      return new NextResponse(
        JSON.stringify({ liked: false }, { status: 200 })
      );
    } else {
      await prisma.like.create({
        data: { userEmail, postSlug },
      });
      return new NextResponse(JSON.stringify({ liked: true }, { status: 200 }));
    }
  } catch {
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong" }, { status: 500 })
    );
  }
};
