# Boutique

[![GitHub package version](https://badgen.net/github/release/ExtensionEngine/boutique)](https://github.com/ExtensionEngine/boutique/releases)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/105e3679b14c4b7b9205981734e90424?branch=develop)](https://www.codacy.com/app/ExtensionEngine/boutique?utm_source=github.com&utm_medium=referral&utm_content=ExtensionEngine/boutique&utm_campaign=Badge_Grade)
[![Known Vulnerabilities](https://snyk.io/test/github/ExtensionEngine/boutique/develop/badge.svg)](https://snyk.io/test/github/ExtensionEngine/boutique)
[![GitHub license](https://badgen.net/github/license/ExtensionEngine/boutique)](https://github.com/ExtensionEngine/boutique/blob/develop/LICENSE)
[![js @extensionengine style](https://badgen.net/badge/code%20style/@extensionengine/black)](https://github.com/ExtensionEngine/eslint-config)
[![style @extensionengine style](https://badgen.net/badge/stylelint/@extensionengine/black)](https://github.com/ExtensionEngine/stylelint-config)
[![Open Source Love](https://badgen.net/badge/Open%20Source/%E2%9D%A4/3eaf8e)](https://github.com/ellerbrock/open-source-badges)

> Under construction :construction:

LMS

## :page_with_curl: Dependencies

- Node.js (>= 8.11.0)
- npm (>= 5.8.0)
- PostgreSQL (>= 9.4)

Check `engines` field in [`package.json`](package.json)

## :computer: Installation

### Prerequisites

- [Node.js & npm](https://nodejs.org/en/download/)
- [PostgreSQL](https://www.postgresql.org/download/) 
- Clone this repo

### Setup

- Run `npm install` in the repo directory
- Create database in PostgreSQL
- App is configured via environment variables contained in a file named `.env`.
  Use the `.env.example` file as a template: `cp .env.example .env` and enter configuration details.
- Run `npm run db:seed`, if any error run `npm run db:reset` and then `npm run db:seed`.
- You can create admin/student user by running `npm run user:add`
- For other scripts run `npm run`

## :rocket: Launch

### Development

- Server: `npm run dev:server`
- Client: `npm run dev:client`

### Production

- Bundle client by issuing `npm run build`
- `npm run start`
