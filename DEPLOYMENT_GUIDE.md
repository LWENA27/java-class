# 🚀 Render.com Deployment Guide

This guide will help you deploy the Smart Menu SaaS application to Render.com for **FREE**.

## 📋 Prerequisites

1. **GitHub Account** (you mentioned having `gitstudent`)
2. **Render Account** - Sign up at https://render.com (use GitHub to sign up)
3. **MongoDB Atlas Account** - Sign up at https://www.mongodb.com/cloud/atlas (free tier available)

---

## Part 1: Setup MongoDB Atlas (Free Tier)

### Step 1: Create MongoDB Atlas Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or login (can use your Google/GitHub account)
3. Choose **FREE tier** (M0 Sandbox - 512MB storage)
4. Select a cloud provider and region (choose closest to your users)
5. Name your cluster (e.g., `smartmenu-cluster`)
6. Click **Create Cluster** (takes 3-5 minutes)

### Step 2: Configure Database Access

1. Go to **Database Access** (left sidebar)
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Create username and password (save these!)
   - Example: username=`smartmenu`, password=`YourSecurePassword123!`
5. Set user privileges to **Read and write to any database**
6. Click **Add User**

### Step 3: Configure Network Access

1. Go to **Network Access** (left sidebar)
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (or `0.0.0.0/0`)
   - This is safe because your database requires username/password
4. Click **Confirm**

### Step 4: Get Connection String

1. Click **Connect** on your cluster
2. Choose **Connect your application**
3. Select **Driver: Java** and **Version: 4.3 or later**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://smartmenu:<password>@smartmenu-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **IMPORTANT**: Replace `<password>` with your actual database password
6. **IMPORTANT**: Add your database name before the `?`:
   ```
   mongodb+srv://smartmenu:YourPassword@smartmenu-cluster.xxxxx.mongodb.net/smartmenu?retryWrites=true&w=majority
   ```

---

## Part 2: Push Code to GitHub

### Step 1: Initialize Git Repository

```bash
cd /var/www/html/smart-menu-saas
git init
git add .
git commit -m "Initial commit - Smart Menu SaaS ready for deployment"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com
2. Click **New Repository**
3. Name: `smart-menu-saas`
4. Choose **Public** (required for free Render deployment)
5. **DO NOT** initialize with README (we already have code)
6. Click **Create Repository**

### Step 3: Push to GitHub

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/smart-menu-saas.git
git branch -M main
git push -u origin main
```

---

## Part 3: Deploy Backend to Render

### Step 1: Create Backend Service

1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Click **Connect a repository**
4. Authorize Render to access your GitHub
5. Select `smart-menu-saas` repository
6. Configure service:

   **Basic Settings:**
   - **Name**: `smartmenu-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Java`
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/smartmenu-backend-1.0.0.jar`

   **Instance Type:**
   - Select **Free** ($0/month)

### Step 2: Add Environment Variables

Scroll down to **Environment Variables** and add these:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string from Part 1 |
| `JWT_SECRET` | Click "Generate" to create a random secret |
| `FRONTEND_URL` | Leave blank for now (we'll add this after frontend is deployed) |
| `PORT` | `8080` (optional, Render sets this automatically) |

### Step 3: Deploy Backend

1. Click **Create Web Service**
2. Wait for deployment (5-10 minutes for first build)
3. Once deployed, you'll see your backend URL:
   ```
   https://smartmenu-backend.onrender.com
   ```
4. **SAVE THIS URL** - you'll need it for frontend!

### Step 4: Test Backend

Open your backend URL in browser:
```
https://smartmenu-backend.onrender.com/api/health
```

You should see a health check response!

---

## Part 4: Deploy Frontend to Render

### Step 1: Create Frontend Service

1. In Render Dashboard, click **New +** → **Static Site**
2. Select `smart-menu-saas` repository
3. Configure service:

   **Basic Settings:**
   - **Name**: `smartmenu-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend-react`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### Step 2: Add Environment Variable

In **Environment Variables**, add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://smartmenu-backend.onrender.com/api` |

