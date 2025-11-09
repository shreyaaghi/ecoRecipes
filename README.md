# Eco-Recipes: Sustainable Cooking App

## Overview
Eco-Recipes is a mobile application designed to help users discover and create sustainable recipes, plan meals, and learn about eco-friendly cooking practices. The app provides a platform for users to explore recipes, create meal plans, and gain knowledge about sustainable food choices.

## Target Audience
- Home cooks interested in sustainable eating
- Individuals looking to reduce their environmental impact through food choices
- People who want to learn more about sustainable cooking practices
- Users who want to organize their meal planning

## Key Features

### User Authentication
- Secure login and signup functionality
- Persistent user sessions with JWT tokens
- Protected routes for authenticated users

### Recipe Management
- Browse a collection of sustainable recipes
- View detailed recipe information
- Search functionality to find specific recipes
- Create and submit your own recipes

### Meal Planning
- Create and manage multiple meal plans
- Add recipes to your meal plans
- View and edit existing meal plans
- Delete meal plans when no longer needed

### EcoFood Assistant
- AI-powered chat interface for sustainable food guidance
- Get personalized advice on growing your own food
- Discover local and seasonal ingredients
- Learn about sustainable food practices and waste reduction
- Interactive prompts for common questions
- Real-time responses to your sustainability queries

### Why Sustainability?
- Educational content about sustainable food choices
- Information about the environmental impact of food production
- Tips for making more eco-friendly food decisions

## Technical Implementation

### Frontend (Mobile App)
- **Framework**: React Native with Expo for cross-platform development
- **Navigation**: Expo Router for file-based routing
- **State Management**: React Context API with custom hooks
- **UI Components**: Custom components with React Native
- **Storage**: AsyncStorage for local data persistence
- **Networking**: Axios for API requests
- **Icons**: Expo Vector Icons
- **Forms**: Custom form components for recipe creation

### Backend (Server)
- **Runtime**: Node.js with TypeScript
- **Web Framework**: Express.js
- **Authentication**: JWT-based authentication
- **Database**: PostgreSQL (via Supabase)
- **API**: RESTful endpoints for all major features
- **File Storage**: Supabase Storage for recipe images
- **Validation**: Request validation middleware
