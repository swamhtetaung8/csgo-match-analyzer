# CS:GO Match Log Analyzer

A web-based tool that converts **raw CS:GO match logs** into detailed, user-friendly **match analytics** and visualizations.

Built with [Laravel](https://laravel.com/) and [Inertia.js](https://inertiajs.com/).

---

## Features

- Upload and parse CS:GO match logs
- Visualize match events and player statistics
- Detailed round-by-round breakdowns
- Interactive frontend built with React and Tailwind via Inertia.js
- Easily extendable for new analytics or game formats

---

## Tech Stack

- **Backend:** Laravel 11+, PHP 8.4
- **Frontend:** Inertia.js + React + TailwindCSS + Shadcn UI
- **Build Tools:** Vite, Composer, NPM

---

## Local Setup

1. **Clone the repo**
    ```bash
    git clone git@github.com:swamhtetaung8/csgo-match-analyzer.git
    cd csgo-match-analyzer
    ```

2. **Install dependencies**
    ```
    npm i --legacy-peer-deps
    composer install
    ```

3. **Environment setup**
    ```
    cp .env.example .env
    php artisan key:generate
    ```

4. **Run the project**
    ```
    composer run dev
    ```
    Then visit http://127.0.0.1:8000/ to start using the tool.
