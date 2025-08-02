import http from 'http';
import { createServer } from 'http';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Expo Development Server is running!\n');
});

server.listen(8081, '0.0.0.0', () => {
  console.log('✅ Expo Development Server running on port 8081');
  console.log('🌐 Local: http://localhost:8081');
  console.log('🌐 Network: http://192.168.1.40:8081');
  console.log('\n📱 To test on your iPhone:');
  console.log('1. Open Safari on your iPhone');
  console.log('2. Go to: http://192.168.1.40:8081');
  console.log('3. If this works, Expo should work too');
});

console.log('🔧 Testing Expo Development Server...'); 