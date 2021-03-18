import PropTypes from 'prop-types';

import PostItem from './PostItem';

function Posts({ posts }) {
  return posts.map(({
    title,
    link,
    summary,
  }) => (
    <PostItem
      key={link}
      title={title}
      link={link}
      summary={summary}
    />
  ));
}

Posts.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default Posts;
