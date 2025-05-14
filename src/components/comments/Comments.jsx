"use client";

import Link from "next/link";
import styles from "./comments.module.css";
import Image from "next/image";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { useState } from "react";

const fetcher = async (url) => {
  const res = await fetch(url);

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message);
    throw error;
  }

  return data;
};

const Comments = ({ postSlug }) => {
  const { status } = useSession();

  const { data, commentCount, mutate, isLoading } = useSWR(
    `https://beyondzenith.vercel.app/api/comments?postSlug=${postSlug}`,
    fetcher
  );

  const [desc, setDesc] = useState("");

  const handleSubmit = async () => {
    if (desc.length === 0) return;

    await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({ desc, postSlug }),
    });
    mutate();
    setDesc("");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Comments</h1>
      {status === "authenticated" ? (
        <div className={styles.write}>
          <textarea
            placeholder="Write a comment..."
            value={desc}
            className={styles.input}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
          <button className={styles.button} onClick={handleSubmit}>
            Send
          </button>
        </div>
      ) : (
        <Link href="/login">Login to write a comment</Link>
      )}
      <div className={styles.comments}>
        {isLoading
          ? "Loading..."
          : data?.comments.map((item) => (
              <div className={styles.comment} key={item.id}>
                <div className={styles.user}>
                  {item.user.image && (
                    <Image
                      src={item.user.image}
                      alt="User"
                      className={styles.image}
                      width={50}
                      height={50}
                    />
                  )}
                  <div className={styles.userInfo}>
                    <div className={styles.username}>{item.user.name}</div>
                    <div className={styles.date}>
                      {item.createdAt.substring(0, 10)}
                    </div>
                  </div>
                </div>
                <p className={styles.description}>{item.desc}</p>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Comments;
