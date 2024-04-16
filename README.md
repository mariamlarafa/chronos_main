# Chronos

**Description:** Chronos is a project that includes both client and server components. It allows you to manage time-related tasks efficiently.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [License](#license)

## Installation

To get started with Chronos, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/ITsolutionBadr/chronos.git

2. install the dependencies of the main directory
   ```bash
   npm install

3. Stage Client and Server
   ```bash
   npm run stage.chronos
4. Stage client :
   ```bash
   cd client && npm install
5. Stage server :
   ```bash
   cd server && npm install
## Usage
Use the following scripts to manage your Chronos project:
1. To start the client (Separate console):
   ```bash
   npm un start.client
2. To start the server (Separate console):
   ```bash
   npm run start.server
3. To start both the client and server concurrently (Same console):
   ```bash
   npm run chronos

## Migration  Dev:
1. User Migration
   ```bash
   cd chronos
   npm run  migrate-data-v2.dev users
2. Data migration
   ```bash
   npm run  migrate-data-v2.dev db
## Migration  prod:
1. User Migration
   ```bash
   cd chronos
   npm run  migrate-data-v2 users
2. Data migration
   ```bash
   npm run  migrate-data-v2 db
## License
This project is licensed under the ISC License.

## Repository
GitHub: https://github.com/ITsolutionBadr/chronos

