import Image from "next/image";

type ErrorProps = {
  errorMessage?: string;
};

export default function Error({ errorMessage }: ErrorProps) {
  return (
    <div role="status">
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-bold text-red-500">Something went wrong!</p>
        <p className="text-xl text-gray-400">{errorMessage}</p>

        <Image
          alt="Sad cat"
          src={"https://cdn.fascinated.cc/BxI9iJI9.jpg"}
          width={200}
          height={200}
          className="rounded-xl"
        />
      </div>
    </div>
  );
}
