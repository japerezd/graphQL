import { request, gql } from 'graphql-request';

const GRAPHQL_URL = 'http://localhost:9000/graphql';

export async function getJobs() {
  const query = gql`
    query {
      jobs {
        title
        id
        company {
          name
        }
      }
    }
  `;

  const data = await request(GRAPHQL_URL, query);
  console.log('data:', data);
}
