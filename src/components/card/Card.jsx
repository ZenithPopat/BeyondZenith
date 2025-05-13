import Link from "next/link";
import styles from "./card.module.css";
import Image from "next/image";

const removeHtmlTags = (htmlString) => {
  return htmlString.replace(/<\/?[^>]+(>|$)/g, "");
};

const Card = ({ item }) => {
  return (
    <div className={styles.container}>
      {item.img && (
        <div className={styles.imageContainer}>
          <Image
            src={item.img}
            alt=""
            fill
            className={styles.image}
            sizes="(max-width: 1280px) 0px, 100vw"
          />
        </div>
      )}
      <div className={styles.textContainer}>
        <div className={styles.detail}>
          <span className={styles.date}>
            {item.createdAt.substring(0, 10)} -{" "}
          </span>
          <span className={styles.category}>{item.catSlug}</span>
        </div>
        <Link href={`/posts/${item.slug}`}>
          <h1 className={styles.title}>{item.title}</h1>
        </Link>
        <p className={styles.desc}>
          {removeHtmlTags(item.desc.substring(0, 60))}
        </p>
        <Link href={`/posts/${item.slug}`}>
          <p className={styles.links}>Read more</p>
        </Link>
      </div>
    </div>
  );
};

export default Card;
