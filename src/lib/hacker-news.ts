import { extract, FeedEntry } from "@extractus/feed-extractor";
import { HN_RSS } from "./consts";

export async function getFeed() {
  const data = await extract(HN_RSS, {
    getExtraEntryFields(entryData: any) {
      return { comments: entryData.comments };
    },
  });
  return data.entries as (FeedEntry & { comments: string })[];
}
