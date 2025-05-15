"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect, useState } from "react";
import styles from "./textEditor.module.css";

export default function TextEditor({ onChange }) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: "Tell your story...",
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
      }),
    ],
    content: "",
    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange?.(html);
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        style: "height: auto; overflow: hidden;",
      },
    },
  });

  const openLinkInput = () => {
    const currentLink = editor?.getAttributes("link").href || "";
    setLinkUrl(currentLink);
    setShowLinkInput(true);
  };

  const applyLink = () => {
    if (linkUrl.trim() === "") {
      editor?.chain().focus().unsetLink().run();
    } else {
      editor?.chain().focus().setLink({ href: linkUrl.trim() }).run();
    }
    setShowLinkInput(false);
    setLinkUrl("");
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
    setShowLinkInput(false);
    setLinkUrl("");
  };

  if (!isClient || !editor) return null;

  return (
    <div className={styles.editorWrapper}>
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className={styles.bubbleMenu}
        >
          {!showLinkInput ? (
            <>
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? styles.active : ""}
              >
                B
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? styles.active : ""}
              >
                I
              </button>
              <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive("strike") ? styles.active : ""}
              >
                S
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
              >
                H1
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive("blockquote") ? styles.active : ""}
              >
                ❝
              </button>
              <button
                onClick={openLinkInput}
                className={editor.isActive("link") ? styles.active : ""}
              >
                🔗
              </button>
            </>
          ) : (
            <div className={styles.linkForm}>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="Enter link"
                onKeyDown={(e) => {
                  if (e.key === "Enter") applyLink();
                  if (e.key === "Escape") setShowLinkInput(false);
                }}
              />
              <button onClick={applyLink}>✔</button>
              <button onClick={removeLink}>✖</button>
            </div>
          )}
        </BubbleMenu>
      )}

      <EditorContent editor={editor} className={styles.editorContent} />
    </div>
  );
}
