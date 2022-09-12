import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import { getAccessToken } from '../auth';

const GRAPHQL_URL = 'http://localhost:9000/graphql';

const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(),
});

const JOB_QUERY = gql`
    query JobQuery($id: ID!) {
      job(id: $id) {
        id
        title
        company {
          id
          name
        }
        description
      }
    }
  `;

export async function createJob(input) {
  const mutation = gql`
    mutation CreateJobMutation($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
        title
        company {
          id
          name
        }
        description
      }
    }
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
        data: { // data we want to write (always an object)
          job
        }
      })
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

export async function getJob(id) {
  const variables = { id };
  const {
    data: { job },
  } = await client.query({ query: JOB_QUERY, variables });
  return job;
}

export async function getJobs() {
  const query = gql`
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

  const {
    data: { jobs },
  } = await client.query({ query, fetchPolicy: 'network-only' });
  return jobs;
}
