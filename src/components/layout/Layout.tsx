import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen min-w-0 flex-col">
      <Header />
      <main className="min-w-0 flex-1 pt-16 md:pt-20">{children}</main>
      <Footer />
    </div>
  );
}
