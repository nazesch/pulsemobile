# Deploy Pulse to Vercel - Step by Step Guide

## Prerequisites
- ✅ Git repository initialized
- ✅ Code ready to deploy
- ✅ Vercel account (free)

## Step 1: Prepare Your Code

### 1.1 Commit Your Changes
```bash
git add .
git commit -m "Prepare for Vercel deployment"
```

### 1.2 Push to GitHub/GitLab/Bitbucket
```bash
# If you haven't set up a remote yet:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

**Note:** If you don't have a GitHub account:
- Create one at https://github.com
- Create a new repository
- Follow the instructions to push your code

---

## Step 2: Deploy to Vercel

### Option A: Via Vercel Website (Recommended)

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign up/Login (use GitHub account for easiest setup)

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - Import from GitHub/GitLab/Bitbucket
   - Select your repository

3. **Configure Project**
   - **Framework Preset:** Vite (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

4. **Environment Variables** (if needed)
   - Add any environment variables here
   - For now, you don't need any

5. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes
   - Your app will be live!

### Option B: Via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Choose your settings
   - Deploy!

4. **Production Deploy**
   ```bash
   vercel --prod
   ```

---

## Step 3: Configure Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

---

## Step 4: Automatic Deployments

Vercel automatically deploys when you push to your main branch:
- Every push to `main` = Production deployment
- Pull requests = Preview deployments

---

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Make sure `npm run build` works locally
- Check for missing dependencies

### Routing Issues (404 on refresh)
- ✅ Already handled by `vercel.json` rewrites
- All routes redirect to `index.html` for React Router

### Environment Variables
- Add in Vercel dashboard → Settings → Environment Variables
- Restart deployment after adding

---

## Your App Will Be Live At:
- `https://your-project-name.vercel.app`
- Or your custom domain if configured

---

## Next Steps After Deployment

1. ✅ Test your live app
2. ✅ Share the URL with others
3. ✅ Set up custom domain (optional)
4. ✅ Configure automatic deployments

---

## Quick Commands Reference

```bash
# Build locally to test
npm run build

# Preview production build
npm run preview

# Deploy to Vercel (if using CLI)
vercel

# Deploy to production (if using CLI)
vercel --prod
```

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support

