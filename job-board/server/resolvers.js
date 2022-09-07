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
    createJob: (_root, { title, companyId, description }) => {
      return Job.create({ title, companyId, description })
    }
  },

  Company: {
    jobs: (company) => Job.findAll((job) => job.companyId === company.id)
  },

  Job: {
    company: (job) =>  Company.findById(job.companyId)
  }
}