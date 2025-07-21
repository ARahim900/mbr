#!/bin/bash

# Setup script for MBR Git hooks and commit standards
# This script configures git hooks and commit templates

echo "🔧 Setting up MBR Git hooks and commit standards..."

# Create .git/hooks directory if it doesn't exist
mkdir -p .git/hooks

# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

echo "🚀 Running pre-commit checks..."

# Run the verification script
node scripts/verify-commit.js

# Capture the exit code
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
    echo "❌ Pre-commit checks failed. Please fix the issues before committing."
    echo "💡 Tip: You can bypass hooks with --no-verify, but this is not recommended!"
    exit 1
fi

echo "✅ Pre-commit checks passed!"
exit 0
EOF

# Create commit-msg hook for validating commit messages
cat > .git/hooks/commit-msg << 'EOF'
#!/bin/bash

# Read the commit message
commit_regex='^(feat|fix|docs|style|refactor|perf|test|chore)(\(.+\))?: .{1,50}'
commit_message=$(cat $1)

if ! echo "$commit_message" | grep -qE "$commit_regex"; then
    echo "❌ Invalid commit message format!"
    echo ""
    echo "📝 Your commit message must follow this format:"
    echo "   <type>: <subject>"
    echo ""
    echo "📋 Valid types:"
    echo "   feat:     New feature"
    echo "   fix:      Bug fix"
    echo "   docs:     Documentation changes"
    echo "   style:    Formatting changes (no code change)"
    echo "   refactor: Code refactoring"
    echo "   perf:     Performance improvements"
    echo "   test:     Adding tests"
    echo "   chore:    Build process or auxiliary tools"
    echo ""
    echo "Example: feat: Add water consumption dashboard"
    echo ""
    exit 1
fi

echo "✅ Commit message format is valid!"
EOF

# Make hooks executable
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/commit-msg

# Set up commit message template
git config --local commit.template .gitmessage

# Configure git to use our verification
git config --local core.editor "vim"

echo "✅ Git hooks setup complete!"
echo ""
echo "📋 What's been configured:"
echo "   ✓ Pre-commit hook for code verification"
echo "   ✓ Commit message validation"
echo "   ✓ Commit message template"
echo ""
echo "🎯 Next steps:"
echo "   1. Make changes to your code"
echo "   2. Stage your changes: git add ."
echo "   3. Commit (hooks will run automatically): git commit"
echo "   4. The commit template will guide you"
echo ""
echo "💡 Tips:"
echo "   - Run 'npm run verify' to test your code before committing"
echo "   - Use 'npm run commit-helper' for guided commits"
echo "   - Run 'npm run rollback' if you need to undo changes"
