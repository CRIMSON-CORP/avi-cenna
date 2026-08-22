import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/providers/SmoothScroll";

/* One family for the whole site. The variable axis carries everything from
   400 body copy to the 800 display headlines. */
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://avi-cenna.com"),
  title: {
    default: `${site.name} — Day & boarding school in Ikeja, Lagos`,
    template: `%s — ${site.name}`,
  },
  description:
    "Avi-Cenna International School is an independent, secular day and boarding school for boys and girls aged 2½ to 16 in Ikeja, Lagos — consistently recognised by Cambridge for IGCSE results.",
  openGraph: {
    title: site.name,
    description:
      "An independent, secular day and boarding school for boys and girls aged 2½ to 16 in Ikeja, Lagos.",
    type: "website",
    locale: "en_NG",
    siteName: site.name,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-NG" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full">
        <SmoothScroll />
        <a
          href="#main"
          className="focus-ring sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-pill focus:bg-surface focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-ink focus:shadow-card"
        >
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
