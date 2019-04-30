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

export const url = "http://pop-api-staging.eu-west-3.elasticbeanstalk.com/search/merimee";
