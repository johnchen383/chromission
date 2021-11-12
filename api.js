const { default: axios } = require("axios");
/*
 *   types are : General, knock-knock, programming
 *
 *
 */
export default function callAPI(type) {
  if (type) {
    return axios.get(
      `https://us-central1-dadsofunny.cloudfunctions.net/DadJokes/random/type/${type}`
    );
  } else {
    return axios.get(
      `https://us-central1-dadsofunny.cloudfunctions.net/DadJokes/random/jokes`
    );
  }
}
