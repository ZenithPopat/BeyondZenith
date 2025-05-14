import React from "react";
import styles from "./featured.module.css";
import Image from "next/image";
import Link from "next/link";

const getData = async () => {
  const res = await fetch(`https://beyondzenith.vercel.app/api/featured`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch featured post!");
  }
  const data = await res.json();
  return data;
};

const removeHtmlTags = (htmlString) => {
  return htmlString.replace(/<\/?[^>]+(>|$)/g, "");
};

const Featured = async () => {
  const data = await getData();
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <b>Hey, Zenith here!</b> {"Let's explore the world together!"}
      </h1>
      <div className={styles.post}>
        {data.img && (
          <div className={styles.imgContainer}>
            <Image
              src={data.img}
              alt=""
              fill
              className={styles.image}
              sizes="(max-width: 1024px) 0px, 100vw"
            />
          </div>
        )}
        <div className={styles.textContainer}>
          <h1 className={styles.postTitle}>{data.title}</h1>
          <p className={styles.postDesc}>
            {removeHtmlTags(data.desc.substring(0, 500))}
          </p>
          <button className={styles.button}>
            <Link href={`/posts/${data.slug}`}>Read more</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Featured;
