# PawMap

PawMap is a full-stack web application that helps pet owners discover nearby resources—veterinary clinics, pet stores, dog parks—and get turn-by-turn directions. It features:

- **Search** for nearby pet services by category and location  
- **Interactive Map** with clustered and individual markers  
- **Recent Searches** history with quick revisit and deletion  
- **Routing** with step-by-step instructions and enumerated map markers  
- **Responsive UI** built with React, Tailwind CSS, and Framer Motion  
- **Server-side API** in Express/Node that proxies Google Maps services and stores search queries in a PostgreSQL database via Sequelize  
- **Deployment** on Heroku 
- 
- ############## https://pawmap-1d1af1fdd7ec.herokuapp.com/ #################

---

## 📦 Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v16+ and npm (or Yarn)
- A Google Cloud API key with **Maps JavaScript**, **Places**, **Geocoding**, and **Directions** APIs enabled
- (In production) A Heroku account and optionally a Heroku Postgres add-on

---

### 1. Clone & install dependencies

```bash
git clone https://github.com/e-Ash1/pawmap.git
cd pawmap

# install server deps
cd server
npm install

# install client deps
cd ../client
npm install
```

### 1a. Create your .env files

/server/.env
PORT=5000
CLIENT_URL=http://localhost:3000
DATABASE_URL=postgres://<USER>:<PASS>@localhost:5432/paw_db
GOOGLE_GEOCODE_URL=https://maps.googleapis.com/maps/api/geocode/json
GOOGLE_PLACES_URL=https://maps.googleapis.com/maps/api/place/nearbysearch/json
GOOGLE_MAPS_API_KEY=<YOUR_GOOGLE_MAPS_KEY>

/client/.env
REACT_APP_GOOGLE_MAPS_API_KEY=<YOUR_GOOGLE_MAPS_KEY>


### 2. Starting the Client & Server

# macOS / Linux
sudo service postgresql start

# then, in psql:
psql
CREATE DATABASE paw_db;
\q

#### 2.1 Create & Connect to DB:

```bash
# Log into superadmin/admin privileges and create a database:
CREATE DATABASE paw_db
# Connect into the DB:
\c paw_db


### 3. Starting the Client & Server

You’ll need two terminal windows or tabs:

#### 3.1 Run the server

```bash
# from the project root
cd server
node index.js


```
#### 3.2 Run the client

```bash
# from the project root
cd client
npm start

```

#### 3.2 Running Tests:

# From project root (all tests + coverage)
npm test -- --coverage

# Or client‑only + coverage
cd client
npm test -- --coverage

# Or server‑only + coverage
cd server
npm test -- --coverage











