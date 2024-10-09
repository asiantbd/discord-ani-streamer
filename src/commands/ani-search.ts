import fetch from 'node-fetch';

export async function aniSearch(title: string): Promise<any> {
    let schema = `query Query($id: Int, $page: Int, $perPage: Int, $search: String, $sort: [MediaSort]) {
  Page (page: $page, perPage: $perPage) {
    pageInfo {
      currentPage
      hasNextPage
      perPage
    }
    media(id: $id, search: $search, sort: $sort) {
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
    }
  }
}`;

    let variable = {
        "search": title,
        "page": 1,
        "perPage": 99,
        "sort": "START_DATE_DESC"
    }
    let response = await fetch("https://graphql.anilist.co/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query: schema,
            variables: variable
        }),
    });
    return await response.json();
}
