#!/bin/sh

set -e

echo "run migration"
yarn migration:run

echo "start application"
exec $@