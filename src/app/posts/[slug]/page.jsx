import Menu from "@/components/Menu/Menu";
import styles from "./singlePage.module.css";
import Image from "next/image";
import Comments from "@/components/comments/Comments";
import { FaEye } from "react-icons/fa";
import { FaComments } from "react-icons/fa6";
// import { FaHeart } from "react-icons/fa";
import Likes from "@/components/likes/likes";

const getData = async (slug) => {
  const res = await fetch(`http://localhost:3000/api/posts/${slug}`, {
    cache: "no-store", // Disable caching for this request. Next.js caches the response by default.
  });

  const commentCount = await fetch(
    `http://localhost:3000/api/comments?postSlug=${slug}`
  );
  const data = await commentCount.json();

  const like = await fetch(`http://localhost:3000/api/likes?postSlug=${slug}`);
  const likeData = await like.json();
  if (!res.ok) {
    throw new Error("Failed to fetch categories!");
  }

  const post = await res.json();
  return { post, commentCount: data.commentCount, likeCount: likeData.count };
};

const SinglePage = async ({ params }) => {
  const getParams = await params;
  const { slug } = getParams;
  const { post, commentCount, likeCount } = await getData(slug);

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.viewsContainer}>
            <div className={styles.postInteraction}>
              <FaEye className={styles.icon} />
              <span className={styles.views}>{post.views}</span>
            </div>
            <div className={styles.postInteraction}>
              <FaComments className={styles.icon} />
              <span className={styles.commentCount}>{commentCount}</span>
            </div>
            <div className={styles.postInteraction}>
              <Likes postSlug={slug} />
              {/* <FaHeart className={styles.icon} />
              <span className={styles.commentCount}>{likeCount}</span> */}
            </div>
          </div>
          <div className={styles.user}>
            {post?.user.image && (
              <div className={styles.userImageContainer}>
                <Image
                  src={post?.user.image}
                  alt="User"
                  className={styles.avatar}
                  width={50}
                  height={50}
                />
              </div>
            )}
            <div className={styles.userTextContainer}>
              <span className={styles.username}>{post?.user.name}</span>
              <span className={styles.date}>
                {post.createdAt.substring(0, 10)}
              </span>
            </div>
          </div>
        </div>
        {post?.img && (
          <div className={styles.imageContainer}>
            <Image
              src={post.img}
              alt="User"
              fill
              className={styles.image}
              sizes="(max-width: 1024px) 0px, 100vw"
              priority={true}
            />
          </div>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.post}>
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: post?.desc }}
          />
          <div className={styles.comment}>
            <Comments postSlug={slug} />
          </div>
        </div>
        <Menu />
      </div>
    </div>
  );
};

export default SinglePage;
