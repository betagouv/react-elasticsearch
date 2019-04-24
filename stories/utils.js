export function customQuery(value) {
  if (!value) {
    return { match_all: {} };
  }
  return { multi_match: { query: value, type: "phrase", fields: ["TICO"] } };
}

export const url = "http://pop-api-staging.eu-west-3.elasticbeanstalk.com/search/merimee";
