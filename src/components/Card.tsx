import { Card as CardBase, CardContent } from "@/components/ui/card";
import clsx from "clsx";

type CardProps = {
  className?: string;
  children: React.ReactNode;
};

export default function Card({ className, children }: CardProps) {
  return (
    <CardBase className="mt-2">
      <CardContent className={clsx(className, "mt-2")}>{children}</CardContent>
    </CardBase>
  );
}
