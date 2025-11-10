# NASA APOD API 

a web application that allows you to explore the universe through NASA's Astronomy Picture of the Day (APOD) API.

## Features

- View the Astronomy Picture of the Day for any date.
- Get AI-powered suggestions for interesting dates to explore.
- Use the "Surprise Me" feature to see a random picture from the archive.
- Built with Next.js for a fast and modern web experience.

## Getting Started

To get this project up and running on your local machine, follow these steps:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Set up environment variables:**

    Create a `.env` or `.env.local` file in the root of your project and add your NASA API key:
    ```
    NASA_API_KEY=YOUR_NASA_API_KEY
    ```
    You can obtain a free API key from the [NASA APOD API website](https://api.nasa.gov/).

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Tech Stack

- [Next.js](https://nextjs.org/) - React Framework
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [ShadCN/UI](https://ui.shadcn.com/) - Re-usable components
- [Genkit](https://firebase.google.com/docs/genkit) - AI framework

## Author

- **Luke Ponga**
