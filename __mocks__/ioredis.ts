const Redis = function () {
  return {
    on: () => {},
    get: async () => null,
    set: async () => "OK",
  };
};

module.exports = Redis;
