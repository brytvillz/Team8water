# Team8water Collaboration Guide

## Getting Started

### For New Collaborators:

1. Accept the GitHub invitation
2. Clone the repository:
   ```bash
   git clone https://github.com/brytvillz/Team8water.git
   cd "8 WATER TEAM"
   ```
3. Open the project in VS Code:
   ```bash
   code .
   ```

## Complete Workflow (Step-by-Step)

### Step 1: After Cloning - Create a Branch

```bash
# Make sure you're in the project folder
cd "8 WATER TEAM"

# Check current branch (should be 'main')
git branch

# Create and switch to a new branch for your feature
git checkout -b feature/descriptive-name

# REAL EXAMPLES based on what you're working on:

# If working on the orders folder:
git checkout -b feature/orders-filter
git checkout -b feature/orders-sorting
git checkout -b fix/orders-display-bug

# If working on the marketplace folder:
git checkout -b feature/marketplace-search
git checkout -b feature/marketplace-products
git checkout -b update/marketplace-ui

# If working on the payoutsystem folder:
git checkout -b feature/payment-gateway
git checkout -b fix/payment-validation
git checkout -b update/payout-design

# If working on the main page (index files):
git checkout -b feature/homepage-hero
git checkout -b update/navbar-design
git checkout -b fix/mobile-responsive

# Verify you're on the new branch
git branch
# You should see a * next to your new branch
```

### Step 2: Make Your Changes

```bash
# Open VS Code and edit your files
# Examples based on YOUR project:

# If working on orders:
# - Edit: orders/orders.js, orders/orders.html, orders/orders.css

# If working on marketplace:
# - Edit: marketplace/market.js, marketplace/market.html, marketplace/market.css
# - Add images to: marketplace/marketplaceimages/

# If working on payout system:
# - Edit: payoutsystem/pay.js, payoutsystem/pay.html, payoutsystem/pay.css

# If working on main page:
# - Edit: index.html, index.css, script.js

# Check what files you changed
git status
# This shows modified files in red
```

### Step 3: Stage Your Changes

```bash
# Add all changed files
git add .

# OR add specific files based on YOUR project:

# If you only changed orders files:
git add orders/orders.js
git add orders/orders.html
git add orders/orders.css

# If you only changed marketplace files:
git add marketplace/market.js
git add marketplace/market.html
git add marketplace/marketplaceimages/new-image.jpg

# If you only changed payout files:
git add payoutsystem/pay.js
git add payoutsystem/pay.html

# If you changed main page:
git add index.html
git add index.css
git add script.js

# Check staged files
git status
# Staged files will now be green
```

### Step 4: Commit Your Changes

```bash
# Commit with a clear message
git commit -m "Add: order filtering functionality"

# Other examples:
# git commit -m "Fix: payment button not working"
# git commit -m "Update: marketplace UI improvements"
```

### Step 5: Push Your Branch to GitHub

```bash
# Push your branch to GitHub (first time)
git push origin feature/your-branch-name

# REAL EXAMPLES from your project:
git push origin feature/orders-filter
git push origin feature/marketplace-search
git push origin feature/payment-gateway
git push origin fix/orders-display-bug
git push origin update/marketplace-ui

# If you get an error, the terminal will show you the exact command to use
```

### Step 6: Create a Pull Request

1. Go to https://github.com/brytvillz/Team8water
2. You'll see a yellow banner saying "Compare & pull request" - click it
3. Fill in the PR details:
   - **Title**: Brief description (e.g., "Update orders page filtering")
   - **Description**: Explain what you changed and why
   - Example:

     ```
     ## Changes
     - Added filter functionality to orders page
     - Fixed bug with order sorting
     - Updated CSS for better mobile view

     ## Testing
     - Tested on Chrome and Safari
     - Checked mobile responsiveness
     ```
4. Click "Create pull request"
5. Tag team members for review (e.g., @brytvillz)

### Step 7: Wait for Review and Merge

- Team members review your code
- They may ask for changes - if so, make them and push again:
  ```bash
  # Make the requested changes
  git add .
  git commit -m "Fix: addressed review comments"
  git push origin feature/your-feature-name
  # The PR automatically updates!
  ```
- Once approved, the PR will be merged into main

### Step 8: After Merge - Clean Up

```bash
# Switch back to main branch
git checkout main

# Pull the latest changes (including your merged code)
git pull origin main

# Delete your local branch (optional, keeps things clean)
git branch -d feature/your-feature-name

# Start a new feature
git checkout -b feature/next-feature
```

## Daily Workflow Summary

**Every time you start working:**

```bash
git checkout main
git pull origin main
git checkout -b feature/new-feature-name
# ... make changes ...
git add .
git commit -m "Description"
git push origin feature/new-feature-name
# Then create Pull Request on GitHub
```

## Best Practices

### Branch Naming:

**Format:** `type/what-you-are-doing`

**Examples based on YOUR project:**

**Orders folder:**

- `feature/orders-filter` - Adding filter to orders
- `feature/orders-search` - Adding search functionality
- `fix/orders-sorting` - Fixing sorting bug
- `update/orders-ui` - Updating orders interface

**Marketplace folder:**

- `feature/marketplace-cart` - Adding shopping cart
- `feature/marketplace-categories` - Adding product categories
- `fix/marketplace-images` - Fixing image display
- `update/marketplace-layout` - Updating marketplace design

**Payout System folder:**

- `feature/payment-methods` - Adding new payment options
- `feature/payout-history` - Adding transaction history
- `fix/payment-validation` - Fixing payment validation
- `update/payout-ui` - Updating payment interface

**Main Page (index files):**

- `feature/homepage-slider` - Adding image slider
- `feature/navbar-menu` - Adding navigation menu
- `fix/mobile-responsive` - Fixing mobile view
- `update/homepage-design` - Updating homepage look

### Commit Messages:

- `Add: new feature description`
- `Fix: bug description`
- `Update: what was updated`
- `Remove: what was removed`

### Before Pushing:

1. Test your code locally
2. Make sure it doesn't break existing features
3. Pull latest changes: `git pull origin main`
4. Resolve any conflicts
5. Push your changes

## Common Commands

```bash
# Check status
git status

# See branches
git branch -a

# Switch branches
git checkout branch-name

# Pull latest from main
git pull origin main

# Push your branch
git push origin your-branch-name

# See commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

## Resolving Conflicts

If you get conflicts when pulling:

```bash
# See which files have conflicts
git status

# Open conflicting files and resolve manually
# Look for <<<<<<< HEAD markers

# After resolving, stage the files
git add .

# Complete the merge
git commit -m "Resolve merge conflicts"

# Push
git push origin your-branch-name
```

## Project Structure

```
8 WATER TEAM/
├── index.html, index.css, script.js (Main page)
├── marketplace/ (Marketplace feature)
├── orders/ (Orders feature)
└── payoutsystem/ (Payment feature)
```

## Communication

- Use Pull Request comments for code reviews
- Create GitHub Issues for bugs or feature requests
- Tag team members with @username in comments

## Need Help?

Contact: brytvillzz@gmail.com
