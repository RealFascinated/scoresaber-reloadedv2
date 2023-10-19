type LabelProps = {
  title: string;
  value: string;
};

export default function Label({ title, value }: LabelProps) {
  return (
    <div className="flex flex-col justify-center rounded-md bg-neutral-700">
      <div className="flex items-center gap-2 p-[0.3rem]">
        <p>{title}</p>
        <div className="h-4 w-[1px] bg-neutral-100"></div>
        <p>{value}</p>
      </div>
    </div>
  );
}