(Replace with your actual backend URL from Part 3)

### Step 3: Deploy Frontend

1. Click **Create Static Site**
2. Wait for deployment (3-5 minutes)
3. Once deployed, you'll see your frontend URL:
   ```
   https://smartmenu-frontend.onrender.com
   ```

---

## Part 5: Connect Backend and Frontend

### Update Backend FRONTEND_URL

1. Go to your backend service in Render Dashboard
2. Click **Environment** (left sidebar)
3. Find `FRONTEND_URL` variable
4. Set value to: `https://smartmenu-frontend.onrender.com`
5. Click **Save Changes**
6. Backend will automatically redeploy (2-3 minutes)

---

## Part 6: Test Your Deployed Application

### 1. Test Frontend Access
Open: `https://smartmenu-frontend.onrender.com`

### 2. Test Login/Register
- Register a new admin account
- Login with credentials

### 3. Create a Table/Room
- Go to QR Codes page
- Create a table (e.g., "Table 1")
- Download the QR code

### 4. Test QR Code
- Scan the QR code with your phone
- It should open: `https://smartmenu-frontend.onrender.com/customer-menu?table=XXXXX`
- You should see the customer menu

### 5. Test Full Flow
1. Add menu items (Menu Management page)
2. Mark items as available (Daily Menu page)
3. Scan QR code on phone
4. Place an order from customer menu
5. Check order appears in Orders page
6. Update order status
7. Customer sees status update in Order Tracking

---

## 🎉 Success! Your App is Live!

**Your URLs:**
- **Frontend**: `https://smartmenu-frontend.onrender.com`
- **Backend**: `https://smartmenu-backend.onrender.com`
- **Database**: MongoDB Atlas (Free 512MB)

---

## ⚠️ Important Notes

### Free Tier Limitations

1. **Backend sleeps after 15 minutes of inactivity**
   - First request after sleep takes 50-60 seconds to wake up
   - Subsequent requests are fast
   - This is normal for free tier!

2. **750 hours/month limit**
   - More than enough for testing
   - Resets each month

3. **Database limit: 512MB**
   - Enough for thousands of menu items and orders

### Production Recommendations

When ready for real customers, upgrade to:
- **Render**: $7/month (no sleep, custom domain)
- **MongoDB Atlas**: $9/month (more storage, backups)

---

## 🔧 Troubleshooting

### Backend won't start?
- Check `MONGODB_URI` is correct (including password and database name)
- Check build logs in Render Dashboard

### Frontend can't connect to backend?
- Check `VITE_API_URL` matches your backend URL exactly
- Check CORS settings in backend allow your frontend URL
- Check backend logs for errors

### QR codes don't work?
- Check `FRONTEND_URL` is set in backend environment variables
- Check it matches your actual frontend URL
- Regenerate QR codes after updating FRONTEND_URL

### Orders not appearing?
- Check MongoDB connection
- Check browser console for API errors
- Check backend logs in Render Dashboard

---

## 📱 Share Your App

**For Customers:**
Print QR codes and place them on tables. Customers scan and order!

**For Testing:**
Share your frontend URL with friends:
```
https://smartmenu-frontend.onrender.com/customer-menu?table=YOUR_TABLE_ID
```

---

## 🔄 Updating Your App

After making code changes:

```bash
git add .
git commit -m "Description of changes"
git push origin main
```

Render automatically detects the push and redeploys! 🚀

---

## 📞 Support

- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://www.mongodb.com/docs/atlas/
- **Issues**: Check browser console and Render logs

---

## Next Steps After Deployment

1. ✅ Test all features thoroughly
2. ✅ Add real menu items with images
3. ✅ Create QR codes for all tables
4. ✅ Test ordering flow on mobile devices
5. ✅ Share with test users for feedback
6. 📈 Monitor usage in Render Dashboard
7. 💰 Consider upgrading when traffic increases

**Good luck with your Smart Menu SaaS! 🍽️🇹🇿**
