import { Card as CardBase, CardContent } from "@/components/ui/card";
import clsx from "clsx";

type CardProps = {
  className?: string;
  outerClassName?: string;
  children: React.ReactNode;
};

export default function Card({
  className,
  outerClassName,
  children,
}: CardProps) {
  return (
    <CardBase className={outerClassName}>
      <CardContent className={clsx(className, "pb-4 pt-2")}>
        {children}
      </CardContent>
    </CardBase>
  );
}
