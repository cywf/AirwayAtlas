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

async function fetchGitHubAPI(endpoint: string) {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
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

async function fetchProjectsV2() {
  console.log('Fetching Projects v2 data...');

  const query = `
    query {
      repository(owner: "${REPO_OWNER}", name: "${REPO_NAME}") {
        projectsV2(first: 1) {
          nodes {
            title
            items(first: 100) {
              nodes {
                content {
                  ... on Issue {
                    title
                    url
                    labels(first: 10) {
                      nodes {
                        name
                      }
                    }
                    assignees(first: 5) {
                      nodes {
                        login
                      }
                    }
                  }
                  ... on PullRequest {
                    title
                    url
                    labels(first: 10) {
                      nodes {
                        name
                      }
                    }
                    assignees(first: 5) {
                      nodes {
                        login
                      }
                    }
                  }
                }
                fieldValues(first: 10) {
                  nodes {
                    ... on ProjectV2ItemFieldSingleSelectValue {
                      name
                      field {
                        ... on ProjectV2SingleSelectField {
                          name
                        }
                      }
                    }
                  }
                }
              }
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
      throw new Error('Failed to fetch projects');
    }

    if (!data.data.repository.projectsV2.nodes.length) {
      console.log('No Projects v2 found, falling back to issues-by-label approach');
      await fetchIssuesByLabels();
      return;
    }

    const project = data.data.repository.projectsV2.nodes[0];
    const columns: { [key: string]: any[] } = {
      'To Do': [],
      'In Progress': [],
      'Done': [],
    };

    project.items.nodes.forEach((item: any) => {
      if (!item.content) return;

      const statusField = item.fieldValues.nodes.find(
        (fv: any) => fv.field?.name === 'Status'
      );
      const status = statusField?.name || 'To Do';

      const projectItem = {
        title: item.content.title,
        url: item.content.url,
        labels: item.content.labels?.nodes.map((l: any) => l.name) || [],
        assignees: item.content.assignees?.nodes.map((a: any) => a.login) || [],
        status,
      };

      // Add item to the appropriate column
      const targetColumn = columns[status] || columns['To Do'];
      if (targetColumn) {
        targetColumn.push(projectItem);
      }
    });

    const result = {
      columns: Object.entries(columns).map(([name, items]) => ({ name, items })),
    };

    const outputPath = join(__dirname, '../public/data/projects.json');
    writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log('Projects data saved to:', outputPath);
  } catch (error) {
    console.error('Error fetching projects v2:', error);
    console.log('Falling back to issues-by-label approach');
    await fetchIssuesByLabels();
  }
}

async function fetchIssuesByLabels() {
  console.log('Fetching issues grouped by labels...');

  try {
    const issues = await fetchGitHubAPI(`/repos/${REPO_OWNER}/${REPO_NAME}/issues?state=open&per_page=100`);

    const columns = {
      'To Do': [] as any[],
      'In Progress': [] as any[],
      'Done': [] as any[],
    };

    issues.forEach((issue: any) => {
      const labels = issue.labels.map((l: any) => l.name);
      const item = {
        title: issue.title,
        url: issue.html_url,
        labels,
        assignees: issue.assignees.map((a: any) => a.login),
        status: 'To Do',
      };

      if (labels.some((l: string) => l.includes('doing') || l.includes('progress'))) {
        columns['In Progress'].push(item);
      } else if (labels.some((l: string) => l.includes('done') || l.includes('complete'))) {
        columns['Done'].push(item);
      } else {
        columns['To Do'].push(item);
      }
    });

    const result = {
      columns: Object.entries(columns).map(([name, items]) => ({ name, items })),
    };

    const outputPath = join(__dirname, '../public/data/projects.json');
    writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log('Projects data (from issues) saved to:', outputPath);
  } catch (error) {
    console.error('Error fetching issues:', error);
    // Create empty fallback
    const fallback = {
      columns: [
        { name: 'To Do', items: [] },
        { name: 'In Progress', items: [] },
        { name: 'Done', items: [] },
      ],
    };
    const outputPath = join(__dirname, '../public/data/projects.json');
    writeFileSync(outputPath, JSON.stringify(fallback, null, 2));
    console.log('Created empty projects file');
  }
}

fetchProjectsV2();
