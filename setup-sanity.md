# Sanity Setup Guide

## 1. Install Sanity CLI (if not already installed)
```bash
npm install -g @sanity/cli
```

## 2. Login to Sanity (if not already logged in)
```bash
sanity login
```

## 3. Check existing projects or create a new one
```bash
# Check if you have existing projects
sanity projects list

# If you need to create a new project
sanity projects create
```

## 4. Get your project details
```bash
# Get project info (run this in your project directory)
cd /Users/Ryan/builds/epic-3d-portfolio
sanity projects list
```

Your project ID will be shown in the list. The dataset is typically "production" unless you created a different one.

## 5. Create environment file
Create a `.env.local` file with your actual project credentials (see next step).
