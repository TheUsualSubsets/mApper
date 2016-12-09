# **PARACHUTE**
A geo-location guessing game for friends!

[www.parachute9001.com](www.parachute9001.com)

*Shipped from San Francisco, CA*

___

### TEAM
**product owner:** Sean Enright

**scrum master:** Lizzie Shipton

**team members:** Jeff Judkins, Masashi Swingle, David Trann, Sean Enright, Lizzie Shipton


## TABLE OF CONTENTS

1. [Dependencies](# dependencies)
2. [Development](# develop-/-contribute)
  * [Usage](# usage)
  * [Tasks](# tasks)
3. [Known Bugs (Updated October, 2016)](# known-bugs)



## DEPENDENCIES

- "body-parser": "^1.15.2",
- "express": "^4.14.0",
- "forever": "^0.15.2",
- "mongodb": "^2.2.10",
- "mongoose": "^4.6.3",
- "mongoose-query-random": "^1.0.1",
- "mongoose-random": "^0.1.1",
- "nodemon": "^1.11.0",
- "request": "^2.75.0"



## DEVELOP / CONTRIBUTE

### Usage

  Fork the repo to your github.com account. Clone to your local machine.

  Install dependencies and start local server (from command-line):

```
cd mApper
npm install
cd client
bower install
cd ..
npm start
```

### Tasks

  To seed the database, run the seed_database.js file one time from your command-line:

  ```
  node seed_database.js
  ```

  This will populate your database with 50 initial locations selected from London, Chicago, New York, San Francisco and Istanbul.



## KNOWN BUGS

1. Cookies don't totally work - if you switch the user, it makes user undefined, instead of taking you back to the instruction page to log in with new initials

2. Sometimes it will freeze after 6 rounds....but usually not

3. We are querying the entire DB every time we need a random city, which is probably not the most efficient method

4. If the browser is zoomed in (or in some cases if the resolution is very different from what the game was designed for) the list of cities at the bottom of the screen will render really....wrong-looking

5.  Not mobile optimized
