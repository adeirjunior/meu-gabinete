import { Card, cn, Link } from "@nextui-org/react";
import styles from "./law-card.module.scss";
import { Law } from "@prisma/client";
import SwitchIconButton from "../button/switch-icon-button";
import Bookmark from "../icons/Bookmark";
import BookmarkFill from "../icons/BookmarkFill";

export interface LawCardProps {
  className?: string;
  data: Law;
}

const LawCard = ({ className, data }: LawCardProps) => {
  return (
    <Card className="relative shadow-2xl">
      <Link
        color="foreground"
        className={cn("min-w-full", styles.root, className)}
        href={`leis/${data.slug}`}
      >
        <div className={styles["law-card-left-side"]}>
          <div className={styles["law-card-circle"]}>22 </div>
          <h3 className={styles["law-card-year"]}>2024 </h3>
        </div>
        <div>
          <h2 className={styles["law-card-title"]}>{data.title}</h2>
          <p className={styles["law-card-text"]}>{data.description}</p>
        </div>
      </Link>
      <SwitchIconButton
        EnabledIcon={<BookmarkFill />}
        DisabledIcon={<Bookmark />}
        className="absolute right-6 top-0"
      />
    </Card>
  );
};

export default LawCard;
