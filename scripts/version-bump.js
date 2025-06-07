#!/usr/bin/env node

// filepath: /home/daniel/projects/formBuilder/scripts/version-bump.js
import { readFileSync, writeFileSync } from 'fs';
import { spawnSync } from 'child_process';
import { join } from 'path';
import process from 'process';

// Get the type of version bump from command line arguments
const args = process.argv.slice(2);
const validBumpTypes = ['major', 'minor', 'patch'];
const bumpType = args[0]?.toLowerCase();

if (!validBumpTypes.includes(bumpType)) {
  console.error(`Error: Must specify a valid version bump type: ${validBumpTypes.join(', ')}`);
  process.exit(1);
}

try {
  // Read package.json
  const packageJsonPath = join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const currentVersion = packageJson.version;

  // Bump version using npm
  console.log(`Bumping ${bumpType} version from ${currentVersion}...`);
  const { status } = spawnSync('npm', ['version', bumpType, '--no-git-tag-version'], {
    stdio: 'inherit',
  });

  if (status !== 0) {
    throw new Error(`npm version command failed with status code: ${status}`);
  }

  // Read updated package.json
  const updatedPackageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const newVersion = updatedPackageJson.version;

  console.log(`Version updated from ${currentVersion} to ${newVersion}`);

  // Update README badge
  const readmePath = join(process.cwd(), 'README.md');
  const readmeContent = readFileSync(readmePath, 'utf8');

  const updatedReadme = readmeContent.replace(
    /\[!\[Version\]\(https:\/\/img\.shields\.io\/badge\/version-[0-9]+\.[0-9]+\.[0-9]+-blue\.svg\)\]/g,
    `[![Version](https://img.shields.io/badge/version-${newVersion}-blue.svg)]`
  );

  writeFileSync(readmePath, updatedReadme, 'utf8');
  console.log('Updated version badge in README.md');

  // Instructions for creating a new release
  console.log(`
To complete the release process:
1. Run: git add .
2. Run: git commit -m "Bump version to ${newVersion}"
3. Run: git tag v${newVersion}
4. Run: git push && git push --tags
5. Create a release on GitHub to trigger automatic publishing
  `);
} catch (error) {
  console.error('Error updating version:', error);
  process.exit(1);
}
