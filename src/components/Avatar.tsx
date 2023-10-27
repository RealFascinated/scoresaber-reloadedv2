import clsx from "clsx";
import Image from "next/image";

interface AvatarProps {
  label: string;
  url: string;
  size?: number;
  className?: string;
}

export default function Avatar({
  label = "Avatar",
  url,
  size = 150,
  className,
}: AvatarProps) {
  return (
    <>
      <Image
        className={clsx("rounded-full", className)}
        alt={label}
        src={url}
        width={size}
        height={size}
      />
    </>
  );
}
