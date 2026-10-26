# Pack Place

A personal collection tracker for NBA trading cards. Sign up, add your cards, and watch your collection — and its total value — grow.

Built as a fellowship demo day project.

## Features

- **User accounts** — sign up, log in, and log out with Passport local auth. Each user only sees their own cards.
- **Add a card** — player, card company (Panini, Topps, Upper Deck, Bowman, Other), card type (Base, Rookie, Autograph, Relic, Insert), year, set, parallel, grade, and price paid.
- **Collection dashboard** — card count and total value, computed from what you paid for each card.
- **Deck display** — cards stack and overlap like a deck. Hover any card to pull it out and see its full details.
- **Delete** — remove a card from your collection with the x on the card.

## Tech stack

- Node.js + Express
- EJS templates + Bootstrap
- MongoDB (native driver) with Mongoose
- Passport for authentication

## Getting started

1. Install dependencies:
   ```
   npm install
   ```
2. Set your database connection in `config/database.js` (database name: `cards`) and your session secret in `.env`.
3. Start the server:
   ```
   node server.js
   ```
4. Open http://localhost:8081, sign up, and add your first card.