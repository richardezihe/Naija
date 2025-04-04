# NAIJA VALUE Telegram Bot

Navigation Menu

Code
Issues
Pull requests
Naija/telegram-bot-minimal
/README.md
author
Richard Ezihe
19 hours ago
91 lines (67 loc) · 2.42 KB

Preview

Code

Blame
NAIJA VALUE Telegram Bot
A Telegram-based reward platform that enables users to earn money through referrals.

Deployment Instructions
Option 1: Deploy on Render
Sign up for Render and create a new Web Service
Connect to your GitHub repository
Set environment variables: TELEGRAM_BOT_TOKEN=your_token
Use Node.js environment with build command 'npm install'
Set start command to 'npm start'
Deploy and verify your bot is working
Option 2: Deploy on Railway
Sign up for Railway and connect to GitHub
Create a new project from your repository
Set environment variable: TELEGRAM_BOT_TOKEN=your_token
Verify the start command is 'npm start'
Deploy and check your bot is running
For more detailed instructions, refer to the documentation below:

Detailed Deployment Guide
Render.com Deployment
Create a GitHub repository

Push your code to GitHub
Make sure Procfile is included
Sign up for Render

Go to render.com and create an account
Connect with GitHub
Create a new Web Service

Select your repository
Choose Node.js environment
Region: Select closest to your users
Branch: main
Build Command: npm install
Start Command: npm start
Plan: Free
Set environment variables

Add TELEGRAM_BOT_TOKEN with your actual token
Add NODE_ENV=production
Deploy

Click "Create Web Service"
Wait for deployment to complete
Keep service active

Use UptimeRobot to ping your service URL every 10-15 minutes
This prevents the free tier from spinning down
Railway.app Deployment
Create a GitHub repository

Push your code to GitHub
Sign up for Railway

Go to railway.app
Sign up with GitHub
Create a new project

Click "New Project"
Select "Deploy from GitHub repo"
Choose your repository
Click "Deploy Now"
Configure environment

Go to Variables tab
Add TELEGRAM_BOT_TOKEN with your actual token
Verify settings

Check Settings tab
Start Command should be "npm start"
Root Directory should be "/"
Monitor usage

Railway gives $5 free credit per month
Check Usage tab to monitor
Troubleshooting
Bot not responding: Check logs and verify token is correct
Deployment fails: Check build logs for errors
Service stops: For Render, set up pinging; for Railway, check usage limits
