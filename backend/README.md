## Simple express demo movies server

## Quickstart

To boot this server up, you'll need to install [Node.JS](https://nodejs.org). Using [yarn](https://yarnpkg.com/) or npm, install the dependencies:

```shell
yarn install
# or
npm install
```

Boot the server:

```shell
yarnpkg start
# or
npm start
```

## Interacting with the server

```shell
URL='http://localhost:3456'
# or
URL='https://loginserver-ktpvnkkdau.now.sh'
DATA='{"email":"youremail","password":"yourpassword"}'
```

## Get the routes

```shell
curl \
  -H "Accept: application/json" \
  -H "Content-type: application/json" \
  -XGET $URL/routes
```

## Create a user:

```shell
curl \
  -H "Accept: application/json" \
  -H "Content-type: application/json" \
  -XPOST \
  -d $DATA $URL/signup
```

## Login with the user

Login and get the token

```shell
TOKEN=$(curl \
  -H "Accept: application/json" \
  -H "Content-type: application/json" \
  -XPOST \
  -d $DATA $URL/login | jq -r ".token")
echo $TOKEN
```

## Get my details

```shell
curl \
  -H "Accept: application/json" \
  -H "Content-type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -XGET $URL/me
```

## Update the user

```shell
curl \
  -H "Accept: application/json" \
  -H "Content-type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"zipcode":"94110"}' \
  -XPUT $URL/me
```

## Get sensitive data

```shell
curl -H "Authorization: Bearer $TOKEN" $URL/secret
```

## Get movies

```shell
curl -H "Authorization: Bearer $TOKEN" $URL/movies
```

## Get movie information

```shell
curl -H "Authorization: Bearer $TOKEN" $URL/movies/14564
```

## Get movie trailers

```shell
curl -H "Authorization: Bearer $TOKEN" $URL/movies/14564/trailers
```

## Get movie genres

```shell
curl -H "Authorization: Bearer $TOKEN" $URL/genres
```

## Get movies for genre

```shell
curl -H "Authorization: Bearer $TOKEN" $URL/genres/9648
```


## Add a favorite movies

```shell
curl -XPOST \
  -H "Accept: application/json" \
  -H "Content-type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d'{"movie_id":"346685"}' $URL/me/movies
```

## Remove a favorite


```shell
curl -X DELETE \
  -H "Accept: application/json" \
  -H "Content-type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  $URL/me/movies/f85aecb0-e951-11e6-83e8-c9addd120cbf
```

## Get the current time

```shell
curl -XGET \
  -H "Accept: application/json" \
  -H "Content-type: application/json" \
  $URL/time
```

## Socket.io

The endpoint supports socket.io (currently only one channel, but the entire movies api is planned). Currently, the `/time` group is the only supported group.

## Server-sent events

The demo endpoint right now is available at:

`/time/subscribe`

To subscribe to updates on the endpoint:

```js
es = new EventSource(`${BASE_URL}/time/subscribe`);
es.addEventListener('tick_time', data => console.log(data))
// unsubscribe
es.close()
```