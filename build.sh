#!/bin/bash

# Run the npm build command
echo "Running npm run build..."
npm run build

# Check if the build was successful
if [ $? -eq 0 ]; then
  echo "Build successful. Proceeding with Git operations..."

  # Add all changes to Git
  git add .

  # Commit the changes
  echo "Enter commit message:"
  read commit_message
  git commit -m "$commit_message"

  echo "Enter branch:"
  read branch

  # Push the changes to the remote repository
  git push origin "$branch"

  echo "Changes pushed successfully."
else
  echo "Build failed. Aborting Git operations."
  exit 1
fi