import axios from 'axios';
import xml2js from 'xml2js';

import type { Post } from './types'
import { mediumRSSSource, virgoolRSSSourse } from './config';

const get = (url: string) => axios.get(url).then((res) => res.data);
const parser = new xml2js.Parser();

function parseXML(data : string) {
  return parser.parseStringPromise(data);
}

function requestXML(url: string) {
  return get(url)
    .then((response) => parseXML(response));
}

export async function fetchAllPosts() : Promise<Post[]> {
  const [mediumPosts, virgoolPosts] = await Promise.all([getMediumPosts(), getVirgoolPosts()]);
  const posts = [...mediumPosts, ...virgoolPosts]
    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)));

  return posts;
}

function getMediumPosts() {
  return requestXML(mediumRSSSource)
    .then(({ rss }) => transformMediumPosts(rss.channel[0].item));
}

function getVirgoolPosts() {
  return requestXML(virgoolRSSSourse)
    .then(({ rss }) => transformVirgoolPosts(rss.channel[0].item));
}

function transformMediumPosts(posts: any[]) : Post[] {
  return posts.map(({
    title,
    link,
    'atom:updated': date,
    'content:encoded': body,
  }) => ({
    title: title[0],
    link: link[0],
    date: date[0],
    summary: body[0].slice(0, 300),
  }));
}

function transformVirgoolPosts(posts: any[]) : Post[] {
  return posts.map(({
    title,
    link,
    pubDate,
    description,
  }) => ({
    title: title[0],
    link: link[0],
    date: pubDate[0],
    summary: description[0].slice(0, 300),
  }));
}
