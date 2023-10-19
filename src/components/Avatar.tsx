import clsx from "clsx";
import Image from "next/image";

interface AvatarProps {
  label: string;
  url: string;
  className: string;
}

export default function Avatar({
  label = "Avatar",
  url,
  className,
}: AvatarProps) {
  return (
    <>
      <Image
        className={clsx("rounded-full", className)}
        alt={label}
        src={url}
        width={150}
        height={150}
        priority
      />
    </>
  );
}
