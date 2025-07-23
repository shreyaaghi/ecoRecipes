# Eco-Recipes Mobile App

## Overview
Eco-Recipes is a mobile application designed to promote sustainable eating through a collection of eco-friendly recipes and educational resources. Built with React Native and Expo, the app helps users discover, create, and plan meals with a focus on environmental consciousness.

## Features

### Recipe Management
- Browse a curated collection of sustainable recipes
- View detailed recipe information including ingredients and preparation steps
- Search functionality to find specific recipes
- Create and submit your own sustainable recipes

### Meal Planning
- Create personalized meal plans
- View and manage your saved meal plans
- Easy navigation between meal plans and recipe details

### Educational Resources
- Learn about the importance of sustainable eating
- Discover the health benefits of eco-friendly food choices
- Understand the environmental impact of food choices
- Tips for sustainable food practices

### User Experience
- Clean, intuitive interface with a focus on usability
- Responsive design that works across different device sizes
- Seamless navigation between different sections of the app

## Technical Stack

### Frontend
- **Framework**: React Native with Expo
- **Navigation**: Expo Router for file-based routing
- **State Management**: React Context API
- **UI Components**: React Native core components with custom styling
- **Icons**: Expo Vector Icons

### Backend
- **API**: Custom RESTful API
- **Authentication**: Token-based authentication
- **Data Storage**: AsyncStorage for local data persistence

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app (for testing on physical devices)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/eco-recipes.git
   cd eco-recipes
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   EXPO_PUBLIC_API_URL=your_api_url_here
   ```

4. Start the development server:
   ```bash
   npx expo start
   ```

5. Run the app:
   - On iOS: Press `i` in the terminal (requires Xcode)
   - On Android: Press `a` in the terminal (requires Android Studio)
   - On physical device: Scan the QR code with the Expo Go app

## Project Structure

```
eco-recipes/
├── app/                    # Main application screens
│   ├── (auth)/             # Authentication screens
│   ├── (tabs)/             # Main tab navigation
│   ├── mealplans/          # Meal planning screens
│   ├── recipes/            # Recipe browsing screens
│   └── whysustainability/  # Educational content
├── components/             # Reusable UI components
├── constants/              # App constants and theme
├── hooks/                  # Custom React hooks
└── utilities/              # Utility functions
```

## Contributing

We welcome contributions to Eco-Recipes! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Commit your changes with clear, descriptive messages
4. Push to your fork and submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.