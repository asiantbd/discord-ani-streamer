import fetch from "node-fetch";

const graphqlAllanimeEndpoint = "https://api.allanime.day/api";

export async function matchAllanimeId(
  title: string,
  aniListId: string,
): Promise<string> {
  let allanimeResults = await querySearchAllanime(title);

  if (allanimeResults.data.shows.edges) {
    const matchedShow = allanimeResults.data.shows.edges.find(
      (edge: any) => edge.aniListId === aniListId,
    );

    if (matchedShow) {
      return matchedShow._id;
    }
  }

  throw new Error(
    `No matching Allanime ID found for title: ${title} and AniList ID: ${aniListId}`,
  );
}

export async function querySearchAllanime(title: string): Promise<any> {
  let schema = `query Shows($search: SearchInput) {
      shows(search: $search) {
        edges {
          _id
          aniListId
          malId
          name
        }
      }
    }`;

  let variable = {
    search: {
      allowUnknown: false,
      query: title,
    },
  };

  let response = await fetch(graphqlAllanimeEndpoint, {
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
