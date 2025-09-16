import { Readability } from "@mozilla/readability";
import { parseHTML } from "linkedom";
import { ArticleSummary } from "../types";
import DOMPurify from "dompurify";
export async function getArticleAndSummary(options: {
  articlesKV: KVNamespace;
  ai: Ai;
  url: string;
}) {
  let result = await options.articlesKV.get<ArticleSummary>(
    options.url,
    "json"
  );
  if (result) {
    return result;
  }

  result = {
    content: null,
    summary: null,
    title: null,
  };
  const response = await fetch(options.url, {
    cf: {
      cacheTtl: 60 * 60 * 24,
      cacheEverything: true,
    },
  });
  const html = await response.text();
  const { document } = parseHTML(html);
  [...document.getElementsByTagName("img")].forEach(
    (img) => (img.src = new URL(img.src, options.url).href)
  );
  [...document.getElementsByTagName("a")].forEach((a) => {
    a.href = new URL(a.href, options.url).href;
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener nofollow");
  });
  let reader: Readability | null = null;

  try {
    reader = new Readability(document);
  } catch (error) {
    console.error("Readability error", (error as Error).message, options.url);
  }

  const article = reader?.parse();

  if (article?.content) {
    const { window } = parseHTML("");
    const purify = DOMPurify(window);
    const cleanContent = purify.sanitize(article.content);
    let response = null;
    try {
      response = await options.ai.run("@cf/facebook/bart-large-cnn", {
        input_text: cleanContent,
        max_length: 2000,
      });
    } catch (e) {
      console.log(e);
    }
    result = {
      content: cleanContent,
      summary: response?.summary || article.excerpt,
      title: article.title,
    };
  }
  await options.articlesKV.put(options.url, JSON.stringify(result));
  return result;
}
