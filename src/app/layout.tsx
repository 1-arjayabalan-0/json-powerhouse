import { Poppins, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import AlertService from "./components/alert-service";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata = {
  title: "JSON PowerHouse - Convert, Validate & Transform JSON",
  description: "A powerful suite of JSON tools: formatter, validator, CSV converter, YAML converter, diff, schema generator and more.",
  keywords: [
    "json formatter",
    "json validator",
    "json to csv",
    "json to yaml",
    "developer tools",
    "json to typescript",
    "json to java",
    "json minifier",
    "json viewer",
    "json diff"
  ],
  metadataBase: new URL("https://json-powerhouse.codarivu.com"),
  alternates: {
    canonical: "https://json-powerhouse.codarivu.com",
  },
  openGraph: {
    title: "JSON PowerHouse - Convert, Validate & Transform JSON",
    description: "A powerful suite of JSON tools: formatter, validator, CSV converter, YAML converter, diff, schema generator and more.",
    url: "https://json-powerhouse.codarivu.com",
    siteName: "JSON PowerHouse",
    images: [
      {
        url: "/JSON-PowerHouse-Logo.png",
        width: 1200,
        height: 630,
        alt: "JSON PowerHouse",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON PowerHouse - Convert, Validate & Transform JSON",
    description: "A powerful suite of JSON tools: formatter, validator, CSV converter, YAML converter, diff, schema generator and more.",
    images: ["/JSON-PowerHouse-Logo.png"],
  },
  verification: {
    google: 'cWbG2nIb2Zeyu4_3DjbZQERidDmzsMfJTLcl2Ih0ED8',
  },
}

import { Toaster } from "sonner";
import { ModeProvider } from "@/app/context/ModeContext";
import JsonLd from "./components/JsonLd";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "JSON PowerHouse",
            url: "https://json-powerhouse.codarivu.com",
            description: "A powerful suite of JSON tools: formatter, validator, CSV converter, YAML converter, diff, schema generator and more.",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://json-powerhouse.codarivu.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }}
        />
        {/* Clarity Analytics */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "pb0g600i5v");
            `
          }}
        />
      </head>
      <body className={`${poppins.variable} antialiased bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ModeProvider>
            <AlertService />
            {children}
            <Toaster position="bottom-left" richColors theme="dark" />

            {/* Analytics - Only in Production */}
            {process.env.NODE_ENV === 'production' && (
              <>
                <Analytics />
                <SpeedInsights />
              </>)}
          </ModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
