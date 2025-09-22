import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"



import { gql } from "graphql-request";
import { GraphQLClient } from "graphql-request";

export async function GET(req: Request) {
  const secret = process.env.AUTH_SECRET
  const endpoint = "https://api.github.com/graphql";
  const token = await getToken({ req, secret })
  if (!token?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const headers = {
    headers: {
      authorization: `Bearer ${token.accessToken}`,
    },
  };
  const graphqlClient = new GraphQLClient(endpoint, headers);
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
                }
              }
            }
          }
        }
  `;

  const allStars = new Map();
  let cursor: String | null = null;

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
  //console.log("this is array", Array.from(allStars))
  console.log("done")
  return NextResponse.json(Array.from(allStars))
}
