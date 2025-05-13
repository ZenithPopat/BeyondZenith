import React from "react";
import styles from "./navbar.module.css";
import Image from "next/image";
import Link from "next/link";
import AuthLinks from "../authLinks/AuthLinks";
import ThemeToggle from "../themeToggle/ThemeToggle";

const Navbar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.social}>
        <Link href="https://www.facebook.com/zenith.popat.73/" target="_blank">
          <Image src="/facebook.png" alt="Facebook" width={24} height={24} />
        </Link>
        <Link href="https://www.instagram.com/zenith004/" target="_blank">
          <Image src="/instagram.png" alt="Instagram" width={24} height={24} />
        </Link>
        {/* TODO: Change this */}
        {/* <Link href="/" target="_blank">
          <Image src="/linkedin.webp" alt="Linkedin" width={24} height={24} />
        </Link> */}
      </div>
      <div className={styles.logo}>
        <Link href="/">BeyondZenith</Link>
      </div>
      <div className={styles.links}>
        <ThemeToggle />
        <Link href="/" className={styles.link}>
          Home
        </Link>
        <Link href="/contact" className={styles.link}>
          Contact
        </Link>
        <Link href="/about" className={styles.link}>
          About
        </Link>
        <AuthLinks />
      </div>
    </div>
  );
};

export default Navbar;
