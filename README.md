# Virtual World Backend

REST Api calls for user authentication.
WebSocket for Unity server to connect to.

## Installing
Clone repository to your computer.

Install all dependencies with `npm install`.

Add `.env` file to root of the repository (same directory with `package.json`).

Add following contents to `.env` file:
```
MONGODB_URI=[Mongo Database URI]
TEST_MONGODB_URI=[Optional, Mongo Database URI for tests]
SECRET=[Secret for handling JWT]
AUTH_PORT=[Port for the user authentication server]
DATA_PORT=[Port for Unity Dedicated Server's localhost server]
```

## Running in command line
Run one of following commands to start:
```
npm run dev (for development version)
npm start (for production version)
npm run test (run all the tests)
```

## Links
[Virtual World Unity project repository](https://github.com/Pelinrakennusryhma/VirtualWorld)