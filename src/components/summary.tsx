import { raw } from "hono/html";

export async function Summary({
  article,
  options,
}: {
  article: string;
  options: {
    ai: Ai;
    articlesKV: KVNamespace;
    url: string;
  };
}) {
  if (!article) {
    return <p></p>;
  }
  const summary = await getAiSummary(article, options);
  if (!summary) {
    return <p>Summary not available</p>;
  }
  return <>{raw(summary)}</>;
}

async function getAiSummary(
  article: string,
  options: {
    ai: Ai;
    articlesKV: KVNamespace;
    url: string;
  }
) {
  let result = await options.articlesKV.get<{ summary: string }>(
    options.url,
    "json"
  );
  if (result) {
    return result;
  }
  try {
    let response = await options.ai.run("@cf/facebook/bart-large-cnn", {
      input_text: article,
      max_length: 2000,
    });
    const summary = response.summary;
    await options.articlesKV.put(
      `${options.url}-summary`,
      JSON.stringify({ summary })
    );
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}
