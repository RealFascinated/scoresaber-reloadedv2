import clsx from "clsx";

type LabelProps = {
  title: string;
  value: any;
  className?: string;
};

export default function Label({
  title,
  value,
  className = "bg-neutral-700",
}: LabelProps) {
  return (
    <div className={clsx("flex flex-col justify-center rounded-md", className)}>
      <div className="p4-[0.3rem] flex items-center gap-2 pb-[0.2rem] pl-[0.3rem] pr-[0.3rem] pt-[0.2rem]">
        <p>{title}</p>
        <div className="h-4 w-[1px] bg-neutral-100"></div>
        <p>{value}</p>
      </div>
    </div>
  );
}
