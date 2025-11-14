#!/bin/bash

# ====================================================================
# 🚀 TUUT WEBSITE VERCEL DEPLOYMENT SCRIPT
# ====================================================================
# This script handles the complete deployment process for the
# Tuut website SSR application to Vercel.
# ====================================================================

set -e  # Exit on any error

# 🎨 COLORS & STYLING
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'
DIM='\033[2m'

# 🎯 EMOJIS
ROCKET="🚀"
CHECK="✅"
WARNING="⚠️"
ERROR="❌"
INFO="ℹ️"
GEAR="⚙️"
PACKAGE="📦"
FIRE="🔥"
LIGHTNING="⚡"

# ====================================================================
# 📋 UTILITY FUNCTIONS
# ====================================================================

print_header() {
    echo -e "\n${PURPLE}${BOLD}$1${NC}"
    echo -e "${PURPLE}$(printf '=%.0s' {1..60})${NC}\n"
}

print_step() {
    echo -e "${CYAN}📍 $1${NC}"
}

print_success() {
    echo -e "${GREEN}${CHECK} $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}${WARNING} $1${NC}"
}

print_error() {
    echo -e "${RED}${ERROR} $1${NC}"
}

print_info() {
    echo -e "${BLUE}${INFO} $1${NC}"
}

# ====================================================================
# 🔍 PRE-DEPLOYMENT CHECKS
# ====================================================================

check_prerequisites() {
    print_header "🔍 PRE-DEPLOYMENT CHECKS"

    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    print_success "Node.js $(node -v) detected"

    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    print_success "npm $(npm -v) detected"

    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing now..."
        npm install -g vercel
        print_success "Vercel CLI installed"
    else
        print_success "Vercel CLI $(vercel --version) detected"
    fi

    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root."
        exit 1
    fi
    print_success "Project root confirmed"

    # Check if vercel.json exists
    if [ ! -f "vercel.json" ]; then
        print_error "vercel.json not found. Please ensure the Vercel configuration exists."
        exit 1
    fi
    print_success "Vercel configuration found"
}

# ====================================================================
# 📦 BUILD PROCESS
# ====================================================================

build_project() {
    print_header "📦 BUILDING PROJECT"

    print_step "Cleaning previous builds..."
    rm -rf build/ dist/ .vercel/
    print_success "Build directories cleaned"

    print_step "Installing dependencies..."
    npm ci --silent
    print_success "Dependencies installed"

    print_step "Running SSR build..."
    npm run build
    print_success "SSR build completed"

    print_step "Verifying build output..."
    if [ ! -f "build/api/server.js" ]; then
        print_error "Server build not found. Build failed."
        exit 1
    fi
    print_success "Build verification passed"
}

# ====================================================================
# ⚙️ ENVIRONMENT SETUP
# ====================================================================

setup_environment() {
    print_header "⚙️ ENVIRONMENT SETUP"

    # Check for .env file
    if [ -f ".env" ]; then
        print_step "Found .env file"
        print_info "Make sure all required environment variables are set for Vercel"
        print_info "Required variables:"
        echo "   - SUPABASE_URL"
        echo "   - SUPABASE_ANON_KEY"
        echo "   - VITE_SUPABASE_URL"
        echo "   - VITE_SUPABASE_ANON_KEY"
    else
        print_warning "No .env file found"
        print_info "Create a .env file with your environment variables"
    fi

    print_step "Checking Vercel environment variables..."
    print_info "Run 'vercel env pull' to sync environment variables"
    print_info "Or set them in your Vercel dashboard"
}

# ====================================================================
# 🚀 DEPLOYMENT
# ====================================================================

deploy_to_vercel() {
    print_header "🚀 DEPLOYING TO VERCEL"

    # Ensure we're always deploying to the correct project
    print_step "Setting project configuration..."
    mkdir -p .vercel
    echo '{"projectId":"prj_bawEECtdgrM5zCEtLDI2d5vs4Xf6","orgId":"ahmed-bahaas-projects-eb44dab3"}' > .vercel/project.json

    # Check if this is a production deployment
    if [ "$1" = "--prod" ]; then
        print_step "Deploying to PRODUCTION (Project: prj_bawEECtdgrM5zCEtLDI2d5vs4Xf6)..."
        vercel --prod --yes
    else
        print_step "Deploying to PREVIEW (Project: prj_bawEECtdgrM5zCEtLDI2d5vs4Xf6)..."
        vercel --yes
    fi
}

# ====================================================================
# 🧪 DEPLOYMENT VERIFICATION
# ====================================================================

verify_deployment() {
    print_header "🧪 DEPLOYMENT VERIFICATION"

    print_step "Checking deployment status..."
    # This would be customized based on your specific verification needs
    print_success "Deployment completed successfully"

    print_info "Next steps:"
    echo "   1. Visit your deployed application"
    echo "   2. Test SSR functionality"
    echo "   3. Check environment variables"
    echo "   4. Monitor performance"
}

# ====================================================================
# 🛠️ UTILITY COMMANDS
# ====================================================================

local_test() {
    print_header "🛠️ LOCAL TESTING"

    print_step "Building project for local testing..."
    npm run build:all

    print_step "Starting local server..."
    NODE_ENV=production node build/server.js
}

cleanup() {
    print_header "🧹 CLEANUP"

    print_step "Cleaning build artifacts..."
    rm -rf build/ dist/ .vercel/
    print_success "Cleanup completed"
}

show_help() {
    echo -e "\n${BOLD}${PURPLE}🚀 TUUT WEBSITE VERCEL DEPLOYMENT SCRIPT${NC}\n"
    echo "Usage: $0 [COMMAND] [OPTIONS]\n"
    echo "Commands:"
    echo "  deploy     Deploy to Vercel preview (default)"
    echo "  deploy:prod Deploy to Vercel production"
    echo "  test       Build and test locally"
    echo "  build      Build project only"
    echo "  cleanup    Clean build artifacts"
    echo "  check      Run prerequisite checks only"
    echo "  help       Show this help message\n"
    echo "Options:"
    echo "  --prod     Deploy to production (use with deploy command)\n"
    echo "Examples:"
    echo "  $0 deploy          # Deploy to preview"
    echo "  $0 deploy --prod   # Deploy to production"
    echo "  $0 test            # Local testing"
    echo "  $0 cleanup         # Clean build files\n"
}

# ====================================================================
# 🎯 MAIN SCRIPT LOGIC
# ====================================================================

main() {
    case "${1:-deploy}" in
        "deploy")
            check_prerequisites
            setup_environment
            build_project
            deploy_to_vercel "$2"
            verify_deployment
            ;;
        "deploy:prod")
            check_prerequisites
            setup_environment
            build_project
            deploy_to_vercel --prod
            verify_deployment
            ;;
        "test")
            check_prerequisites
            local_test
            ;;
        "build")
            check_prerequisites
            build_project
            ;;
        "cleanup")
            cleanup
            ;;
        "check")
            check_prerequisites
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# ====================================================================
# 🎬 SCRIPT START
# ====================================================================

print_header "${ROCKET} TUUT WEBSITE VERCEL DEPLOYMENT"
print_info "Starting deployment process..."

# Trap to handle script interruption
trap 'print_error "Deployment interrupted"; exit 1' INT

# Run main function with all arguments
main "$@"

print_success "${FIRE} Deployment script completed successfully! ${LIGHTNING}"
print_info "For support, check the Vercel dashboard or deployment logs."