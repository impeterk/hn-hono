import { html } from "hono/html";

export function ModeSwitcher() {
  return html`
    <script>
      const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      document.documentElement.setAttribute("data-theme", theme);
    </script>
  `;
}
