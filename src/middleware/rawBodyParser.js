function rawBodyParser(req, res, buffer) {
  req['rawBody'] = buffer;
}

module.exports = rawBodyParser;
