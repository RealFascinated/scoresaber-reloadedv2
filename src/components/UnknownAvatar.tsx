type UnknownAvatarProps = {
  size?: number;
};

export default function UnknownAvatar({ size = 150 }: UnknownAvatarProps) {
  return (
    <div
      className={`mb-4 mt-2 flex h-[${size}px] w-[${size}px] items-center justify-center rounded-full bg-gray-600`}
    >
      <p className="text-9xl">?</p>
    </div>
  );
}
