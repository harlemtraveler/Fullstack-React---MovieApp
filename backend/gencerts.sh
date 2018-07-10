#!/bin/bash

PASS="fullstack"

C="US"
ST="CA"
L="CA"
O="Fullstack.io"
OU="IT Department"
CN="fullstack.io"

# openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365
# openssl rsa -in key.pem -out newkey.pem && mv newkey.pem key.pem

openssl req -x509 \
        -nodes \
        -newkey rsa:2048 \
        -keyout key.pem \
        -out cert.pem \
        -subj "/C=$C/ST=$ST/L=$L/O=$O/OU=$OU/CN=$CN" \
        -days 365

# echo $PASS | openssl rsa \
#         -in key.pem \
#         -out newkey.pem && mv newkey.pem key.pem

# openssl genrsa -aes256 -out server.pass.key -passout pass:$PASS 1024
# openssl rsa -in server.pass.key \
#         -passin pass:$PASS \
#         -out server.key
# rm server.pass.key

# openssl req -new \
#         -key server.key \
#         -out key.pem \
#         -subj "/C=$C/ST=$ST/L=$L/O=$O/OU=$OU/CN=$CN"

# openssl x509 -req -days 365 \
#         -in key.pem \
#         -signkey server.key \
#         -keyout
#         -out cert.pem

# openssl genrsa -des3 -passout pass:x -out server.pass.key 2048
# openssl rsa -passin pass:x -in server.pass.key -out server.key
# rm server.pass.key
# openssl req -new -key server.key -out server.csr \
#   -subj "/C=$C/ST=$ST/L=$L/O=$O/OU=$OU/CN=$CN"
# openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt


# openssl req -new -key lib/client1.key -subj req -new \
#     -passin pass:client11 -out lib/client1.csr \
#     -subj "/C=US/ST=New Sweden/L=Stockholm/O=.../OU=.../CN=.../emailAddress=..."