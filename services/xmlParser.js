import xml2js from 'xml2js';

const parser = new xml2js.Parser();

function parseXML(data) {
  return parser.parseStringPromise(data);
}

export default parseXML;
