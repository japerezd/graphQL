import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import { getAccessToken } from '../auth';

const GRAPHQL_URL = 'http://localhost:9000/graphql';

export const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(),
});

const JOB_DETAIL_FRAGMENT = gql`
  fragment JobDetail on Job {
    id
    title
    company {
      id
      name
    }
    description
  }
`;

export const JOB_QUERY = gql`
  query JobQuery($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${JOB_DETAIL_FRAGMENT}
`;

export const JOBS_QUERY = gql`
  query JobsQuery {
    jobs {
      title
      id
      company {
        id # just for apollo client
        name
      }
    }
  }
`;

export const COMPANY_QUERY = gql`
  query CompanyQuery($id: ID!) {
    company(id: $id) {
      id
      description
      name
      jobs {
        id
        title
      }
    }
  }
`;

export async function createJob(input) {
  const mutation = gql`
    mutation CreateJobMutation($input: CreateJobInput!) {
      job: createJob(input: $input) {
        ...JobDetail
      }
    }
    ${JOB_DETAIL_FRAGMENT}
  `;

  const variables = { input };
  const context = { headers: { Authorization: `Bearer ${getAccessToken()}` } };
  const {
    data: { job },
  } = await client.mutate({
    mutation,
    variables,
    context,
    // Second argument is result (which is what returns  client.mutate)
    update: (cache, { data: { job } }) => {
      cache.writeQuery({
        query: JOB_QUERY,
        variables: { id: job.id },
        data: {
          // data we want to write (always an object)
          job,
        },
      });
    },
  });
  return job;
}

export async function getCompany(companyId) {
  const query = gql`
    query CompanyQuery($id: ID!) {
      company(id: $id) {
        id
        description
        name
        jobs {
          id
          title
        }
      }
    }
  `;

  const variables = { id: companyId };
  const {
    data: { company },
  } = await client.query({ query, variables });
  return company;
}
