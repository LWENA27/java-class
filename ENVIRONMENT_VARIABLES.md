# Environment Variables Reference

This file documents all environment variables needed for deployment.

## Backend Environment Variables

Set these in Render Dashboard → Backend Service → Environment:

| Variable | Required | Default | Description | Example |
|----------|----------|---------|-------------|---------|
| `PORT` | No | `8080` | Port for backend server (Render sets automatically) | `8080` |
| `MONGODB_URI` | **YES** | `mongodb://localhost:27017/smartmenu` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/smartmenu?retryWrites=true&w=majority` |
| `JWT_SECRET` | **YES** | (development secret) | Secret key for JWT token signing | Use Render's "Generate" button for random value |
| `FRONTEND_URL` | **YES** | `http://localhost:5173` | Frontend URL for CORS and QR codes | `https://smartmenu-frontend.onrender.com` |

## Frontend Environment Variables

Set these in Render Dashboard → Frontend Service → Environment:

| Variable | Required | Default | Description | Example |
|----------|----------|---------|-------------|---------|
| `VITE_API_URL` | **YES** | `http://localhost:8080/api` | Backend API URL | `https://smartmenu-backend.onrender.com/api` |

## Where to Get Values

### MONGODB_URI
1. Create free cluster on MongoDB Atlas: https://www.mongodb.com/cloud/atlas
2. Go to Clusters → Connect → Connect your application
3. Copy connection string
4. Replace `<password>` with your database password
5. Add database name before the `?`: `/smartmenu?retryWrites=true&w=majority`

**Format:**
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

**Example:**
```
mongodb+srv://smartmenu:MyP@ssw0rd@cluster0.ab1cd.mongodb.net/smartmenu?retryWrites=true&w=majority
```

### JWT_SECRET
- Click **Generate** in Render Dashboard to create a secure random string
- Or generate your own: `openssl rand -base64 32`
- Must be at least 32 characters long

### FRONTEND_URL
- Deploy frontend first to get URL
- Format: `https://your-app-name.onrender.com` (no trailing slash)
- Must match exactly (including https://)

### VITE_API_URL
- Deploy backend first to get URL
- Format: `https://your-backend.onrender.com/api`
- Note: includes `/api` at the end

## Deployment Order

1. **First**: Set up MongoDB Atlas → Get `MONGODB_URI`
2. **Second**: Deploy Backend with `MONGODB_URI` and `JWT_SECRET`
3. **Third**: Get Backend URL → Set as `VITE_API_URL` in Frontend
4. **Fourth**: Deploy Frontend
5. **Fifth**: Get Frontend URL → Set as `FRONTEND_URL` in Backend
6. **Done**: Test QR codes (they now have correct URLs!)

## Local Development

For local development, create a `.env` file in frontend:

```env
# frontend-react/.env
VITE_API_URL=http://localhost:8080/api
```

Backend uses `application.properties` with defaults:
- PORT: 8080
- MONGODB_URI: mongodb://localhost:27017/smartmenu
- JWT_SECRET: development secret (from properties file)
- FRONTEND_URL: http://localhost:5173

## Troubleshooting

### Backend Can't Connect to Database
- ❌ Wrong: `mongodb+srv://user:<password>@cluster.mongodb.net/`
- ✅ Right: `mongodb+srv://user:ActualPassword123@cluster.mongodb.net/smartmenu?retryWrites=true&w=majority`
- Check: Password has no special characters, or URL-encode them
- Check: Database name is included before `?`

### CORS Errors in Browser
- Check `FRONTEND_URL` in backend matches your actual frontend URL exactly
- Check no trailing slash: ❌ `https://app.com/` → ✅ `https://app.com`
- Redeploy backend after changing `FRONTEND_URL`

### QR Codes Show localhost
- Set `FRONTEND_URL` in backend environment variables
- Redeploy backend
- Generate new QR codes (old ones will still have localhost)

### Frontend Shows "Network Error"
- Check `VITE_API_URL` is set correctly
- Check backend is running (visit backend URL in browser)
- Check backend logs for errors
- Wait 60 seconds if backend is waking up from sleep

## Security Notes

🔒 **Never commit secrets to Git!**
- Add `.env` to `.gitignore`
- Use Render Dashboard to set environment variables
- Rotate JWT_SECRET if compromised
- Use strong MongoDB password

🔒 **Production Checklist:**
- ✅ JWT_SECRET is random and long (32+ chars)
- ✅ MongoDB password is strong
- ✅ MongoDB network access configured
- ✅ FRONTEND_URL matches actual production URL
- ✅ No hardcoded localhost URLs in code
