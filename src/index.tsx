import { Hono } from "hono";
import { jsxRenderer, useRequestContext } from "hono/jsx-renderer";
import { getFeed } from "./lib/hacker-news";
import { getArticleAndSummary } from "./lib/article";
import { AppEnv } from "./types";
import { Article } from "./components/article";
import DefaultLayout from "./components/layout";
import { getCookie } from "hono/cookie";
import { ErrorBoundary, Suspense } from "hono/jsx";
import { Summary } from "./components/summary";

const app = new Hono<AppEnv>();

app.get("/api/hello", (c) => {
  return c.json({ hello: "world" });
});
app.use(
  "*",
  jsxRenderer(
    ({ children }) => {
      const c = useRequestContext();
      const theme = getCookie(c, "theme") || null;
      return <DefaultLayout theme={theme}>{children}</DefaultLayout>;
    },
    { stream: true }
  )
);

app.get("/", async (c) => {
  const entries = await getFeed();
  return c.render(
    <>
      <title>Hono Hacker News Summarizer</title>
      <main>
        <nav aria-label="breadcrumb" style={{ paddingInline: "1rem" }}>
          <ul>
            <li>Home</li>
          </ul>
        </nav>
        {entries?.map((entry) => (
          <a
            href={`/${entry.id}?link=${JSON.stringify(
              entry.link
            )}&comments=${JSON.stringify(entry.comments)}`}
          >
            <article>
              <nav>
                <ul>
                  <li>{entry.title}</li>
                </ul>
                <ul>
                  <li>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m9 18l6-6l-6-6"
                      />
                    </svg>
                  </li>
                </ul>
              </nav>
            </article>
          </a>
        ))}
      </main>
    </>
  );
});

app.get("/:article", async (c) => {
  const { link: rawLink, comments: rawComments } = c.req.query();
  const link = JSON.parse(rawLink);
  const comments = JSON.parse(rawComments);
  const options = {
    ai: c.env.AI,
    articlesKV: c.env.articles,
    url: link,
  };
  const article = await getArticleAndSummary(options);
  return c.render(
    <>
      <title>{article.title} | Hono Hacker News Summarizer</title>
      <main>
        <nav aria-label="breadcrumb" style={{ paddingInline: "1rem" }}>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>{article.title}</li>
          </ul>
        </nav>
        <Article article={article} link={link} comments={comments}>
          <ErrorBoundary fallback={<span>Summary not available</span>}>
            <Suspense
              fallback={<span aria-busy="true">Generating Summary...</span>}
            >
              <Summary article={article.content || ""} options={options} />
            </Suspense>
          </ErrorBoundary>
        </Article>
      </main>
    </>
  );
});

app.notFound((c) => {
  return c.render(<h1>Not found - {c.req.path}</h1>);
});

app.onError((error, c) => {
  c.status(500);
  return c.render(<h1>Error - {error.message}</h1>);
});

export default app;
