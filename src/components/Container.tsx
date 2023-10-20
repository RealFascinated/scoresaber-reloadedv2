import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="m-auto flex h-screen min-h-full flex-col items-center opacity-90 md:max-w-[1200px]">
        <Navbar />
        <div className="w-full flex-1">{children}</div>

        <Footer />
      </div>
    </>
  );
}
