@echo off
REM AI Chat Setup Script for Windows
REM This script helps set up the Copilot API integration for the AI Chat component

echo.
echo ========================================
echo 🚀 AI Chat Copilot Integration Setup
echo ========================================
echo.

REM Check if we're in the frontend directory
if not exist "package.json" (
    echo ❌ Error: package.json not found.
    echo Please run this script from the frontend directory.
    pause
    exit /b 1
)

echo ✅ Frontend directory detected
echo.

REM Check if .env.local exists
if exist ".env.local" (
    echo ✅ .env.local already exists
) else (
    echo ⚠️  .env.local not found. Creating from .env.example...
    if exist ".env.example" (
        copy ".env.example" ".env.local" >nul
        echo ✅ .env.local created from .env.example
    ) else (
        echo ⚠️  .env.example not found. Creating new .env.local...
        (
            echo # Copilot API Configuration
            echo VITE_COPILOT_API_URL=https://api.copilot.microsoft.com/v1
            echo VITE_COPILOT_API_KEY=your_actual_copilot_api_key
            echo.
            echo # Backend API Configuration
            echo VITE_API_BASE_URL=http://localhost:3000/api
        ) > ".env.local"
        echo ✅ .env.local created
    )
)

echo.
echo ========================================
echo 📋 Setup Summary
echo ========================================
echo 1. Copilot service created:
echo    src/app/services/copilot.service.ts
echo.
echo 2. AI Chat component updated:
echo    src/app/components/ai-chat.tsx
echo.
echo 3. Environment files created:
echo    - .env.example (template^)
echo    - .env.local (for local development^)
echo.

echo ========================================
echo ⚠️  IMPORTANT NEXT STEPS
echo ========================================
echo 1. Add your Copilot API key to .env.local:
echo    VITE_COPILOT_API_KEY=your_actual_api_key_here
echo.
echo 2. Get your API key from:
echo    - OpenAI: https://platform.openai.com/api-keys
echo    - Microsoft Copilot: https://copilot.microsoft.com/
echo.
echo 3. Verify .env.local is in .gitignore:
echo    (NEVER commit API keys to version control^)
echo.
echo 4. Start the development server:
echo    npm run dev
echo.
echo 5. Test the chat:
echo    - Navigate to the AI Chat component
echo    - Try sending a message
echo    - Verify streaming response appears
echo.

echo ========================================
echo ✨ Setup complete!
echo ========================================
echo.
pause
