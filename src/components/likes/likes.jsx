"use client";

import { useSession } from "next-auth/react";
import styles from "./likes.module.css";
import useSWR from "swr";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const fetcher = async (url) => {
  const res = await fetch(url);

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message);
    throw error;
  }

  return data;
};

const Likes = ({ postSlug }) => {
  const { status } = useSession();

  // const likeCount = getData(postSlug);

  const {
    data: likeData,
    mutate,
    isLoading,
    error,
  } = useSWR(`http://localhost:3000/api/likes?postSlug=${postSlug}`, fetcher);

  const [isLiking, setIsLiking] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (likeData) {
      setIsLiked(likeData.isLiked); // Set the initial like state from the API
    }
  }, [likeData]);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    const newLikeState = !isLiked;
    setIsLiked(newLikeState);

    const res = await fetch("/api/likes", {
      method: "POST",
      body: JSON.stringify({ postSlug }),
    });

    if (!res.ok) {
      mutate();
      toast.error("Error liking the post");
      return;
    }

    mutate();
    setIsLiking(false);
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLiking}
      className={styles.likeButton}
      // className={` ${
      //   isLiked ? "text-red-600" : "text-gray-500"
      // }`}
    >
      {isLiked ? (
        <FaHeart className={styles.like} size={24} />
      ) : (
        <FaRegHeart className={styles.dislike} size={24} />
      )}
      <span className={styles.likeCount}>{likeData?.count ?? 0}</span>
    </button>
  );
};

export default Likes;
