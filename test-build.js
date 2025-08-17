const { execSync } = require('child_process');

console.log('Testing build process...');

try {
  console.log('Running type check...');
  execSync('npm run type-check', { stdio: 'inherit' });
  console.log('✅ Type check passed');
  
  console.log('Running lint...');
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ Lint passed');
  
  console.log('Running build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
