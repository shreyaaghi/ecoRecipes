## Eco-Recipes Mobile App

### Overview
Eco-Recipes is a mobile app designed to promote sustainable eating by offering recipes that emphasize low-carbon footprint ingredients. The app features a variety of eco-friendly recipes, tips on sourcing local and seasonal ingredients, meal planning, and educational content on sustainable eating.

### Benefits of using Navigation (TypeScript):

#### File-Based Routing
- **Multiple Screens**: Includes screens for recipe lists, recipe details, ingredient sourcing tips, and meal planning.
- **Efficient Organization**: Navigation with file-based routing helps organize these different screens efficiently, providing a better structure for the app.

#### TypeScript
- **Error Handling**: Using TypeScript helps catch errors early and improve code quality
- **Data Management**: Useful for a complex app that involves handling various types of data, like recipes, ingredients, and user inputs

### Features

#### Database and Backend (Supabase)
- **Supabase**: Used for managing the database, including tables for Recipes, Ingredients, Users, Meal Plans, and Tips
- **Filtering**: Implement filtering capabilities based on attributes such as dessert, savory, and sweet

#### Sourcing Tips
- **Local and Seasonal Ingredients**: Create a section for tips on sourcing local and seasonal ingredients
- **Content Mix**: Combination of your content and user-generated tips
- **Resources**: Include links to articles, videos, and guides for growing your own ingredients

#### Meal Planning and Shopping List
- **Meal Planning**: Implement a feature for users to plan their meals for the week
- **Shopping Lists**: Automatically generate shopping lists based on the selected recipes
- **Check-Off Items**: Allow users to check off items as they shop

#### Sustainability Information
- **Recipe Details**: Provide detailed explanations for why each recipe is sustainable, highlighting aspects like carbon footprint, water usage, and impact on biodiversity
- **Educational Content**: Include educational content on the benefits of sustainable eating for both the environment and personal health

### Target Audience
- **Adults**: Primarily targeted at adults concerned with healthier eating and sustainable diets
- **Health Enthusiasts**: Suitable for anyone interested in eating healthy and learning about sustainable food practices

#### Interactive Options
- **User Engagement**: Features such as user ratings, comments, and the ability to upload personal recipes

#### Finding Ingredients
- **Ingredient Sourcing**: Integrate with external APIs to help users find local stores or farmers' markets that offer the ingredients
- **Geolocation**: Use geolocation features to show nearby sourcing options

### Getting Started

#### Prerequisites
- Node.js
- Expo CLI
- Supabase Account