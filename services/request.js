import axios from 'axios';

const request = (url) => axios.get(url).then((res) => res.data);

export default request;
