# Deployment Guide for Digital Job Connection

## Vercel Deployment

### Important: Removing Authentication Requirements

If your Vercel deployment is asking for authentication (password protection), you need to disable **Deployment Protection** in your Vercel project settings.

### Steps to Disable Authentication on Vercel:

1. **Go to your Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your Digital Job Connection project

2. **Navigate to Settings**
   - Click on the "Settings" tab in your project

3. **Disable Deployment Protection**
   - Scroll down to "Deployment Protection" section
   - If "Password Protection" is enabled, click "Edit" or "Disable"
   - Ensure the deployment is set to **Public** (not protected)

4. **Save Changes**
   - Save the settings
   - Redeploy your application if needed

### Alternative: Using Vercel CLI

You can also configure this using the Vercel CLI:

```bash
# Remove password protection
vercel env rm PASSWORD_PROTECTION
```

### Vercel Configuration (vercel.json)

This project includes a `vercel.json` file with the following configuration to ensure public access:

```json
{
  "public": true,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Robots-Tag",
          "value": "all"
        }
      ]
    }
  ]
}
```

### Common Issues

#### Issue: "This deployment is protected"
**Solution**: This means Deployment Protection is enabled in your Vercel project settings. Follow the steps above to disable it.

#### Issue: "Password required"
**Solution**: Password Protection is enabled. Go to your Vercel project settings → Deployment Protection → Disable Password Protection.

#### Issue: "Vercel Authentication Required"
**Solution**: This typically happens when:
- Your Vercel project is part of a team with restricted access
- Preview deployments are protected (check "Preview Deployment Protection")
- Production deployments are protected

**Fix**: 
1. Go to Project Settings → Deployment Protection
2. Under "Production Deployment Protection", select "Disabled"
3. Under "Preview Deployment Protection", select "Disabled" or "Only Preview Deployments from Git branches on your repository"

### Environment Variables

Make sure to set the following environment variables in your Vercel project:

1. **MONGODB_URI**: Your MongoDB connection string
   - Go to Project Settings → Environment Variables
   - Add `MONGODB_URI` with your connection string
   - Set it for Production, Preview, and Development

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Vercel Auto-Deploy**
   - Vercel will automatically deploy when you push to your main branch
   - Or manually trigger a deployment from the Vercel dashboard

3. **Verify Deployment**
   - Visit your deployment URL (e.g., `your-project.vercel.app`)
   - It should be accessible without authentication

### Security Notes

- **Public Access**: This application is configured for public access, suitable for a job board
- **API Protection**: API endpoints handle their own authentication via login/register
- **Database Security**: Ensure your MongoDB connection uses strong credentials
- **Environment Secrets**: Never commit `.env` files or secrets to the repository

### Monitoring

After deployment, monitor your application:
- Check Vercel deployment logs for errors
- Verify API endpoints are working: `https://your-app.vercel.app/api/health`
- Test registration and login functionality

### Troubleshooting

If you still see authentication after following the steps:

1. Clear your browser cache and cookies
2. Try accessing the site in incognito/private mode
3. Check Vercel deployment logs for any errors
4. Verify environment variables are set correctly
5. Ensure the latest `vercel.json` is deployed

### Support

For additional help:
- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
