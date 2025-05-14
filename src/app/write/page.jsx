"use client";

import Image from "next/image";
import styles from "./writePage.module.css";
import { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// // const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
// import ReactQuill from "react-quill-new";
// import "react-quill/dist/quill.bubble.css"; // Import styles
import TextEditor from "@/components/textEditor/TextEditor";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "@/utils/firebase";
import toast from "react-hot-toast";

// const modules = {
//   toolbar: [
//     ["bold", "italic", "underline"],
//     [{ list: "ordered" }, { list: "bullet" }],
//     ["link", "image"],
//   ],
// };

// const formats = ["bold", "italic", "underline", "link", "image"];

const storage = getStorage(app);

const WritePage = () => {
  const { status } = useSession();

  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [media, setMedia] = useState("");
  const [title, setTitle] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [value, setValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/"); // Redirect after authentication
    }
  }, [status, router]); // Dependency array ensures it runs when `status` changes

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const upload = () => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, name);

      const uploadTask = uploadBytesResumable(storageRef, file);

      toast.loading("Uploading image...");

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setMedia(downloadURL);
            toast.dismiss();
            toast.success("Image uploaded successfully!");
          });
        }
      );
    };

    file && upload();
  }, [file]);

  if (status === "loading") {
    return <div className={styles.loading}>Loading...</div>;
  }

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]/g, "-")
      .replace(/^-+|-+$/g, "-");
  const handleSubmit = async () => {
    console.log(title, content, media, catSlug);
    toast.loading("Publishing Post...");
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          title,
          desc: content,
          img: media, // media,
          slug: slugify(title),
          catSlug: catSlug || "travel",
        }),
      });
      if (!res.ok) throw new Error();
      if (res.ok) {
        setTitle("");
        setValue("");
        setCatSlug("");
        setFile(null);
        setMedia("");
        toast.dismiss();
        toast.success("Post created successfully!");
        router.push("/");
      }
    } catch {
      toast.error("Failed to publish blog.");
      toast.dismiss();
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Title"
        className={styles.title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className={styles.category}>
        <label htmlFor="category" className={styles.label}>
          Category:
        </label>
        <select
          className={styles.select}
          onChange={(e) => setCatSlug(e.target.value)}
        >
          {categories &&
            categories.map((item) => (
              <option value={item.slug} key={item.id}>
                {item.slug}
              </option>
            ))}
        </select>
      </div>
      <div className={styles.editor}>
        <button className={styles.button}>
          <Image
            src="/plus.png"
            alt=""
            width={16}
            height={16}
            onClick={() => setOpen(!open)}
          />
        </button>
        {open && (
          <div className={styles.add}>
            <button className={styles.addButton}>
              <input
                type="file"
                id="image"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: "none" }}
              />
              <label htmlFor="image" className={styles.label}>
                <Image src="/image.png" alt="" width={16} height={16} />
              </label>
            </button>
          </div>
        )}
        <TextEditor onChange={(html) => setContent(html)} />
      </div>
      <button className={styles.publish} onClick={handleSubmit}>
        Publish
      </button>
    </div>
  );
};

export default WritePage;
