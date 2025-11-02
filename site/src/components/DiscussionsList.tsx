import { useState, useEffect } from 'react';

interface Discussion {
  title: string;
  url: string;
  category: string;
  author: string;
  createdAt: string;
  comments: number;
}

export default function DiscussionsList() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/AirwayAtlas';
    fetch(`${baseUrl}/data/discussions.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch discussions');
        }
        return response.json();
      })
      .then((data) => {
        setDiscussions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading discussions:', err);
        setLoading(false);
      });
  }, []);

  const filteredDiscussions = discussions.filter((discussion) => {
    const matchesSearch =
      discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || discussion.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(discussions.map((d) => d.category)));

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="skeleton h-6 w-3/4 mb-2"></div>
              <div className="skeleton h-4 w-full mb-2"></div>
              <div className="skeleton h-4 w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (discussions.length === 0) {
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
        <span>No discussions available. They will be loaded after the first CI deployment.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="form-control flex-1">
              <input
                type="text"
                placeholder="Search discussions..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="form-control md:w-48">
              <select
                className="select select-bordered w-full"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-sm opacity-70 mt-2">
            Showing {filteredDiscussions.length} of {discussions.length} discussions
          </div>
        </div>
      </div>

      {/* Discussions List */}
      <div className="space-y-4">
        {filteredDiscussions.length === 0 ? (
          <div className="alert alert-warning">
            <span>No discussions match your search criteria.</span>
          </div>
        ) : (
          filteredDiscussions.map((discussion, index) => (
            <div key={index} className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body">
                <h3 className="card-title">
                  <a
                    href={discussion.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-hover"
                  >
                    {discussion.title}
                  </a>
                </h3>
                <div className="flex flex-wrap gap-2 items-center text-sm">
                  <div className="badge badge-primary">{discussion.category}</div>
                  <div className="opacity-70">by {discussion.author}</div>
                  <div className="opacity-70">
                    {new Date(discussion.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1 opacity-70">
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
                        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                      />
                    </svg>
                    <span>{discussion.comments}</span>
                  </div>
                </div>
                <div className="card-actions justify-end mt-2">
                  <a
                    href={discussion.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-primary"
                  >
                    View on GitHub
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
                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
