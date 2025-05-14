import React from "react";
import styles from "./footer.module.css";
import Image from "next/image";
import Link from "next/link";

const getData = async () => {
  const res = await fetch("https://beyondzenith.vercel.app/api/categories", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories!");
  }

  return res.json();
};

const Footer = async () => {
  const data = await getData();
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.logo}>
          <Image
            src="/imgCircle.png"
            alt="Beyond Zenith"
            width={50}
            height={50}
            className={styles.logoImg}
          />
          <h1 className={styles.logoText}>Beyond Zenith</h1>
        </div>
        <p className={styles.description}>
          Beyond Zenith is a platform that connects you with the latest in
          technology, science, and innovation. We aim to provide you with the
          most relevant and up-to-date information in these fields, helping you
          stay informed and inspired.
        </p>
        <div className={styles.icons}>
          <Link
            href="https://www.facebook.com/zenith.popat.73/"
            target="_blank"
          >
            <Image src="/facebook.png" alt="Facebook" width={18} height={18} />
          </Link>
          <Link href="https://www.instagram.com/zenith004/" target="_blank">
            <Image
              src="/instagram.png"
              alt="Instagram"
              width={18}
              height={18}
            />
          </Link>
          {/* <Image src="/youtube.png" alt="Youtube" width={18} height={18} /> */}
        </div>
      </div>
      <div className={styles.links}>
        <div className={styles.list}>
          <span className={styles.listTitle}>Links</span>
          <Link href="/" className={styles.listItem}>
            Homepage
          </Link>
          <Link href="/blog" className={styles.listItem}>
            Blog
          </Link>
          <Link href="/about" className={styles.listItem}>
            About
          </Link>
          <Link href="/contact" className={styles.listItem}>
            Contact
          </Link>
        </div>
        <div className={styles.list}>
          <span className={styles.listTitle}>Categories</span>
          {data?.slice(0, 4).map((item) => (
            <Link
              href={`/blog?cat=${item.slug}`}
              className={`${styles.listItem}`}
              key={item.id}
            >
              {item.title}
            </Link>
          ))}
        </div>
        <div className={styles.list}>
          <span className={styles.listTitle}>Social</span>
          <Link
            href="https://www.facebook.com/zenith.popat.73/"
            className={styles.listItem}
            target="_blank"
          >
            Facebook
          </Link>
          <Link
            href="https://www.instagram.com/zenith004/"
            className={styles.listItem}
            target="_blank"
          >
            Instagram
          </Link>
          {/* <Link href="/" className={styles.listItem}>
            Youtube
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default Footer;
