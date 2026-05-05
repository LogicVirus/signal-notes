import { XMLParser } from "fast-xml-parser";
import type { FeedItem } from "../content/types";
import { stripHtml } from "../utils/html";
import { slugify } from "../utils/slug";

const parser = new XMLParser({
  attributeNamePrefix: "",
  ignoreAttributes: false,
  trimValues: true,
  cdataPropName: "cdata",
  textNodeName: "text"
});

type UnknownRecord = Record<string, unknown>;

export function parseFeed(xml: string, fallbackSourceTitle = "Unknown source"): FeedItem[] {
  const parsed = parser.parse(xml) as UnknownRecord;

  if (isRecord(parsed.rss)) {
    return parseRss(parsed.rss, fallbackSourceTitle);
  }

  if (isRecord(parsed.feed)) {
    return parseAtom(parsed.feed, fallbackSourceTitle);
  }

  return [];
}

function parseRss(rss: UnknownRecord, fallbackSourceTitle: string): FeedItem[] {
  const channel = isRecord(rss.channel) ? rss.channel : {};
  const sourceTitle = textValue(channel.title) || fallbackSourceTitle;
  const items = toArray(channel.item);

  return items
    .map((item, index) => {
      if (!isRecord(item)) {
        return undefined;
      }

      const title = textValue(item.title);
      const url = textValue(item.link) || textValue(item.guid);
      const rawSummary =
        textValue(item.description) || textValue(item.summary) || textValue(item["content:encoded"]);
      const publishedAt = normalizedDate(textValue(item.pubDate) || textValue(item.isoDate));

      if (!title || !url) {
        return undefined;
      }

      return {
        id: stableFeedId(sourceTitle, title, url, index),
        title,
        url,
        summary: stripHtml(rawSummary || "No summary was provided by this feed."),
        publishedAt,
        sourceTitle
      };
    })
    .filter(Boolean) as FeedItem[];
}

function parseAtom(feed: UnknownRecord, fallbackSourceTitle: string): FeedItem[] {
  const sourceTitle = textValue(feed.title) || fallbackSourceTitle;
  const entries = toArray(feed.entry);

  return entries
    .map((entry, index) => {
      if (!isRecord(entry)) {
        return undefined;
      }

      const title = textValue(entry.title);
      const url = atomLink(entry.link) || "";
      const rawSummary = textValue(entry.summary) || textValue(entry.content);
      const publishedAt = normalizedDate(textValue(entry.published) || textValue(entry.updated));

      if (!title || !url) {
        return undefined;
      }

      return {
        id: stableFeedId(sourceTitle, title, url, index),
        title,
        url,
        summary: stripHtml(rawSummary || "No summary was provided by this feed."),
        publishedAt,
        sourceTitle
      };
    })
    .filter(Boolean) as FeedItem[];
}

function atomLink(value: unknown): string | undefined {
  const links = toArray(value).filter(isRecord);
  const preferred = links.find((link) => !link.rel || link.rel === "alternate") ?? links[0];
  return textValue(preferred?.href) || textValue(preferred);
}

function stableFeedId(sourceTitle: string, title: string, url: string, index: number): string {
  return `feed:${slugify(sourceTitle)}:${slugify(title)}:${slugify(url).slice(-18) || index}`;
}

function normalizedDate(value: string): string {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? new Date(0).toISOString() : new Date(timestamp).toISOString();
}

function toArray(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }

  return value === undefined || value === null ? [] : [value];
}

function textValue(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value).trim();
  }

  if (!isRecord(value)) {
    return "";
  }

  return (
    textValue(value.text) ||
    textValue(value.cdata) ||
    textValue(value["#text"]) ||
    textValue(value.href) ||
    ""
  );
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}
