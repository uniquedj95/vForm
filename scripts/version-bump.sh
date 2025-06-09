#!/bin/bash

# Function to display usage information
show_usage() {
  echo "Usage: $0 [OPTIONS] <major|minor|patch>"
  echo
  echo "Options:"
  echo "  -h, --help     Show this help message"
  echo "  -d, --dry-run  Perform a dry run (show what would happen without making changes)"
  echo
  echo "Examples:"
  echo "  $0 patch       # Bump patch version and release"
  echo "  $0 -d minor    # Show what would happen for a minor version bump"
  exit 1
}

# Initialize variables
DRY_RUN=false
BUMP_TYPE=""

# Parse command line options
while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help)
      show_usage
      ;;
    -d|--dry-run)
      DRY_RUN=true
      shift
      ;;
    major|minor|patch)
      BUMP_TYPE=$(echo "$1" | tr '[:upper:]' '[:lower:]')
      shift
      ;;
    *)
      echo "Error: Unknown option '$1'"
      show_usage
      ;;
  esac
done

# Check if a version bump type was provided
if [ -z "$BUMP_TYPE" ]; then
  echo "Error: Must specify a version bump type: major, minor, or patch"
  show_usage
fi

# Validate the bump type
if [[ ! "$BUMP_TYPE" =~ ^(major|minor|patch)$ ]]; then
  echo "Error: Must specify a valid version bump type: major, minor, or patch"
  exit 1
fi

# Get the current version from package.json
CURRENT_VERSION=$(grep -o '"version": "[^"]*"' package.json | cut -d'"' -f4)
echo "Current version: $CURRENT_VERSION"

# Calculate what the new version would be
if [ "$DRY_RUN" = true ]; then
  # In dry run mode, just calculate what the next version would be
  case "$BUMP_TYPE" in
    patch)
      IFS='.' read -r major minor patch <<< "$CURRENT_VERSION"
      NEW_VERSION="$major.$minor.$((patch + 1))"
      ;;
    minor)
      IFS='.' read -r major minor patch <<< "$CURRENT_VERSION"
      NEW_VERSION="$major.$((minor + 1)).0"
      ;;
    major)
      IFS='.' read -r major minor patch <<< "$CURRENT_VERSION"
      NEW_VERSION="$((major + 1)).0.0"
      ;;
  esac
  echo "DRY RUN: Would bump $BUMP_TYPE version from $CURRENT_VERSION to $NEW_VERSION"
else
  # Check if working directory is clean
  if [ -n "$(git status --porcelain)" ]; then
    echo "Error: Working directory is not clean. Please commit or stash your changes before bumping version."
    exit 1
  fi

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
fi

# Automate the release process
if [ "$DRY_RUN" = true ]; then
  echo "
DRY RUN: Would complete these steps:
1. Stage all changes: git add .
2. Commit with message: git commit -m \"Bump version to $NEW_VERSION\"
3. Create version tag: git tag v$NEW_VERSION
4. Push changes and tags: git push && git push --tags"
  
  if command -v gh &> /dev/null; then
    echo "5. Create GitHub release: gh release create v$NEW_VERSION"
    echo "6. Automatic npm publishing would be triggered"
  else
    echo "5. Create a release on GitHub to trigger automatic publishing"
    echo "   (Install GitHub CLI 'gh' for full automation)"
  fi
  
  echo "
No changes were actually made. Run without --dry-run to perform these actions.
"
else
  echo "Completing the release process..."

  # Stage all changes
  echo "Staging changes..."
  git add .

  # Commit with version bump message
  echo "Committing changes..."
  git commit -m "Bump version to $NEW_VERSION"

  # Create a version tag
  echo "Creating version tag..."
  git tag v$NEW_VERSION

  # Push changes and tags
  echo "Pushing to remote repository..."
  git push && git push --tags

  # Check if GitHub CLI is installed
  if command -v gh &> /dev/null; then
    echo "Creating GitHub release..."
    
    # Generate release notes from recent commits
    RELEASE_NOTES=$(git log --pretty=format:"- %s" $(git describe --tags --abbrev=0 HEAD~1)..HEAD 2>/dev/null || echo "- Version $NEW_VERSION release")
    
    # Create GitHub release
    gh release create "v$NEW_VERSION" \
      --title "Release v$NEW_VERSION" \
      --notes "$RELEASE_NOTES" \
      --latest
    
    echo "
🎉 Fully automated release completed:
✓ Changes committed with message: \"Bump version to $NEW_VERSION\"
✓ Version tagged as: v$NEW_VERSION
✓ Changes and tags pushed to remote repository
✓ GitHub release created and published
✓ Automatic npm publishing triggered

Your package will be published automatically!"
  else
    echo "
Release process completed:
✓ Changes committed with message: \"Bump version to $NEW_VERSION\"
✓ Version tagged as: v$NEW_VERSION
✓ Changes and tags pushed to remote repository

⚠️  GitHub CLI (gh) not found. Install it to fully automate releases:
   curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
   echo \"deb [arch=\$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main\" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
   sudo apt update && sudo apt install gh

Next steps:
- Create a release on GitHub to trigger automatic publishing
"
  fi
fi
