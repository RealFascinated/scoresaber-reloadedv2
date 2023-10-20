import clsx from "clsx";

type CardProps = {
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
};

export default function Card({
  className,
  innerClassName,
  children,
}: CardProps) {
  return (
    <div className={className}>
      <div
        className={clsx(
          "rounded-md bg-gray-800 p-3 opacity-90",
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
