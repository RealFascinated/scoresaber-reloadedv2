import clsx from "clsx";

interface ButtonProps {
  text: string;
  url: string;
  icon?: JSX.Element;
  className?: string;
}

export default function Button({ text, url, icon, className }: ButtonProps) {
  return (
    <a href={url}>
      <p
        className={clsx(
          "font-md flex w-fit transform-gpu flex-row items-center gap-1 rounded-md bg-blue-500 p-1 pl-2 pr-2 transition-all hover:opacity-80",
          className,
        )}
      >
        {icon}
        {text}
      </p>
    </a>
  );
}
