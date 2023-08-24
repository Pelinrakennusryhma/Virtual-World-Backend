# Virtual World Backend

## Installing
Clone repository to your computer.

Install all dependencies with `npm install`.

Add `.env` file to root of the repository (same directory with `package.json`).

Add following contents to `.env` file:
```
MONGODB_URI=[Mongo Database URI]
TEST_MONGODB_URI=[Mongo Database URI for tests]
SECRET=[Secret for handling JWT]
PORT=[Server port]
```

## Running in command line
Run one of following commands to start bot:
```
npm run dev (for development version)
npm start (for production version)
npm run test (run all the tests)
```

## Links
[Virtual World Unity project repository](https://github.com/Pelinrakennusryhma/VirtualWorld)