export function customQuery(query) {
  if (!query) {
    return { match_all: {} };
  }
  return { multi_match: { query, type: "phrase", fields: ["TICO"] } };
}

export function customQueryMovie(query) {
  if (!query) {
    return { match_all: {} };
  }
  return {
    bool: {
      should: [
        { multi_match: { query, type: "phrase", fields: ["overview", "original_title"] } },
        { multi_match: { query, type: "phrase_prefix", fields: ["original_title"] } }
      ]
    }
  };
}
/*
export const url = "https://scalr.api.appbase.io/react-elasticsearch-films";

export const headers = {
  Authorization: "Basic " + window.btoa("Qq38oEj7D:a23804f8-f0c4-4dea-9a55-67739275e588")
};

*/
export const url = "https://scalr.api.appbase.io/MovieAppFinal";

export const headers = {
  Authorization: "Basic UnhJQWJIOUpjOjZkM2E1MDE2LTVlOWQtNDQ4Zi1iZDJiLTYzYzgwYjQwMTQ4NA=="
};



/**
 *  "overview":"Minions Stuart, Kevin and Bob are recruited by Scarlet Overkill,...",
 *  "original_language":"English",
 *  "original_title":"Minions",
 *  "genres":"Comedy",
 * "release_year":2015,
 *  "tagline":"Before Gru, they had a history of bad bosses",
 * "poster_path":"https://image.tmdb.org/t/p/w185/q0R4crx2SehcEEQEkYObktdeFy.jpg"
 */
