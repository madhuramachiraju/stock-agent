#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Quick Google OAuth Setup for Stock Agent\n');

console.log('📋 Step-by-step guide to get your Google OAuth credentials:\n');

console.log('1️⃣  Go to Google Cloud Console:');
console.log('   https://console.cloud.google.com/\n');

console.log('2️⃣  Create a new project or select existing one');
console.log('   - Click on the project dropdown at the top');
console.log('   - Click "New Project" or select existing\n');

console.log('3️⃣  Enable Google+ API:');
console.log('   - Go to "APIs & Services" → "Library"');
console.log('   - Search for "Google+ API"');
console.log('   - Click on it and press "Enable"\n');

console.log('4️⃣  Create OAuth 2.0 credentials:');
console.log('   - Go to "APIs & Services" → "Credentials"');
console.log('   - Click "Create Credentials" → "OAuth 2.0 Client IDs"');
console.log('   - Choose "Web application"');
console.log('   - Name: "Stock Agent"');
console.log('   - Authorized redirect URIs:');
console.log('     http://localhost:3000/api/auth/callback/google');
console.log('   - Click "Create"\n');

console.log('5️⃣  Copy your credentials:');
console.log('   - You\'ll get a Client ID and Client Secret');
console.log('   - Copy both values\n');

console.log('6️⃣  Enter your credentials below:\n');

rl.question('Enter your Google Client ID: ', (clientId) => {
  rl.question('Enter your Google Client Secret: ', (clientSecret) => {
    rl.question('Enter a random secret for NextAuth (or press Enter for auto-generate): ', (nextAuthSecret) => {
      
      // Generate a random secret if none provided
      const secret = nextAuthSecret || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const envPath = path.join(process.cwd(), '.env.local');
      
      const envContent = `# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=${secret}

# OAuth Providers
GOOGLE_CLIENT_ID=${clientId}
GOOGLE_CLIENT_SECRET=${clientSecret}
APPLE_CLIENT_ID=com.yourcompany.stockagent.web
APPLE_CLIENT_SECRET=your-generated-jwt-token-here

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/stock-agent

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Gmail Configuration for Email Notifications
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-specific-password

# Stock API Configuration
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-api-key
`;

      fs.writeFileSync(envPath, envContent);
      
      console.log('\n✅ .env.local file updated successfully!');
      console.log('\n🔄 Restarting your development server...\n');
      
      rl.close();
      
      // Restart the server
      const { spawn } = require('child_process');
      
      // Kill existing process
      spawn('pkill', ['-f', 'next dev'], { stdio: 'ignore' });
      
      setTimeout(() => {
        console.log('🚀 Starting server with new credentials...');
        const server = spawn('npm', ['run', 'dev'], { 
          stdio: 'inherit',
          shell: true 
        });
        
        server.on('error', (err) => {
          console.error('❌ Failed to start server:', err);
        });
        
        setTimeout(() => {
          console.log('\n🎉 Setup complete!');
          console.log('📱 Open http://localhost:3000');
          console.log('🔐 Click "Sign In" and try "Continue with Google"');
          console.log('✅ You should now be able to sign in with your Google account!\n');
        }, 3000);
        
      }, 1000);
      
    });
  });
}); 