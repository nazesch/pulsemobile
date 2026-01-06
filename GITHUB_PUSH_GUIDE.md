# Push Pulse Mobile to GitHub - Step by Step

## Step 1: Get Your GitHub Repository URL

You need the URL of your new GitHub repository. It will look like:
- **HTTPS:** `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git`
- **SSH:** `git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git`

## Step 2: Initialize Git (if needed)

If this directory doesn't have its own git repo:

```bash
cd "/Users/laosanchez/Documents/Cursor/Pulse Mobile"
git init
```

## Step 3: Add All Files

```bash
git add .
```

## Step 4: Make Your First Commit

```bash
git commit -m "Initial commit: Pulse Mobile app"
```

## Step 5: Add Your New GitHub Repository as Remote

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual values:

**For HTTPS:**
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

**For SSH (if you have SSH keys set up):**
```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
```

**If you already have an origin remote, remove it first:**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

## Step 6: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

## Complete Command Sequence

Here's everything in one go (replace the URL):

```bash
cd "/Users/laosanchez/Documents/Cursor/Pulse Mobile"
git init
git add .
git commit -m "Initial commit: Pulse Mobile app"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Troubleshooting

### "Remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### "Authentication failed"
- Use HTTPS and enter your GitHub username/password
- Or set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### "Repository not found"
- Make sure the repository name is correct
- Make sure the repository exists on GitHub
- Check you have access to the repository

