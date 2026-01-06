import { NextResponse } from "next/server"
import { gql } from "graphql-request";
import { GraphQLClient } from "graphql-request";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("cursor");
  const endpoint = "https://api.github.com/graphql";
  const headers = {
    headers: {
      authorization: `Bearer ${process.env.PAT}`,
    },
  };
  const graphqlClient = new GraphQLClient(endpoint, headers);

  let cursor: String | null = search || null;


  const Query = gql`
    query GetStars($after: String) {
          viewer {
            starredRepositories(
              orderBy: {direction: ASC, field: STARRED_AT}
              first: 100
              after: $after
            ) {
              totalCount
              pageInfo {
                hasNextPage 
                startCursor
                endCursor
              }
              edges {
                starredAt
                node {
                  databaseId
                  nameWithOwner
                  stargazerCount
                  primaryLanguage{
                    name,
                    color,
                  }
                  description
                }
              }
            }
          }
        }
  `;

  const allStars = new Map();


  let hasNextPage = true;
  while (hasNextPage) {
    const data: any = await graphqlClient.request(Query, { after: cursor });
    const page = data.viewer.starredRepositories;
    cursor = page.pageInfo.endCursor;
    // POST PROCESSING BLOCK
    await Promise.resolve(
      page.edges.forEach((item: any) => {
        allStars.set(item.node.databaseId.toString(), item.node);
        //console.log(item.node.nameWithOwner)
      })
    );
    hasNextPage = page.pageInfo.hasNextPage;
  }
  return NextResponse.json({
    stars: Array.from(allStars),
    cursor: cursor
  })

}
