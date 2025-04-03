# Naija Value Telegram Bot

A Telegram bot for the Naija Value platform that enables users to earn money through referrals.

## Features

- User referral tracking
- Earning rewards (1000 naira per referral)
- Withdrawal requests
- Milestone rewards
- Verification system

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- NPM or Yarn

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   PORT=5000 (optional, defaults to 5000)
   ```

4. Start the bot:
   ```
   npm start
   ```

### Deployment

#### Option 1: Railway
1. Create a Railway account
2. Create a new project and connect it to your GitHub repo
3. Add environment variables:
   - TELEGRAM_BOT_TOKEN

#### Option 2: Render
1. Create a Render account
2. Create a new Web Service
3. Connect your GitHub repo
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables

#### Option 3: Oracle Cloud Free Tier
1. Create an Oracle Cloud account and set up a free VM
2. Clone the repository to your VM
3. Install dependencies and set environment variables
4. Use PM2 to keep the bot running:
   ```
   npm install -g pm2
   pm2 start npm --name "naija-value-bot" -- start
   pm2 startup
   pm2 save
   ```

## Bot Commands

- `/start` - Start the bot and register
- `/balance` - Check your current balance
- `/stats` - View your referral statistics
- `/refer` - Get your referral link
- `/withdraw` - Request a withdrawal
- `/help` - Display help information
- `/bonus` - Claim a bonus of 100 naira
- `/payment_info` - View payment information
- `/payment_method` - Set payment method

## Contact

For support, join: https://t.me/naijavaluesupport