import clsx from "clsx";

type LabelProps = {
  title: string;
  value: string;
  className?: string;
};

export default function Label({
  title,
  value,
  className = "bg-neutral-700",
}: LabelProps) {
  return (
    <div className={clsx("flex flex-col justify-center rounded-md", className)}>
      <div className="flex items-center gap-2 p-[0.3rem]">
        <p>{title}</p>
        <div className="h-4 w-[1px] bg-neutral-100"></div>
        <p>{value}</p>
      </div>
    </div>
  );
}
