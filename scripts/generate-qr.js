import qrcode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateQRCode() {
  try {
    // Get local IP address
    const os = await import('os');
    const nets = os.networkInterfaces();
    const results = Object.create(null);

    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
          if (!results[name]) {
            results[name] = [];
          }
          results[name].push(net.address);
        }
      }
    }

    // Get the first available IP address
    const localIP = Object.values(results)[0]?.[0] || 'localhost';
    const expoUrl = `exp://${localIP}:8081`;
    
    console.log('🔗 Expo URL:', expoUrl);
    console.log('📱 Scan this QR code with Expo Go app on your iPhone');
    
    // Generate QR code
    const qrCodeDataURL = await qrcode.toDataURL(expoUrl, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Save QR code to file
    const qrCodePath = path.join(__dirname, '../public/expo-qr-code.png');
    const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync(qrCodePath, base64Data, 'base64');
    
    console.log('✅ QR Code generated and saved to:', qrCodePath);
    console.log('📋 Instructions:');
    console.log('1. Install Expo Go app from App Store');
    console.log('2. Open Expo Go app');
    console.log('3. Tap "Scan QR Code"');
    console.log('4. Point camera at the QR code');
    console.log('5. Your app will load in Expo Go!');
    
    return expoUrl;
  } catch (error) {
    console.error('❌ Error generating QR code:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateQRCode();
}

export default generateQRCode; 