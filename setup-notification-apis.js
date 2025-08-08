#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('📧 Stock Agent - Notification API Setup\n');
console.log('This script will help you configure the required APIs for daily portfolio news emails.\n');

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupNotificationAPIs() {
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = '';
  
  // Read existing .env.local if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  console.log('🔑 Step 1: Email Configuration (Gmail)\n');
  
  const gmailUser = await question('Enter your Gmail address: ');
  const useGmail = await question('Do you want to set up Gmail for sending emails? (y/n): ');
  
  if (useGmail.toLowerCase() === 'y') {
    console.log('\n📧 Gmail Setup Instructions:');
    console.log('1. Enable 2-Factor Authentication on your Gmail account');
    console.log('2. Go to Google Account settings → Security → 2-Step Verification → App passwords');
    console.log('3. Generate a new app password for "Mail"');
    console.log('4. Copy the 16-character password below\n');
    
    const gmailPassword = await question('Enter your Gmail App Password (16 characters): ');
    
    // Update or add Gmail configuration
    envContent = updateEnvVariable(envContent, 'GMAIL_USER', gmailUser);
    envContent = updateEnvVariable(envContent, 'GMAIL_APP_PASSWORD', gmailPassword);
  }

  console.log('\n📰 Step 2: News API Configuration\n');
  console.log('Choose a news API (you can use multiple):');
  console.log('1. Alpha Vantage (Recommended) - 500 requests/day free');
  console.log('2. NewsAPI.org - 100 requests/day free');
  console.log('3. Finnhub - 60 calls/minute free');
  console.log('4. Skip for now\n');

  const alphaVantageKey = await question('Alpha Vantage API Key (or press Enter to skip): ');
  if (alphaVantageKey.trim()) {
    envContent = updateEnvVariable(envContent, 'ALPHA_VANTAGE_API_KEY', alphaVantageKey);
  }

  const newsApiKey = await question('NewsAPI.org API Key (or press Enter to skip): ');
  if (newsApiKey.trim()) {
    envContent = updateEnvVariable(envContent, 'NEWS_API_KEY', newsApiKey);
  }

  const finnhubKey = await question('Finnhub API Key (or press Enter to skip): ');
  if (finnhubKey.trim()) {
    envContent = updateEnvVariable(envContent, 'FINNHUB_API_KEY', finnhubKey);
  }

  console.log('\n🔒 Step 3: Security Configuration\n');
  
  // Generate secure random strings for cron jobs
  const cronSecret = crypto.randomBytes(32).toString('hex');
  const internalApiSecret = crypto.randomBytes(32).toString('hex');
  
  envContent = updateEnvVariable(envContent, 'CRON_SECRET', cronSecret);
  envContent = updateEnvVariable(envContent, 'INTERNAL_API_SECRET', internalApiSecret);

  console.log('✅ Generated secure keys for cron job authentication');

  // Write to .env.local
  fs.writeFileSync(envPath, envContent);
  
  console.log('\n🎉 Configuration Complete!\n');
  console.log('Your .env.local file has been updated with the following:');
  console.log('✅ Email configuration');
  console.log('✅ News API keys');
  console.log('✅ Security keys');
  
  console.log('\n📋 Next Steps:');
  console.log('1. Test your configuration by visiting /notifications');
  console.log('2. Enable daily news emails in your notification settings');
  console.log('3. Send a test email to verify everything works');
  
  console.log('\n🔗 API Setup Links:');
  console.log('• Alpha Vantage: https://www.alphavantage.co/support/#api-key');
  console.log('• NewsAPI.org: https://newsapi.org/register');
  console.log('• Finnhub: https://finnhub.io/register');
  
  console.log('\n📚 For more information, see API_SETUP_GUIDE.md');
  
  rl.close();
}

function updateEnvVariable(content, key, value) {
  const lines = content.split('\n');
  let found = false;
  
  // Update existing variable
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith(`${key}=`)) {
      lines[i] = `${key}=${value}`;
      found = true;
      break;
    }
  }
  
  // Add new variable if not found
  if (!found) {
    lines.push(`${key}=${value}`);
  }
  
  return lines.join('\n');
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
});

// Run the setup
setupNotificationAPIs().catch((error) => {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}); 