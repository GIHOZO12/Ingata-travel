import Header from "@/components/Header";
import Footer from "@/components/Footer";

// "(site)" is a route group: the parentheses mean the folder name is NOT part
// of the URL. It exists only to give the public pages their own layout.
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </>
  );
}
