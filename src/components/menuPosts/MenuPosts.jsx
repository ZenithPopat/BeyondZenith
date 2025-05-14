import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./menuPosts.module.css";

const getData = async () => {
  const res = await fetch(`https://beyondzenith.vercel.app/api/popular-posts`, {
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error("Failed to fetch popular posts!");
  }

  return data;
};

const removeHtmlTags = (htmlString) => {
  return htmlString.replace(/<\/?[^>]+(>|$)/g, "");
};

const MenuPosts = async ({ isEditorPick, withImage }) => {
  const data = await getData();
  return (
    <div className={styles.items}>
      {isEditorPick
        ? data &&
          data.editorsPicks.map((item) => (
            <Link
              href={`/posts/${item.slug}`}
              className={styles.item}
              key={item.id}
            >
              {withImage && (
                <div className={styles.imgContainer}>
                  <Image
                    src={
                      item.img ||
                      "https://firebasestorage.googleapis.com/v0/b/myblog-437bc.firebasestorage.app/o/1745935403095style.png?alt=media&token=29b3ea62-a110-421f-9c7a-2c6f5cfdd344"
                    }
                    alt=""
                    fill
                    className={styles.image}
                    sizes="100px"
                  />
                </div>
              )}
              <div className={styles.textContainer}>
                <span className={`${styles.category} ${styles[item.catSlug]}`}>
                  {item.catSlug}
                </span>
                <h3 className={styles.postTitle}>
                  {removeHtmlTags(item.title.substring(0, 30))}
                </h3>
                <div className={styles.details}>
                  <span className={styles.username}>{item.user.name}</span>
                  <span className={styles.date}>
                    {" "}
                    - {item.createdAt.substring(0, 10)}
                  </span>
                </div>
              </div>
            </Link>
          ))
        : data &&
          data.topPopularPosts.map((item) => (
            <Link
              href={`/posts/${item.slug}`}
              className={styles.item}
              key={item.id}
            >
              <div className={styles.textContainer}>
                <span className={`${styles.category} ${styles[item.catSlug]}`}>
                  {item.catSlug}
                </span>
                <h3 className={styles.postTitle}>
                  {removeHtmlTags(item.title.substring(0, 30))}
                </h3>
                <div className={styles.details}>
                  <span className={styles.username}>{item.user.name}</span>
                  <span className={styles.date}>
                    {" "}
                    - {item.createdAt.substring(0, 10)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
    </div>
  );
};

export default MenuPosts;
