import { raw } from "hono/html";
import { Child } from "hono/jsx";
import { ModeSwitcher } from "./client/mode-switcher";
import { Header } from "./header";
import { Footer } from "./footer";
import { DESC } from "../lib/consts";

export default function DefaultLayout({
  children,
  theme = null,
}: {
  children: Child;
  theme?: null | string;
}) {
  return (
    <html lang="en" data-theme={theme}>
      <head>
        <meta charset="utf-8" />
        <meta name="description" content={DESC} />

        <meta property="og:url" content="https://hn.peterk.dev" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Hono Hacker News Summarizer" />
        <meta property="og:description" content={DESC} />
        <meta property="og:image" content="" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="hn.peterk.dev" />
        <meta property="twitter:url" content="https://hn.peterk.dev" />
        <meta name="twitter:title" content="Hono Hacker News Summarizer" />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content="" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📰</text></svg>"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.indigo.min.css"
        />
        {raw(
          `<style>figure {padding: 1rem 2rem;} main{padding-top:0 !important;}</style>`,
        )}
        {!theme && <ModeSwitcher />}
      </head>
      <body class="container">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
