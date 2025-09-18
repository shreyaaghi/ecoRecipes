# Eco-Recipes: Sustainable Cooking App

## Overview
Eco-Recipes is a mobile application designed to help users discover and create sustainable recipes, plan meals, and learn about eco-friendly cooking practices. The app provides a platform for users to explore recipes, create meal plans, and gain knowledge about sustainable food choices.

## 🎯 Target Audience
- Home cooks interested in sustainable eating
- Individuals looking to reduce their environmental impact through food choices
- People who want to learn more about sustainable cooking practices
- Users who want to organize their meal planning

## ✨ Key Features

### 📱 User Authentication
- Secure login and signup functionality
- Persistent user sessions with JWT tokens
- Protected routes for authenticated users

### 📚 Recipe Management
- Browse a collection of sustainable recipes
- View detailed recipe information
- Search functionality to find specific recipes
- Create and submit your own recipes

### 🗓️ Meal Planning
- Create and manage multiple meal plans
- Add recipes to your meal plans
- View and edit existing meal plans
- Delete meal plans when no longer needed

### 🌿 EcoFood Assistant
- AI-powered chat interface for sustainable food guidance
- Get personalized advice on growing your own food
- Discover local and seasonal ingredients
- Learn about sustainable food practices and waste reduction
- Interactive prompts for common questions
- Real-time responses to your sustainability queries

### 🌎 Why Sustainability?
- Educational content about sustainable food choices
- Information about the environmental impact of food production
- Tips for making more eco-friendly food decisions

## 🛠 Technical Implementation

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

### Key Dependencies
- **Frontend**:
  - @react-navigation/native
  - expo-router
  - axios
  - jwt-decode
  - @react-native-async-storage/async-storage
  - react-native-vector-icons

- **Backend**:
  - express
  - jsonwebtoken
  - @supabase/supabase-js
  - bcryptjs
  - prisma (for database ORM)
  - cors
  - dotenv

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm (v9+) or yarn (v1.22+)
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app (for testing on physical devices)
- PostgreSQL (for local development)
- Bun (for server development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shreyaaghi/ecoRecipes.git
   cd ecoRecipes
   ```

2. **Set up the backend**
   ```bash
   cd server
   cp .env.example .env  # Update with your database credentials
   bun install
   bun run migrate       # Run database migrations
   bun run dev          # Start the development server
   ```

3. **Set up the mobile app**
   ```bash
   cd ../eco-recipes
   cp .env.example .env  # Update with your API URL
   npm install
   # or
   yarn install
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run the app**
   - On iOS: Press `i` in the terminal (requires Xcode)
   - On Android: Press `a` in the terminal (requires Android Studio)
   - On physical device: Scan the QR code with the Expo Go app

## 🏗 Project Structure

```
ecoRecipes/
├── eco-recipes/            # Mobile app (React Native)
│   ├── app/                # Main application screens
│   │   ├── (auth)/         # Authentication flows (login, signup)
│   │   ├── (tabs)/         # Main tab navigation and components
│   │   ├── mealplans/      # Meal planning screens and components
│   │   ├── recipes/        # Recipe browsing and details
│   │   ├── tipsandtricks/  # Educational content
│   │   └── whysustainability/ # Sustainability information
│   ├── components/         # Reusable UI components
│   ├── constants/          # App constants and theme
│   └── hooks/              # Custom React hooks
│
└── server/                 # Backend server
    ├── src/
    │   ├── controllers/    # Request handlers
    │   ├── routes/        # API endpoints
    │   └── util/          # Utility functions
    └── prisma/            # Database schema and migrations (if using Prisma)
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### How to Contribute
1. **Fork** the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a **Pull Request**

### Development Workflow
- Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification
- Write meaningful commit messages
- Include tests for new features
- Update documentation when necessary

### Reporting Issues
Found a bug? Please create an issue with:
- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons by [Feather Icons](https://feathericons.com/)
- Built with [Expo](https://expo.dev/)
- Powered by [Supabase](https://supabase.com/) for authentication and database

1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Commit your changes with clear, descriptive messages
4. Push to your fork and submit a pull request