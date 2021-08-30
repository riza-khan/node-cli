const axios = require("axios");

const getInfo = async () => {
  axios
    .get("https://jsonplaceholder.typicode.com/posts/1")
    .then((res) => console.log(res.data))
    .catch((e) => console.log(e));
};

exports.getInfo = getInfo;
