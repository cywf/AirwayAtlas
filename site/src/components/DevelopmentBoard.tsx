import { useState, useEffect } from 'react';

interface ProjectItem {
  title: string;
  status: string;
  labels: string[];
  assignees: string[];
  url: string;
}

interface ProjectColumn {
  name: string;
  items: ProjectItem[];
}

export default function DevelopmentBoard() {
  const [columns, setColumns] = useState<ProjectColumn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/AirwayAtlas';
    fetch(`${baseUrl}/data/projects.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch project data');
        }
        return response.json();
      })
      .then((data) => {
        setColumns(data.columns || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading project data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="skeleton h-8 w-32 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="skeleton h-24 w-full"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (columns.length === 0) {
    return (
      <div className="alert alert-info">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Project board data will be available after the first CI deployment.</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 pb-4" style={{ minWidth: 'max-content' }}>
        {columns.map((column, index) => (
          <div key={index} className="flex-shrink-0 w-80">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">
                  {column.name}
                  <div className="badge badge-primary">{column.items.length}</div>
                </h2>
                <div className="space-y-3 mt-4">
                  {column.items.length === 0 ? (
                    <div className="text-sm opacity-70 text-center py-4">No items</div>
                  ) : (
                    column.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="card bg-base-300 shadow hover:shadow-lg transition-shadow">
                        <div className="card-body p-4">
                          <h3 className="font-semibold text-sm mb-2">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link link-hover"
                            >
                              {item.title}
                            </a>
                          </h3>
                          {item.labels.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {item.labels.map((label, labelIndex) => (
                                <span key={labelIndex} className="badge badge-sm badge-outline">
                                  {label}
                                </span>
                              ))}
                            </div>
                          )}
                          {item.assignees.length > 0 && (
                            <div className="flex items-center gap-2 text-xs opacity-70">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                />
                              </svg>
                              <span>{item.assignees.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
