# Apfelschuss.io Scraping Bot integration

This project grabs likes, followers and posts from different social media sites with help of [scrapingbot](https://www.scraping-bot.io/dashboard/).

# Run locally

1. Clone this repo with `git clone https://github.com/Apfelschuss/apfelschuss-scraper`

2. This project is using [Node.js](https://nodejs.org/en) in the version `v18.14.2`. If you have nvm installed on your machine, just run `nvm install` and you are good to go.

3. Cd into the repo and run `pnpm install`.

4. Copy the `.env.example` file, rename it to `.env` and add your credentials from [scraping-bot.io/dashboard](https://www.scraping-bot.io/dashboard/)

5. Build the JavaScript files with `pnpm run build`.

6. Run the project with `node ./dist/index.js`
