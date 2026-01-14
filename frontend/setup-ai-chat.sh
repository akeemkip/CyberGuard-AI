#!/bin/bash

# AI Chat Setup Script
# This script helps set up the Copilot API integration for the AI Chat component

echo "🚀 AI Chat Copilot Integration Setup"
echo "===================================="
echo ""

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

echo "✅ Frontend directory detected"
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✅ .env.local already exists"
else
    echo "⚠️  .env.local not found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "✅ .env.local created from .env.example"
    else
        echo "⚠️  .env.example not found. Creating new .env.local..."
        cat > .env.local << 'EOF'
# Copilot API Configuration
VITE_COPILOT_API_URL=https://api.copilot.microsoft.com/v1
VITE_COPILOT_API_KEY=your_actual_copilot_api_key

# Backend API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
EOF
        echo "✅ .env.local created"
    fi
fi

echo ""
echo "📋 Setup Summary"
echo "================"
echo "1. Copilot service created: src/app/services/copilot.service.ts"
echo "2. AI Chat component updated: src/app/components/ai-chat.tsx"
echo "3. Environment files created:"
echo "   - .env.example (template)"
echo "   - .env.local (for local development)"
echo ""

echo "⚠️  IMPORTANT NEXT STEPS"
echo "======================"
echo "1. Add your Copilot API key to .env.local:"
echo "   VITE_COPILOT_API_KEY=your_actual_api_key_here"
echo ""
echo "2. Get your API key from:"
echo "   - OpenAI: https://platform.openai.com/api-keys"
echo "   - Microsoft Copilot: https://copilot.microsoft.com/"
echo ""
echo "3. Verify .env.local is in .gitignore (NEVER commit API keys):"
cat .gitignore 2>/dev/null | grep -q ".env.local" && echo "   ✅ Already in .gitignore" || echo "   ⚠️  Add '.env.local' to .gitignore"
echo ""

echo "4. Start the development server:"
echo "   npm run dev"
echo ""

echo "5. Test the chat:"
echo "   - Navigate to the AI Chat component"
echo "   - Try sending a message"
echo "   - Verify streaming response appears"
echo ""

echo "✨ Setup complete!"
