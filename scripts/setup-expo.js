import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Setting up Expo for Muscat Bay App...');

// Check if Expo CLI is installed
try {
  execSync('expo --version', { stdio: 'pipe' });
  console.log('✅ Expo CLI is already installed');
} catch (error) {
  console.log('📦 Installing Expo CLI...');
  try {
    execSync('npm install -g @expo/cli', { stdio: 'inherit' });
    console.log('✅ Expo CLI installed successfully');
  } catch (installError) {
    console.error('❌ Failed to install Expo CLI:', installError.message);
    process.exit(1);
  }
}

// Install dependencies
console.log('📦 Installing project dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Generate QR code
console.log('📱 Generating QR code...');
try {
  const generateQR = await import('./generate-qr.js');
  await generateQR.default();
} catch (error) {
  console.error('❌ Failed to generate QR code:', error.message);
}

console.log('\n🎉 Expo setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Install Expo Go app on your iPhone from App Store');
console.log('2. Run: npm run expo:start');
console.log('3. Scan the QR code with Expo Go app');
console.log('4. Your app will load on your iPhone!');
console.log('\n🔧 Available commands:');
console.log('- npm run expo:start     - Start Expo development server');
console.log('- npm run expo:start:web - Start web version');
console.log('- npm run expo:qr        - Show QR code in terminal');
console.log('- npm run generate:qr    - Generate QR code image'); 