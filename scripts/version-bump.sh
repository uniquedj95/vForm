#!/bin/bash

# Check if a version bump type was provided
if [ $# -ne 1 ]; then
  echo "Error: Must specify a version bump type: major, minor, or patch"
  exit 1
fi

# Validate the bump type
BUMP_TYPE=$(echo "$1" | tr '[:upper:]' '[:lower:]')
if [[ ! "$BUMP_TYPE" =~ ^(major|minor|patch)$ ]]; then
  echo "Error: Must specify a valid version bump type: major, minor, or patch"
  exit 1
fi

# Get the current version from package.json
CURRENT_VERSION=$(grep -o '"version": "[^"]*"' package.json | cut -d'"' -f4)
echo "Bumping $BUMP_TYPE version from $CURRENT_VERSION..."

# Bump the version using npm
npm version "$BUMP_TYPE" --no-git-tag-version

# Get the new version from package.json
NEW_VERSION=$(grep -o '"version": "[^"]*"' package.json | cut -d'"' -f4)
echo "Version updated from $CURRENT_VERSION to $NEW_VERSION"

# Update the README badge
if [ -f README.md ]; then
  # Use sed to replace the version in the badge
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS requires a different sed syntax
    sed -i '' -E "s/\[\!\[Version\]\(https:\/\/img\.shields\.io\/badge\/version-[0-9]+\.[0-9]+\.[0-9]+-blue\.svg\)\]/[![Version](https:\/\/img.shields.io\/badge\/version-$NEW_VERSION-blue.svg)]/" README.md
  else
    # Linux and others
    sed -i -E "s/\[\!\[Version\]\(https:\/\/img\.shields\.io\/badge\/version-[0-9]+\.[0-9]+\.[0-9]+-blue\.svg\)\]/[![Version](https:\/\/img.shields.io\/badge\/version-$NEW_VERSION-blue.svg)]/" README.md
  fi
  echo "Updated version badge in README.md"
fi

# Instructions for creating a new release
echo "
To complete the release process:
1. Run: git add .
2. Run: git commit -m \"Bump version to $NEW_VERSION\"
3. Run: git tag v$NEW_VERSION
4. Run: git push && git push --tags
5. Create a release on GitHub to trigger automatic publishing
"
