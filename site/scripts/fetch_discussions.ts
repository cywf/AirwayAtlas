#!/usr/bin/env node

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'cywf';
const REPO_NAME = 'AirwayAtlas';

if (!GITHUB_TOKEN) {
  console.error('GITHUB_TOKEN environment variable is required');
  process.exit(1);
}

async function fetchGitHubGraphQL(query: string) {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function fetchDiscussions() {
  console.log('Fetching discussions...');

  const query = `
    query {
      repository(owner: "${REPO_OWNER}", name: "${REPO_NAME}") {
        discussions(first: 25, orderBy: {field: CREATED_AT, direction: DESC}) {
          nodes {
            title
            url
            createdAt
            author {
              login
            }
            category {
              name
            }
            comments {
              totalCount
            }
          }
        }
      }
    }
  `;

  try {
    const data = await fetchGitHubGraphQL(query);

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      throw new Error('Failed to fetch discussions');
    }

    const discussions = data.data.repository.discussions.nodes.map((node: any) => ({
      title: node.title,
      url: node.url,
      category: node.category.name,
      author: node.author?.login || 'Unknown',
      createdAt: node.createdAt,
      comments: node.comments.totalCount,
    }));

    const outputPath = join(__dirname, '../public/data/discussions.json');
    writeFileSync(outputPath, JSON.stringify(discussions, null, 2));
    console.log('Discussions saved to:', outputPath);
    console.log(`Fetched ${discussions.length} discussions`);
  } catch (error) {
    console.error('Error fetching discussions:', error);
    // Create empty fallback
    const outputPath = join(__dirname, '../public/data/discussions.json');
    writeFileSync(outputPath, JSON.stringify([], null, 2));
    console.log('Created empty discussions file');
  }
}

fetchDiscussions();
