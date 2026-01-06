# Fix GitHub Authentication Error

## Problem
GitHub no longer accepts passwords for HTTPS authentication. You need to use a **Personal Access Token (PAT)** or **SSH keys**.

## Solution 1: Use Personal Access Token (Easiest)

### Step 1: Create a Personal Access Token on GitHub

1. Go to GitHub.com and sign in
2. Click your profile picture (top right) → **Settings**
3. Scroll down to **Developer settings** (left sidebar)
4. Click **Personal access tokens** → **Tokens (classic)**
5. Click **Generate new token** → **Generate new token (classic)**
6. Give it a name: "Pulse Mobile"
7. Select scopes:
   - ✅ **repo** (full control of private repositories)
8. Click **Generate token**
9. **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)

### Step 2: Use the Token When Pushing

When you run `git push`, use the token as your password:

```bash
git push -u origin main
```

When prompted:
- **Username:** `nazesch` (your GitHub username)
- **Password:** Paste your Personal Access Token (not your GitHub password)

---

## Solution 2: Switch to SSH (More Secure, One-Time Setup)

### Step 1: Check if you have SSH keys

```bash
ls -al ~/.ssh
```

Look for files named `id_rsa.pub` or `id_ed25519.pub`

### Step 2: Generate SSH key (if you don't have one)

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Press Enter to accept default location, then set a passphrase (optional).

### Step 3: Add SSH key to GitHub

1. Copy your public key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
   (Or `cat ~/.ssh/id_rsa.pub` if you used RSA)

2. Copy the entire output

3. Go to GitHub.com → Settings → **SSH and GPG keys** → **New SSH key**
4. Paste your key and save

### Step 4: Change remote URL to SSH

```bash
git remote set-url origin git@github.com:nazesch/pulsemobile.git
```

### Step 5: Test and push

```bash
ssh -T git@github.com
git push -u origin main
```

---

## Solution 3: Use GitHub CLI (Alternative)

```bash
# Install GitHub CLI (if not installed)
brew install gh

# Authenticate
gh auth login

# Then push normally
git push -u origin main
```

---

## Quick Fix: Update Remote URL

If you want to switch from HTTPS to SSH:

```bash
git remote set-url origin git@github.com:nazesch/pulsemobile.git
```

Or if you want to use HTTPS with token:

```bash
git remote set-url origin https://github.com/nazesch/pulsemobile.git
```

Then use the Personal Access Token as password when pushing.

---

## Recommended: Use Personal Access Token (Fastest)

1. Create token on GitHub (see Solution 1, Step 1)
2. When pushing, use token as password
3. Done!

