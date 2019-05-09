export function customQuery(query) {
  if (!query) {
    return { query: { match_all: {} } };
  }
  return { query: { multi_match: { query, type: "phrase", fields: ["TICO"] } } };
}

export function customQueryMovie(query) {
  if (!query) {
    return { query: { match_all: {} } };
  }
  return {
    query: {
      bool: {
        should: [
          { multi_match: { query, type: "phrase", fields: ["overview", "original_title"] } },
          { multi_match: { query, type: "phrase_prefix", fields: ["original_title"] } }
        ]
      }
    }
  };
}

export const url = "http://pop-api-staging.eu-west-3.elasticbeanstalk.com/search/merimee";
