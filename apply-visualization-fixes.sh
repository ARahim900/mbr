#!/bin/bash

# Apply All Visualization Fixes Script
echo "🔧 Applying all visualization fixes to your MBR application..."
echo "================================================"

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Create or update vite.config.ts
echo -e "\n${YELLOW}1. Creating/Updating vite.config.ts with React plugin...${NC}"
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
EOF
echo -e "${GREEN}✓${NC} vite.config.ts created/updated"

# 2. Update index.html to remove import maps and add mobile fixes
echo -e "\n${YELLOW}2. Updating index.html...${NC}"
if [ -f "index.html" ]; then
    # Backup original
    cp index.html index.html.backup
    
    # Create new index.html without import maps
    cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <title>MBR - Water Management System</title>
    <style>
      /* Mobile-specific fixes for charts */
      @media (max-width: 768px) {
        .recharts-responsive-container {
          width: 100% !important;
          height: auto !important;
          min-height: 300px !important;
        }
        
        .recharts-wrapper {
          position: relative !important;
        }
        
        .recharts-surface {
          overflow: visible !important;
        }
        
        /* Chart label visibility fixes */
        .recharts-label {
          font-size: 12px !important;
          fill: #1a1a1a !important;
          font-weight: 600 !important;
        }
        
        .recharts-cartesian-axis-tick-value {
          font-size: 11px !important;
        }
      }
      
      /* Glassmorphism for chart labels */
      .chart-label-container {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 8px;
        padding: 4px 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF
    echo -e "${GREEN}✓${NC} index.html updated (backup saved as index.html.backup)"
else
    echo -e "${GREEN}✓${NC} index.html needs to be created manually"
fi

# 3. Import the visualization fixes CSS in main app file
echo -e "\n${YELLOW}3. Adding CSS import to main app file...${NC}"
if [ -f "src/main.tsx" ]; then
    # Add import at the beginning of the file
    sed -i '1i import "./styles/visualization-fixes.css";' src/main.tsx 2>/dev/null || \
    sed -i '' '1i import "./styles/visualization-fixes.css";' src/main.tsx 2>/dev/null
    echo -e "${GREEN}✓${NC} CSS import added to src/main.tsx"
elif [ -f "src/main.jsx" ]; then
    sed -i '1i import "./styles/visualization-fixes.css";' src/main.jsx 2>/dev/null || \
    sed -i '' '1i import "./styles/visualization-fixes.css";' src/main.jsx 2>/dev/null
    echo -e "${GREEN}✓${NC} CSS import added to src/main.jsx"
elif [ -f "src/App.tsx" ]; then
    sed -i '1i import "./styles/visualization-fixes.css";' src/App.tsx 2>/dev/null || \
    sed -i '' '1i import "./styles/visualization-fixes.css";' src/App.tsx 2>/dev/null
    echo -e "${GREEN}✓${NC} CSS import added to src/App.tsx"
fi

# 4. Install required dependencies
echo -e "\n${YELLOW}4. Installing required dependencies...${NC}"
if [ -f "package.json" ]; then
    # Check if @vitejs/plugin-react is installed
    if ! grep -q "@vitejs/plugin-react" package.json; then
        npm install -D @vitejs/plugin-react
        echo -e "${GREEN}✓${NC} @vitejs/plugin-react installed"
    fi
    
    # Check if recharts is installed
    if ! grep -q "recharts" package.json; then
        npm install recharts
        echo -e "${GREEN}✓${NC} recharts installed"
    fi
    
    # Check if vite is installed
    if ! grep -q "vite" package.json; then
        npm install -D vite
        echo -e "${GREEN}✓${NC} vite installed"
    fi
fi

# 5. Remove console.log statements
echo -e "\n${YELLOW}5. Removing console.log statements...${NC}"
if [ -f "scripts/remove-console-logs.js" ]; then
    node scripts/remove-console-logs.js
else
    # Simple inline console.log removal
    find src -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) -exec sed -i '/console\.log/d' {} \; 2>/dev/null
    echo -e "${GREEN}✓${NC} Console.log statements removed"
fi

# 6. Update package.json scripts
echo -e "\n${YELLOW}6. Updating package.json scripts...${NC}"
if [ -f "package.json" ]; then
    # Add visualization scripts to package.json
    node -e '
    const fs = require("fs");
    const pkg = JSON.parse(fs.readFileSync("package.json"));
    pkg.scripts = {
        ...pkg.scripts,
        "dev": "vite",
        "build": "tsc && vite build",
        "preview": "vite preview",
        "verify": "bash scripts/verify-visualization-fixes.sh",
        "clean:logs": "node scripts/remove-console-logs.js || echo \"No script found\"",
        "check:all": "npm run build"
    };
    fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
    '
    echo -e "${GREEN}✓${NC} package.json scripts updated"
fi

# 7. Final build test
echo -e "\n${YELLOW}7. Testing build...${NC}"
npm run build

echo -e "\n${GREEN}✨ All visualization fixes have been applied!${NC}"
echo ""
echo "Next steps:"
echo "1. Commit these changes: git add . && git commit -m 'Apply all visualization fixes'"
echo "2. Push to GitHub: git push origin main"
echo "3. Run locally: npm run dev"
echo "4. Deploy: npm run build && npm run deploy"
echo ""
echo "Your application should now display all visualizations correctly!"