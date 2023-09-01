# Future Order Service

## Description

Order service repository using [Nest](https://nestjs.com) framework

## Installation

```bash
$ yarn install
```

## Setting up Rabbitmq

You can run the rabbitmq image via docker

## Setting up database

You can decide to install postgress locally or run it via docker

## Migrations

After successfully connecting to the database, you'll need to run migrations to populate the database with tables.

Use command

```bash
yarn migrate
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit and end-to-end tests
$ yarn test
```
