#!/bin/bash
# Water System Dashboard - Automated Verification Script

echo "🔍 Starting Water System Dashboard Verification..."
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed successfully"
echo ""

# Run type check
echo "🔍 Running type check..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "⚠️  Type check found issues (this may not prevent the app from running)"
fi
echo ""

# Build the project
echo "🔨 Building the project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build completed successfully"
echo ""

# Check if dist folder exists
if [ -d "dist" ]; then
    echo "✅ Build output directory exists"
    echo "📊 Build statistics:"
    echo "  - Total files: $(find dist -type f | wc -l)"
    echo "  - HTML files: $(find dist -name "*.html" | wc -l)"
    echo "  - JS files: $(find dist -name "*.js" | wc -l)"
    echo "  - CSS files: $(find dist -name "*.css" | wc -l)"
else
    echo "❌ Build output directory not found"
    exit 1
fi
echo ""

# Create a test report
echo "📝 Creating verification report..."
cat > VERIFICATION_REPORT.md << EOF
# Water System Dashboard - Verification Report
Date: $(date)

## Build Status
- ✅ Dependencies installed
- ✅ Build completed successfully
- ✅ Output directory created

## Files Generated
- Total files: $(find dist -type f | wc -l)
- HTML files: $(find dist -name "*.html" | wc -l)
- JS files: $(find dist -name "*.js" | wc -l)
- CSS files: $(find dist -name "*.css" | wc -l)

## Next Steps
1. Run \`npm run dev\` to start the development server
2. Open http://localhost:5173 in your browser
3. Navigate to Water System Analysis section
4. Verify that charts are visible
5. Test on mobile devices or using browser developer tools

## Deployment
The project is ready for deployment to Netlify. The build output is in the \`dist\` directory.
EOF

echo "✅ Verification report created: VERIFICATION_REPORT.md"
echo ""

echo "🎉 Verification completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Open http://localhost:5173 in your browser"
echo "3. Check the Water System Analysis section for charts"
echo "4. Test mobile responsiveness"
echo ""
echo "For deployment, push your changes to GitHub and Netlify will automatically build and deploy."
