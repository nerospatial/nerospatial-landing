"use client";

import GradualBlur from "@/components/GradualBlur";
import styles from "./BlurTransition.module.css";

export default function BlurTransition() {
  return (
    <div className={styles.heroBlurWrapper}>
      <GradualBlur
        position="bottom"
        strength={8}
        height="300px"
        opacity={1}
        className={styles.sectionTransition}
      />
    </div>
  );
}
