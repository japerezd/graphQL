import JobList from './JobList';
import { getJobs } from '../graphql/queries'
import { useEffect, useState } from 'react';

function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    getJobs().then(setJobs).catch(err => setError(true));
  }, []);

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
