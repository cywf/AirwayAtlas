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
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function fetchRepoData() {
  console.log('Fetching repository data...');

  try {
    // Fetch repository info
    const repo = await fetchGitHubAPI(`/repos/${REPO_OWNER}/${REPO_NAME}`);

    // Fetch languages
    const languages = await fetchGitHubAPI(`/repos/${REPO_OWNER}/${REPO_NAME}/languages`);

    // Calculate language percentages
    const totalBytes = Object.values(languages).reduce((sum: number, bytes) => sum + (bytes as number), 0);
    const languagePercentages: { [key: string]: number } = {};
    for (const [lang, bytes] of Object.entries(languages)) {
      languagePercentages[lang] = Math.round(((bytes as number) / totalBytes) * 100);
    }

    // Fetch commit activity (last 52 weeks, we'll take last 12)
    const commitActivity = await fetchGitHubAPI(
      `/repos/${REPO_OWNER}/${REPO_NAME}/stats/commit_activity`
    );
    const last12Weeks = commitActivity.slice(-12);

    const stats = {
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      watchers: repo.watchers_count,
      openIssues: repo.open_issues_count,
      languages: languagePercentages,
      commitActivity: last12Weeks.map((week: any, index: number) => ({
        week: index + 1,
        total: week.total,
      })),
      lastUpdated: new Date().toISOString(),
    };

    const outputPath = join(__dirname, '../public/data/stats.json');
    writeFileSync(outputPath, JSON.stringify(stats, null, 2));
    console.log('Repository stats saved to:', outputPath);
    console.log('Stats:', JSON.stringify(stats, null, 2));
  } catch (error) {
    console.error('Error fetching repository data:', error);
    // Create empty fallback
    const fallback = {
      stars: 0,
      forks: 0,
      watchers: 0,
      openIssues: 0,
      languages: { JavaScript: 50, TypeScript: 30, HTML: 20 },
      commitActivity: Array.from({ length: 12 }, (_, i) => ({ week: i + 1, total: 0 })),
      lastUpdated: new Date().toISOString(),
    };
    const outputPath = join(__dirname, '../public/data/stats.json');
    writeFileSync(outputPath, JSON.stringify(fallback, null, 2));
    console.log('Created fallback stats file');
  }
}

fetchRepoData();
