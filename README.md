# organizational-invites-api

## Installation

```
gh repo clone JoinSEEDS/organizational-invites-api
npm install
```

## usage

1) Copy & Edit .env file
2) Run main process in background
```
pm2 start --name org-invites-api src/index.js
```

## How to run the unit tests

```
npx riteway test/*.test.js
```
