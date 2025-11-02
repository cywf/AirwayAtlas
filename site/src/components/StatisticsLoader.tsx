import { useState, useEffect } from 'react';
import RepositoryCharts from './RepositoryCharts';

interface StatsData {
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  languages: { [key: string]: number };
  commitActivity: Array<{ week: number; total: number }>;
}

export default function StatisticsLoader() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/AirwayAtlas';
    fetch(`${baseUrl}/data/stats.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        return response.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading statistics:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (error) {
    return (
      <div className="alert alert-warning">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>Unable to load statistics. They will be available after the first CI deployment.</span>
      </div>
    );
  }

  return <RepositoryCharts stats={stats} loading={loading} />;
}
