import { Company, Job } from './db.js'

export const resolvers = {
  // Queries are to get info from database
  Query: {
    company: (_root, { id }) => Company.findById(id),
    job: (_root, { id }) =>  Job.findById(id),
    jobs: () => Job.findAll()
  },

  // Mutations are to mutate or modify something in database
  Mutation: {
    // third argument (which is called context) is provided from server in 
    // new ApolloServer instance
    createJob: (_root, { input }, { auth }) => {
      if (!auth) {
        throw new Error('Unauthorized')
      }
      return Job.create(input)
    },
    deleteJob: (_root, { id }) => Job.delete(id),
    updateJob: (_root, { input }) => Job.update(input)
  },

  Company: {
    jobs: (company) => Job.findAll((job) => job.companyId === company.id)
  },

  Job: {
    company: (job) =>  Company.findById(job.companyId)
  }
}