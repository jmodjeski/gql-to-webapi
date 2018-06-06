#!/bin/sh

docker run --rm --name ef-data-api -v"$PWD/pgdata":/var/lib/postgresql/data -p 5432:5432 -d postgres:alpine

