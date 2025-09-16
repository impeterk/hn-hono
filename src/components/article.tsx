import { Child, ErrorBoundary, Suspense } from "hono/jsx";
import { ArticleSummary } from "../types";
import { raw } from "hono/html";
import { Summary } from "./summary";

export function Article({
  article,
  link,
  comments,
  children,
}: {
  article: ArticleSummary;
  link: string;
  comments: string;
  children: Child;
}) {
  return (
    <article>
      <header>
        <h1 style={{ paddingTop: "1rem" }}>{article.title}</h1>
        <nav>
          <ul>
            <li>
              <a href={link} target="_blank" rel="nofollow noopener">
                Original Article
              </a>
            </li>
            <li>{" | "}</li>
            <li>
              <a href={comments} target="_blank" rel="nofollow noopener">
                Comments
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <h2>Summary</h2>
      {children}
      <hr />
      <h2>Article</h2>
      {article.content ? raw(article.content) : <p>Article not available</p>}
    </article>
  );
}
