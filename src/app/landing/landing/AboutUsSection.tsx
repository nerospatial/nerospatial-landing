"use client";

import styles from "./AboutUsSection.module.css";

export default function AboutUsSection() {
  const team = [
    {
      name: "Jenish Togadiya",
      role: "Hardware, Systems, Vision",
    },
    {
      name: "Hariny Patel",
      role: "AI, Cloud, Orchestration",
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>About Us — The Builders</h2>
        <p className={styles.description}>Build founder trust and narrative.</p>

        <div className={styles.team}>
          {team.map((member, index) => (
            <div key={index} className={styles.teamMember}>
              <h3 className={styles.memberName}>{member.name}</h3>
              <p className={styles.memberRole}>{member.role}</p>
            </div>
          ))}
        </div>

        <div className={styles.note}>
          Bootstrapped prototypes. National hackathon winners. Building from
          first principles.
        </div>

        <div className={styles.visualNote}>
          [Short bio cards. Tone: humble, hands-on, &quot;We build every layer
          ourselves.&quot;]
        </div>
      </div>
    </section>
  );
}
