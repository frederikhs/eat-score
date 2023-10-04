#!/bin/bash
set -e

TMP_DIR=$(mktemp -d)

if [ ! -e "$TMP_DIR" ]; then
    >&2 echo "failed to create tmp directory"
    exit 1
fi

pre_exit() {
  rm -r $TMP_DIR
}

trap pre_exit EXIT

PASS=$1

usage() {
  echo "usage: $0 <PASS>"
  exit 1
}

if [ "$#" -ne 1 ]; then
  usage
  exit 1
fi

echo "192.168.1.231:5432:*:hrgn:$PASS" > $TMP_DIR/.pgpass

docker build \
  --secret id=pgpass,src=$TMP_DIR/.pgpass \
  -t eat-score-db-with-data \
  --no-cache \
  .
