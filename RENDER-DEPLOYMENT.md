# Deploying Cora AI Chatbot to Render.com

## Prerequisites
- GitHub account with your code pushed
- Render.com account (free)
- OpenAI API key

## Step-by-Step Deployment

### Step 1: Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Cora AI chatbot backend"
git branch -M main
git remote add origin https://github.com/your-username/cora-chatbot.git
git push -u origin main
```

### Step 2: Create Render Account & Connect GitHub

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your GitHub repositories

### Step 3: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Select your `cora-chatbot` repository
3. Fill in details:

| Field | Value |
|-------|-------|
| **Name** | `cora-chatbot` |
| **Environment** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | Free (or Starter if you need more) |

### Step 4: Add Environment Variables

1. Scroll to **"Environment"** section
2. Click **"Add Environment Variable"**
3. Add your configuration:

```
OPENAI_API_KEY = sk-proj-your-actual-key-here
PORT = 5000
NODE_ENV = production
ALLOWED_ORIGINS = https://your-domain.com,https://www.your-domain.com
```

**Important:** Set `NODE_ENV=production` for Render

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will automatically deploy your backend
3. Wait for build to complete (2-5 minutes)
4. You'll get a URL like: `https://cora-chatbot.onrender.com`

## Step 6: Update Frontend

Update your `chatbot.js` to use the Render URL:

```javascript
this.apiUrl = 'https://cora-chatbot.onrender.com/api/chat';
```

Or set it as an environment variable in your HTML:

```html
<script>
  window.CHATBOT_API = 'https://cora-chatbot.onrender.com/api/chat';
</script>
<script src="js/chatbot.js"></script>
```

Then update `chatbot.js`:

```javascript
this.apiUrl = window.CHATBOT_API || 'http://localhost:5000/api/chat';
```

## Verification

Test your deployed backend:

```bash
curl https://cora-chatbot.onrender.com/health
```

Should return:
```json
{"status":"OK","message":"Cora Chatbot Backend is running"}
```

## Free Tier Limits (Important!)

- **Uptime:** ~99.9% during paid hours, may spin down during inactive periods
- **Bandwidth:** 100 GB/month
- **Storage:** 300 MB
- **CPU/RAM:** Shared

### Cold Start Solution
Render's free tier services spin down after 15 minutes of inactivity. To prevent this:

1. Upgrade to **Starter Plan** ($7/month) - Always on
2. Or keep free tier and accept 30-second cold starts

### Monitor Activity
Check dashboard at [render.com/dashboard](https://render.com/dashboard)

## Auto-Deploy on Git Push

Render automatically redeploys when you push to main:

```bash
git add .
git commit -m "Update chatbot responses"
git push origin main
```

Your backend will redeploy automatically!

## Troubleshooting

### Service Not Starting
1. Check **"Logs"** tab in Render dashboard
2. Look for errors with your API key
3. Verify all environment variables are set

### "Cannot connect" from frontend
1. Verify the Render URL in `chatbot.js`
2. Check CORS settings in `.env`
3. Add your frontend domain to `ALLOWED_ORIGINS`

### Build Fails
1. Ensure `package.json` exists in backend folder
2. Check Node.js version compatibility
3. Look at build logs for specific errors

## Monitoring

### View Logs
1. Go to Render dashboard
2. Select your service
3. Click **"Logs"** tab
4. View real-time logs

### Set Up Alerts
1. Click **"Notifications"** 
2. Add email for deployment failures
3. Get alerted if service goes down

## Scaling

If you need more power:

1. **Starter Plan:** $7/month - Always on, better performance
2. **Standard Plan:** $12/month - More resources
3. **Pro Plan:** Custom pricing

Switch anytime from dashboard → **Settings** → **Plan**

## Cost Estimate

- **Free Tier:** $0/month (with cold starts)
- **Starter Plan:** $7/month (recommended for production)
- **OpenAI API:** $0.01-0.05 per conversation (~$2-50/month)

**Total:** ~$9-57/month depending on usage

## Rollback Previous Deploy

1. Go to **"Deploys"** tab
2. Find the previous successful deploy
3. Click **"Rollback"**

## Custom Domain (Optional)

1. Go to service settings
2. Add custom domain
3. Update DNS records
4. Render provides free SSL certificate

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Update frontend API URL
3. ✅ Test chatbot on production
4. ✅ Monitor logs and usage
5. ✅ Set up alerts

## Support

- **Render Docs:** [render.com/docs](https://render.com/docs)
- **Render Support:** support@render.com
- **OpenAI Docs:** [platform.openai.com/docs](https://platform.openai.com/docs)

---

**Your Render deployment link:** `https://cora-chatbot.onrender.com` (after deployment)

**Track your API usage:** [https://platform.openai.com/account/usage](https://platform.openai.com/account/usage)
