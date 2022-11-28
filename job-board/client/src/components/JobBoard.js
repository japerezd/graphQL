import JobList from './JobList';
import { useJobs } from '../graphql/hooks';

function JobBoard() {
  const { jobs, loading, error } = useJobs();

  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>Sorry, something went wrong</p>
  }

  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default JobBoard;
