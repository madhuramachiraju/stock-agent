#!/usr/bin/env node

/**
 * Stock Agent - Deployment Preparation Script
 * 
 * This script helps you prepare your application for deployment by:
 * 1. Checking if all required files exist
 * 2. Validating environment variables
 * 3. Testing the build process
 * 4. Providing deployment recommendations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Stock Agent - Deployment Preparation\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  try {
    if (fs.existsSync(filePath)) {
      log(`✅ ${description}`, 'green');
      return true;
    } else {
      log(`❌ ${description} - MISSING`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ ${description} - ERROR: ${error.message}`, 'red');
    return false;
  }
}

function checkEnvironmentVariables() {
  log('\n🔧 Checking Environment Variables...', 'blue');
  
  const requiredVars = [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
  ];
  
  const optionalVars = [
    'MONGODB_URI',
    'GMAIL_USER',
    'GMAIL_PASS',
    'ALPHA_VANTAGE_API_KEY'
  ];
  
  let allRequiredPresent = true;
  
  // Check if .env.local exists
  if (!checkFile('.env.local', '.env.local file')) {
    log('⚠️  Create .env.local file with your environment variables', 'yellow');
    return false;
  }
  
  // Read .env.local
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    
    requiredVars.forEach(varName => {
      if (envContent.includes(`${varName}=`)) {
        log(`✅ ${varName}`, 'green');
      } else {
        log(`❌ ${varName} - REQUIRED`, 'red');
        allRequiredPresent = false;
      }
    });
    
    optionalVars.forEach(varName => {
      if (envContent.includes(`${varName}=`)) {
        log(`✅ ${varName} (optional)`, 'green');
      } else {
        log(`⚠️  ${varName} (optional) - Not configured`, 'yellow');
      }
    });
    
  } catch (error) {
    log(`❌ Error reading .env.local: ${error.message}`, 'red');
    return false;
  }
  
  return allRequiredPresent;
}

function checkBuildProcess() {
  log('\n🔨 Testing Build Process...', 'blue');
  
  try {
    log('Running npm run build...', 'yellow');
    execSync('npm run build', { stdio: 'inherit' });
    log('✅ Build successful!', 'green');
    return true;
  } catch (error) {
    log('❌ Build failed! Fix the errors above before deploying.', 'red');
    return false;
  }
}

function checkGitStatus() {
  log('\n📦 Checking Git Status...', 'blue');
  
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    
    if (status.trim() === '') {
      log('✅ Working directory is clean', 'green');
      return true;
    } else {
      log('⚠️  You have uncommitted changes:', 'yellow');
      console.log(status);
      log('Consider committing your changes before deploying', 'yellow');
      return false;
    }
  } catch (error) {
    log('❌ Git not initialized or not a git repository', 'red');
    log('Initialize git: git init && git add . && git commit -m "Initial commit"', 'yellow');
    return false;
  }
}

function generateProductionEnvTemplate() {
  log('\n📝 Generating Production Environment Template...', 'blue');
  
  const template = `# Production Environment Variables
# Replace these values with your production settings

# NextAuth Configuration
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-nextauth-secret

# Google OAuth (Production)
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret

# Database (Optional - for MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stock-agent

# Email Configuration (Optional)
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-specific-password

# Stock APIs (Optional)
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-api-key
`;
  
  fs.writeFileSync('env.production.example', template);
  log('✅ Created env.production.example', 'green');
  log('📋 Use this template to set up environment variables in your hosting platform', 'blue');
}

function showDeploymentRecommendations() {
  log('\n🎯 Deployment Recommendations:', 'blue');
  
  log('\n1. 🌐 Choose a Hosting Platform:', 'bold');
  log('   • Vercel (Recommended) - Free, perfect for Next.js', 'green');
  log('   • Netlify - Free, good for static sites', 'green');
  log('   • Railway - Paid, good for full-stack apps', 'yellow');
  log('   • DigitalOcean - Paid, more control', 'yellow');
  
  log('\n2. 🔐 Update Google OAuth:', 'bold');
  log('   • Go to Google Cloud Console', 'blue');
  log('   • Add your production domain to authorized origins', 'blue');
  log('   • Update callback URLs for production', 'blue');
  
  log('\n3. 🌍 Domain Setup:', 'bold');
  log('   • Buy a domain (Namecheap, GoDaddy, etc.)', 'blue');
  log('   • Configure DNS settings', 'blue');
  log('   • Point to your hosting platform', 'blue');
  
  log('\n4. 📊 Post-Deployment:', 'bold');
  log('   • Test all features on production', 'blue');
  log('   • Set up analytics (Google Analytics)', 'blue');
  log('   • Monitor performance', 'blue');
  log('   • Configure error tracking', 'blue');
}

// Main execution
async function main() {
  log('Starting deployment preparation...\n', 'bold');
  
  let allChecksPassed = true;
  
  // Check required files
  log('📁 Checking Required Files...', 'blue');
  const files = [
    ['package.json', 'package.json'],
    ['next.config.js', 'next.config.js'],
    ['tailwind.config.js', 'tailwind.config.js'],
    ['app/layout.tsx', 'app/layout.tsx'],
    ['app/page.tsx', 'app/page.tsx'],
    ['components/Header.tsx', 'components/Header.tsx'],
    ['app/api/auth/[...nextauth]/route.ts', 'NextAuth configuration'],
    ['README.md', 'README.md']
  ];
  
  files.forEach(([filePath, description]) => {
    if (!checkFile(filePath, description)) {
      allChecksPassed = false;
    }
  });
  
  // Check environment variables
  const envOk = checkEnvironmentVariables();
  if (!envOk) {
    allChecksPassed = false;
  }
  
  // Check git status
  const gitOk = checkGitStatus();
  if (!gitOk) {
    allChecksPassed = false;
  }
  
  // Generate production env template
  generateProductionEnvTemplate();
  
  // Show recommendations
  showDeploymentRecommendations();
  
  // Final summary
  log('\n📋 Summary:', 'bold');
  if (allChecksPassed) {
    log('✅ Your application is ready for deployment!', 'green');
    log('\n🚀 Next Steps:', 'bold');
    log('1. Choose a hosting platform (Vercel recommended)', 'blue');
    log('2. Update Google OAuth for production', 'blue');
    log('3. Set up environment variables in your hosting platform', 'blue');
    log('4. Deploy and test', 'blue');
  } else {
    log('❌ Please fix the issues above before deploying', 'red');
    log('\n🔧 Fix the issues marked with ❌ above', 'yellow');
  }
  
  log('\n📖 For detailed instructions, see DEPLOYMENT.md', 'blue');
  log('🎉 Good luck with your deployment!', 'green');
}

// Run the script
main().catch(error => {
  log(`❌ Script failed: ${error.message}`, 'red');
  process.exit(1);
}); 