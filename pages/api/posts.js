import request from '../../services/request';
import parseXML from '../../services/xmlParser';
import { mediumRSSSource, virgoolRSSSourse, cacheTime } from '../../config';

const cache = {
  posts: null,
  timestamp: null,
};

export default async function getAllPosts(req, res) {
  if (!cache.posts
    || Date.now() - cache.timestamp > cacheTime) {
    const posts = await fetchAllPosts();

    cache.posts = posts;
    cache.timestamp = Date.now();

    return res.json(posts);
  }

  return res.json(cache.posts);
}
async function fetchAllPosts() {
  const [mediumPosts, virgoolPosts] = await Promise.all([getMediumPosts(), getVirgoolPosts()]);
  const posts = [...mediumPosts, ...virgoolPosts]
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return posts;
}

function getMediumPosts() {
  return requestXML(mediumRSSSource)
    .then(({ rss }) => transformMediumPosts(rss.channel[0].item));
}

function getVirgoolPosts() {
  return requestXML(virgoolRSSSourse)
    .then(({ feed }) => transformVirgoolPosts(feed.entry));
}

function requestXML(url) {
  return request(url)
    .then((response) => parseXML(response));
}

function transformMediumPosts(posts) {
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

function transformVirgoolPosts(posts) {
  return posts.map(({
    title,
    id,
    updated: date,
    summary,
  }) => ({
    title: title[0]._,
    link: id[0],
    date: date[0],
    summary: summary[0]._,
  }));
}
