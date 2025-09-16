export type AppEnv = {
  Bindings: Cloudflare.Env;
};

export type ArticleSummary = {
  content: string | null | undefined;
  summary: string | null | undefined;
  title: string | null | undefined;
};
