# Quickstart

***************************************************
## TO START BACKEND SERVER AND BOTH APIs, FOLLOW THESE STEPS IN TERMINAL:

[+] In the "backend" directory, run the following command in Terminal:
```bash
MOVIE_API_KEY=<your-api-key-here> yarn start
```

[+] In another Terminal window (in the same project folder), run the following commands to sign up with your own application server (which is pulling info via web DB's api)

```bash
URL='http://localhost:3456'
```

```bash
DATA='{"email":"<your-email-here>","password":"<your-password-here>"}'
```

```bash
curl -H "Accept: appliction/json" -H "Content-Type: application/json" -XPOST -d $DATA $URL/signup
```

```bash
TOKEN=$(curl "Accept: appliction/json" -H "Content-Type: application/json" -XPOST -d $DATA $URL/login | jq -r ".token")
```

```bash
echo $TOKEN
```

>>>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiYzVjYzYzZjAtOGVjOC0xMWU4LTg5YjItNGQ5ZjQ3OGFlNzlkIiwiaWF0IjoxNTMyMzg1NDY0fQ.UmHyiAZQhZY0Z_209uaeTVW38_u7KgW7FDymg804pxQ

(The above is an example output of $TOKEN)

[+] You should be good to go!
- There is a Font end and Backend Application
- The Frontend is using an API to call to Backend
- The Backend is using an API to call to Moviesdb.org
***********************************************************
### Run the back-end web server

```bash
cd backend
```

Then install the dependencies and start the application:

```bash
yarn install
MOVIE_API_KEY=[YOUR KEY] yarn start
```


### Run the front-end web

```bash
cd client
```

Then install the dependencies and start the application:

```bash
yarn install
yarn start
```

You can now visit the server at [http://localhost:3000](http://localhost:3000).
