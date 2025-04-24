# LoL Champion Hub

A web application built with React and TypeScript that displays League of Legends champion information using Riot's Data Dragon API.

![image](https://github.com/user-attachments/assets/57711450-3284-4f93-815a-4c70636b86c9)
![image](https://github.com/user-attachments/assets/88c69a4f-e871-4996-8c81-b45e796f011d)


## Features

*   **Champion List:** Browse all champions available in League of Legends.
*   **Champion Details:** Click on a champion to view detailed information including:
    *   Splash Art & Lore
    *   Base Stats & Stats Per Level
    *   Abilities (Passive, Q, W, E, R) with descriptions
    *   Gameplay Tips (Playing As / Playing Against)
*   **Search:** Quickly find champions by name.
*   **Role Filtering:** Filter the champion list by primary roles (Assassin, Fighter, Mage, Marksman, Support, Tank).
*   **Language Selection:** View champion data in multiple languages supported by Data Dragon (e.g., English, Türkçe, 한국어, Español, Deutsch, Français, etc.).
*   **Dark Theme:** Uses a dark theme for comfortable viewing.

## Tech Stack

*   **Frontend:** React, TypeScript
*   **Build Tool:** Vite
*   **Styling:** CSS
*   **Data Source:** Riot Data Dragon API ([https://developer.riotgames.com/docs/lol#data-dragon](https://developer.riotgames.com/docs/lol#data-dragon))

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/factaxd/lol-hub.git 
    cd lol-hub
    ```
    

2.  **Install dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    or using yarn:
    ```bash
    yarn install
    ```

## Running the Project

To start the development server:

Using npm:
```bash
npm run dev
```
or using yarn:
```bash
yarn dev
```

This will usually start the application on `http://localhost:5173` (or the next available port). Open your browser and navigate to the provided URL.

## Building for Production

To create a production-ready build:

Using npm:
```bash
npm run build
```
or using yarn:
```bash
yarn build
```

This will create a `dist` directory with the optimized static assets.

## Deployment

This project is configured for easy deployment on [Vercel](https://vercel.com/).

1.  Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Import your project into Vercel.
3.  Vercel should automatically detect the Vite framework, use the `build` script (`npm run build`), and deploy the contents of the `dist` directory.
4.  The included `vercel.json` file explicitly defines these settings for consistency.

*(Once deployed, you can add the live URL here!)*
