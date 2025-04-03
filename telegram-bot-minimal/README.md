# NAIJA VALUE Telegram Bot

A Telegram-based reward platform that enables users to earn money through referrals.

## Deployment Instructions

### Option 1: Deploy on Render

1. Sign up for Render and create a new Web Service
2. Connect to your GitHub repository
3. Set environment variables: TELEGRAM_BOT_TOKEN=your_token
4. Use Node.js environment with build command 'npm install'
5. Set start command to 'npm start'
6. Deploy and verify your bot is working

### Option 2: Deploy on Railway

1. Sign up for Railway and connect to GitHub
2. Create a new project from your repository
3. Set environment variable: TELEGRAM_BOT_TOKEN=your_token
4. Verify the start command is 'npm start'
5. Deploy and check your bot is running

For more detailed instructions, refer to the documentation below:

## Detailed Deployment Guide

### Render.com Deployment

1. **Create a GitHub repository**
   - Push your code to GitHub
   - Make sure Procfile is included

2. **Sign up for Render**
   - Go to render.com and create an account
   - Connect with GitHub

3. **Create a new Web Service**
   - Select your repository
   - Choose Node.js environment
   - Region: Select closest to your users
   - Branch: main
   - Build Command: npm install
   - Start Command: npm start
   - Plan: Free

4. **Set environment variables**
   - Add TELEGRAM_BOT_TOKEN with your actual token
   - Add NODE_ENV=production

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

6. **Keep service active**
   - Use UptimeRobot to ping your service URL every 10-15 minutes
   - This prevents the free tier from spinning down

### Railway.app Deployment

1. **Create a GitHub repository**
   - Push your code to GitHub

2. **Sign up for Railway**
   - Go to railway.app
   - Sign up with GitHub

3. **Create a new project**
   - Click "New Project" 
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Click "Deploy Now"

4. **Configure environment**
   - Go to Variables tab
   - Add TELEGRAM_BOT_TOKEN with your actual token

5. **Verify settings**
   - Check Settings tab
   - Start Command should be "npm start"
   - Root Directory should be "/"

6. **Monitor usage**
   - Railway gives $5 free credit per month
   - Check Usage tab to monitor

## Troubleshooting

- **Bot not responding:** Check logs and verify token is correct
- **Deployment fails:** Check build logs for errors
- **Service stops:** For Render, set up pinging; for Railway, check usage limits