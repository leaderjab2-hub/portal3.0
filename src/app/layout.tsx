import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export const metadata: Metadata = {
  title: "SKT Enterprise GPUaaS Operations Portal",
  description: "GPUaaS portal for operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`antialiased font-sans flex`}>
        <Sidebar />
        <div className="flex-1 ml-[240px] flex flex-col h-screen overflow-hidden min-w-0">
          <Topbar />
          <div className="flex-1 overflow-auto bg-[#F9FAFB] min-w-0">
            <main className="mx-auto w-full min-w-[1100px] max-w-[1400px] px-[32px] py-[24px]">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
