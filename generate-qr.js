import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const url = 'http://192.168.1.40:3001';
const outputPath = path.join(__dirname, 'qr-code.png');

async function generateQRCode() {
    try {
        // Generate QR code as PNG
        await QRCode.toFile(outputPath, url, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        
        console.log('✅ QR Code generated successfully!');
        console.log(`📁 File saved as: ${outputPath}`);
        console.log(`🔗 URL: ${url}`);
        console.log('\n📱 Instructions:');
        console.log('1. Open the qr-code.png file');
        console.log('2. Scan it with your iPhone camera');
        console.log('3. Or manually type the URL in Safari: ' + url);
        
        // Also create an HTML file with the QR code embedded
        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mobile Access QR Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            text-align: center;
            background: rgba(255, 255, 255, 0.1);
            padding: 2rem;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        h1 {
            margin-bottom: 1rem;
            font-size: 2rem;
        }
        .qr-container {
            margin: 2rem 0;
            padding: 1rem;
            background: white;
            border-radius: 10px;
            display: inline-block;
        }
        .qr-code {
            width: 300px;
            height: 300px;
            border: 2px solid #ddd;
            border-radius: 8px;
        }
        .url-info {
            margin-top: 1rem;
            font-size: 1.1rem;
        }
        .instructions {
            margin-top: 2rem;
            max-width: 400px;
            line-height: 1.6;
        }
        .step {
            margin: 0.5rem 0;
            padding: 0.5rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 5px;
        }
        .manual-link {
            margin-top: 1rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .manual-link a {
            color: #fff;
            text-decoration: none;
            font-weight: bold;
            font-size: 1.1rem;
        }
        .manual-link a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📱 Mobile Access QR Code</h1>
        <p>Scan this QR code with your iPhone to access the app</p>
        
        <div class="qr-container">
            <img class="qr-code" src="qr-code.png" alt="QR Code for Mobile Access">
        </div>
        
        <div class="url-info">
            <strong>URL:</strong> ${url}
        </div>
        
        <div class="manual-link">
            <strong>📋 Alternative:</strong> 
            <a href="${url}" target="_blank">Click here to open the app directly</a>
        </div>
        
        <div class="instructions">
            <h3>📋 Instructions:</h3>
            <div class="step">1. Make sure your iPhone is connected to the same WiFi network as your computer</div>
            <div class="step">2. Open your iPhone's Camera app</div>
            <div class="step">3. Point the camera at the QR code above</div>
            <div class="step">4. Tap the notification that appears to open the app in Safari</div>
            <div class="step">5. The app will load and you can use it on your iPhone!</div>
        </div>
    </div>
</body>
</html>`;
        
        fs.writeFileSync('mobile-access-qr.html', htmlContent);
        console.log('✅ HTML file updated with local QR code image');
        
    } catch (error) {
        console.error('❌ Error generating QR code:', error);
    }
}

generateQRCode(); 