#!/bin/bash

sleep 2

mongo --host routedb --eval "db.getSiblingDB("$MONGODB_DATABASE").createUser({user: "$MONGODB_USER", pwd: "$MONGODB_PASS", roles:[{role: readWrite, db: "$MONGODB_DATABASE"}]})"
