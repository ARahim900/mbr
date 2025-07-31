import { networkInterfaces } from 'os';

function getLocalIP() {
  const nets = networkInterfaces();
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
  return localIP;
}

const localIP = getLocalIP();
console.log('🔗 Your Local IP Address:', localIP);
console.log('📱 Expo URL:', `exp://${localIP}:8081`);
console.log('🌐 Development URL:', `http://${localIP}:3000`);
console.log('');
console.log('📋 Instructions:');
console.log('1. Install Expo Go app from App Store');
console.log('2. Open Expo Go app');
console.log('3. Tap "Enter URL manually"');
console.log('4. Enter the Expo URL above');
console.log('5. Your app will load in Expo Go!'); 