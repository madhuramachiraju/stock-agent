#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Stock Agent OAuth Setup\n');

const envPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists!');
  console.log('Please add the following variables to your existing .env.local file:\n');
} else {
  console.log('📝 Creating .env.local file...\n');
}

const envContent = `# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-nextauth-key-change-this-in-production

# OAuth Providers (Replace with your real credentials)
# Get these from: https://console.cloud.google.com/ (Google)
# Get these from: https://developer.apple.com/ (Apple)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
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

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file created successfully!\n');
} else {
  console.log(envContent);
}

console.log('📋 Next Steps:');
console.log('1. Follow the setup guide in OAUTH_SETUP.md');
console.log('2. Replace the placeholder values in .env.local with your real credentials');
console.log('3. Restart your development server: npm run dev');
console.log('4. Test the OAuth sign-in buttons\n');

console.log('🔗 Quick Links:');
console.log('• Google Cloud Console: https://console.cloud.google.com/');
console.log('• Apple Developer: https://developer.apple.com/');
console.log('• Setup Guide: OAUTH_SETUP.md\n');

console.log('💡 Tip: The OAuth buttons will redirect to the actual Google/Apple sign-in portals once configured!'); 