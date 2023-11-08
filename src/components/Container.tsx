import Image from "next/image";
import Footer from "./Footer";
import Navbar from "./navbar/Navbar";

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed left-0 top-0 z-0 h-full w-full blur-sm">
        <Image
          className="object-fill object-center"
          alt="Background image"
          src={"/assets/background.webp"}
          fill
        />
      </div>
      <div className="z-[9999] m-auto flex h-screen min-h-full flex-col items-center opacity-90 md:max-w-[1200px]">
        <Navbar />
        <div className="w-full flex-1">{children}</div>

        <Footer />
      </div>
    </>
  );
}
