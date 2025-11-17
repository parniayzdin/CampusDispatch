import "./globals.css";
import QueryProvider from "@/components/query-provider";
import CallLogProvider from "@/context/call-log-provider";
import { Toaster } from "@/components/ui/toaster";

import { Space_Mono, Source_Code_Pro } from "next/font/google";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-scp",
});

export const metadata = {
  title: "CampusDispatch Lite",
  description: "A small dispatch dashboard powered by a Python backend",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${sourceCodePro.variable} font-scp antialiased`}>
        {}
        <QueryProvider>
          <CallLogProvider>
            {children}
            {}
            {/* <Toaster /> */}
          </CallLogProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
