# Custom Kicks - 3D Sneaker Customizer

A React application for customizing sneakers in 3D with AI-powered color generation.

## Features

- **3D Sneaker Customization**: Real-time color editing with Three.js
- **AI Color Generation**: Generate colorways from images using OpenAI
- **User Authentication**: Secure login/signup with Clerk
- **Responsive Design**: Works on desktop and mobile devices

## Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```env
# Backend API URL
VITE_BACKEND_API_URL=http://localhost:3000

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

# Google Custom Search API (for image search)
VITE_GOOGLE_API_KEY=your_google_api_key_here
VITE_GOOGLE_CSE_ID=your_google_cse_id_here

# OpenAI API (for color generation)
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### Setting up Clerk Authentication

1. Create an account at [clerk.com](https://clerk.com)
2. Create a new application
3. Go to API Keys in your Clerk dashboard
4. Copy your Publishable Key
5. Add it to your `.env` file as `VITE_CLERK_PUBLISHABLE_KEY`

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Three.js** for 3D graphics
- **Clerk** for authentication
- **Tailwind CSS** for styling
- **React Router** for navigation
- **TanStack Query** for data fetching

## Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components with header
│   └── ui/              # Reusable UI components
├── pages/               # Page components
│   ├── home/           # Homepage
│   ├── silhouettes/    # Silhouette selection
│   └── silhouette-edit/ # 3D editor
└── lib/                # Utility functions
```

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
