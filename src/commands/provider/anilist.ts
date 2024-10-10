import fetch from "node-fetch";

const graphqlAnilistEndpoint = "https://graphql.anilist.co/";

export async function querySearchAnime(title: string): Promise<any> {
  let schema = `query Query($id: Int, $page: Int, $perPage: Int, $search: String, $sort: [MediaSort], $type: MediaType, $statusNotIn: [MediaStatus]) {
      Page (page: $page, perPage: $perPage) {
        pageInfo {
          currentPage
          hasNextPage
          perPage
        }
        media(id: $id, search: $search, sort: $sort, type: $type, status_not_in: $statusNotIn) {
          title {
            english
            native
            romaji
          }
          episodes
          meanScore
          airingSchedule {
            edges {
              node {
                airingAt
                episode
                timeUntilAiring
              }
            }
          }
          coverImage {
            medium
            extraLarge
            large
          }
          season
          seasonYear
        }
      }
    }`;

  let variable = {
    search: title,
    page: 1,
    perPage: 5,
    sort: "START_DATE_DESC",
    type: "ANIME",
    statusNotIn: ["NOT_YET_RELEASED", "CANCELLED"],
  };
  let response = await fetch(graphqlAnilistEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: schema,
      variables: variable,
    }),
  });
  return await response.json();
}
