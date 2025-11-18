#!/bin/bash

# Digital Job Connection - Vercel Deployment Script

echo "🚀 Digital Job Connection - Vercel Deployment Setup"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

echo "✅ Git found: $(git --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  .env file not found!"
    echo "Please create .env file with your MongoDB connection string:"
    echo ""
    echo "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/digitaljobconnection"
    echo ""
    read -p "Press Enter once you've created the .env file..."
fi

# Build the project
echo ""
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "Next steps:"
    echo "1. Push to GitHub: git push origin main"
    echo "2. Go to https://vercel.com"
    echo "3. Import your repository"
    echo "4. Add MONGODB_URI to Environment Variables"
    echo "5. IMPORTANT: Disable Deployment Protection to avoid authentication prompts"
    echo "   - Go to Project Settings → Deployment Protection"
    echo "   - Set Production Deployment Protection to 'Disabled'"
    echo "   - See DEPLOYMENT.md for detailed instructions"
    echo "6. Deploy!"
    echo ""
    echo "If your deployment asks for authentication, see DEPLOYMENT.md for troubleshooting"
    echo "For local testing, run: npm start"
else
    echo ""
    echo "❌ Build failed. Please fix the errors above."
    exit 1
fi
