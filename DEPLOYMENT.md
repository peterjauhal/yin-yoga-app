# Deployment Guide

## Automated Deployment to GitHub Pages

This app automatically deploys to GitHub Pages every day when new routines are generated.

### Setup Instructions

1. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/daily-yin-yoga.git
   git branch -M main
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Under "Source", select "GitHub Actions"
   - Save the settings

3. **Manual Trigger** (optional):
   - Go to Actions tab in your repository
   - Click "Generate Daily Yin Yoga Routine" 
   - Click "Run workflow" to test deployment

### How It Works

**Daily Automation**:
- Runs at 6:00 AM UTC every day
- Generates new yoga routine
- Automatically deploys to GitHub Pages
- Commits changes to repository

**URL Access**:
- Your app will be available at: `https://YOUR_USERNAME.github.io/daily-yin-yoga/`
- Updates automatically with each new routine

**Permissions**:
- The workflow has permissions to read content and deploy to Pages
- Uses GitHub's built-in deployment actions for security

### Features
- ✅ Zero-configuration deployment
- ✅ Automatic daily updates
- ✅ HTTPS by default
- ✅ Global CDN distribution
- ✅ Custom domain support (optional)

### Troubleshooting

**If deployment fails**:
1. Check repository Settings > Pages is set to "GitHub Actions"
2. Ensure the workflow file is in `.github/workflows/`
3. Verify repository is public (or you have GitHub Pro for private Pages)

**To add custom domain**:
1. Add CNAME file with your domain
2. Configure DNS settings
3. Enable HTTPS in Pages settings

### Manual Deployment

For one-time deployment without automation:
```bash
npm run generate
# Commit and push changes
# GitHub Pages will deploy automatically
```