import { raw } from "hono/html";

export async function ArticleSummary({
  article,
  ai,
}: {
  article: string;
  ai: Ai;
}) {
  if (!article) {
    return <p></p>;
  }
  const summary = await getAiSummary(article, ai);
  if (!summary) {
    return <p>Summary not available</p>;
  }
  return <>{raw(summary)}</>;
}

async function getAiSummary(article: string, ai: Ai) {
  try {
    let response = await ai.run("@cf/facebook/bart-large-cnn", {
      input_text: article,
      max_length: 2000,
    });
    return response.summary;
  } catch (e) {
    console.log(e);
    return null;
  }
}
