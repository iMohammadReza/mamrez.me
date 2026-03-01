import axios from 'axios';
import xml2js from 'xml2js';

import type { Post } from './types';
import { mediumRSSSource } from './config';

interface RawRssItem {
  title: string[];
  link: string[];
  'atom:updated'?: string[];
  'content:encoded'?: string[];
}

const CACHE_TTL_MS = 5 * 60 * 1000;
let cachedPosts: Post[] | null = null;
let cacheTimestamp = 0;

export async function fetchAllPosts(): Promise<Post[]> {
  const now = Date.now();
  if (cachedPosts && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedPosts;
  }

  try {
    const posts = await getMediumPosts();
    cachedPosts = posts.sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)));
    cacheTimestamp = now;
    return cachedPosts;
  } catch (err) {
    if (cachedPosts) return cachedPosts;
    console.error('Failed to fetch Medium posts:', (err as Error).message);
    return [];
  }
}

function getMediumPosts(): Promise<Post[]> {
  return fetchXML(mediumRSSSource).then(({ rss }) => transformMediumPosts(rss.channel[0].item));
}

function transformMediumPosts(posts: RawRssItem[]): Post[] {
  return posts.map(({ title, link, 'atom:updated': date, 'content:encoded': body }) => ({
    title: title[0],
    link: link[0],
    date: date?.[0] ?? '',
    summary: (body?.[0] ?? '').slice(0, 300),
  }));
}

const parser = new xml2js.Parser();

function fetchXML(url: string) {
  return axios
    .get<string>(url)
    .then((res) => res.data)
    .then((xml) => parser.parseStringPromise(xml));
}
