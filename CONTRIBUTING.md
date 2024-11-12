# Contributing

> 💡 This contributing guide is coding related. For philosophy and other
> literary related matters, see
> [our contributing guide](https://sphil.xyz/docs/contributing)

Welcome to the sPhil repository. We're happy you're here and would like to
contribute to the project! We hope this guide will get you up to speed with the
workings of the web application and help you set up your own local development.

## Overview

_TODO_

## 🧑‍💻 Local Development

The web app requires a number of API keys to function properly. However, not all
these are required for most development. Below is first a minimal subset to run
most functionality, followed by a full scope.

After you have forked and cloned the repository to your machine, begin by
creating a `.env` in the project root. Observe `.env.example` for a list of key
names and copy over at least the minimal set.

### Minimal Environment

Minimal environment will require these env vars:

-   `NEXT_PUBLIC_SITE_ROOT` Copy this from `env.example`
-   `NEXT_PUBLIC_GA_ID` Copy this from `env.example`
-   `DATABASE_URL`
-   `AUTH_SECRET`
-   `AUTH_GITHUB_ID`
-   `AUTH_GITHUB_SECRET`
-   `GCP_PRIMARY_BUCKET_NAME`
-   `GCP_SECONDARY_BUCKET_NAME`
-   `GCP_BUCKET_HANDLER_KEY`

#### 🐱 Git prerequisites

1. Once you have access to the repo on github, fork and/or clone it into a
   folder where you keep your projects.
1. Then `cd sphil` to get into the project directory.
1. Make your own development branch `git checkout -b dev-<your-name>` (example:
   `git checkout -b dev-tim`).
1. In future, when getting the latest changes from the main development branch,
   run `git merge main` whilst on your development branch to incorporate the
   changes into your branch.

#### 💾 Packages Installation

1. Once inside, run `npm i` (alias `npm install`) to install all the packages.
   This will create the `/node_modules` folder.

#### 🗃️ Setting up a database instance for local development (cockroachdb)

1. To download and install cockroachdb locally, follow these guides for your
   system:
    - [Download latest stable production release](https://www.cockroachlabs.com/docs/releases)
    - [Installation instructions](https://www.cockroachlabs.com/docs/v24.2/install-cockroachdb)
2. Verify installation was successful, running `cockroach demo` and inputting
   `SELECT ST_IsValid(ST_MakePoint(1,2));` into the interactive shell.
3. In a new terminal, start a single-node local instance (commands for Windows
   may vary). Make sure to input your user home directory.
    - ```sh
      cockroach start-single-node --insecure \
      --listen-addr=localhost:26257 \
      --http-addr=localhost:8080 \
      --store=path=/home/YOUR_USER/cockroach-data,size=2GB
      ```
4. From the standard output, make sure to extract and save the `sql:` path for
   the `DATABASE_URL` for the `.env`. It starts with `postgresql://`.
5. With the db instance running, you can check if Prisma is able to connect with
   it and migrate its schemas. Run `npx prisma db push`.

#### Authentication setup

1. `AUTH_SECRET` can be any random string. You can use `openssl rand -base64 32`
   to generate one.
2. For the Github credentials, begin by going to
   [github developer settings](https://github.com/settings/developers)
3. Create a new OAuth app
4. Ensure these fields are populated as follows:
    - Homepage URL: `http://localhost:3000`
    - Authorization callback URL:
      `http://localhost:3000/api/auth/callback/github`
5. Once created, retrieve the Github ID and Secret and define the Github keys.
