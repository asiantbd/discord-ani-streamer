import fetch from "node-fetch";

const graphqlAnilistEndpoint = "https://graphql.anilist.co/";

export async function querySearchAnime(title: string): Promise<any> {
    let schema = `query Query($id: Int, $page: Int, $perPage: Int, $search: String, $sort: [MediaSort], $type: MediaType) {
      Page (page: $page, perPage: $perPage) {
        pageInfo {
          currentPage
          hasNextPage
          perPage
        }
        media(id: $id, search: $search, sort: $sort, type: $type) {
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
        perPage: 3,
        sort: "START_DATE_DESC",
        type: "ANIME",
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
