import { html } from "hono/html";
import { ThemeSwitch } from "./client/theme-switch";

export function Header() {
  return (
    <header
      style={{
        paddingBottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1rem",
      }}
    >
      <h3 style={{ marginBottom: 0 }}>Hono Hacker News Summarizer</h3>
      <ThemeSwitch />
    </header>
  );
}
