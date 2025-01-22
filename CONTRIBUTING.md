# Contributing

> 💡 This contributing guide is coding related. For philosophy and other
> literary related matters, see
> [our contributing guide](https://sphil.xyz/articles/contributing)

Welcome to the sPhil repository. We're happy you're here and would like to
contribute to the project! We hope this guide will get you up to speed with the
workings of the web application and help you set up your own local development.

## Overview

sPhil is a monolithic web app that uses Nextra.js to build its MDX contents and
Next.js to bundle and run the server. React.js is used both on the frontend and
backend, with Next's server actions to primarily handle client-server
communication.

Besides these and many other libraries, the code is structured according to
"feature based folder" paradigm to improve long-term maintainability and
developer sanity. There are three main groups at play:

- `/app` folder that deals with routing (special Next.js folder)
- `/lib` folder that contains code to be freely shared across the codebase.
- `/features` folder that contains specific feature-based code.

The idea is that `/app` can import from `/lib` and `/features`, but `/lib` does
not import from either, and `/features` can _only_ import from `/lib`.

```
Example of feature based folder structure with import paths flow

┌─────────────────────────┐           ┌──────────────────────────┐
│                         │           │                          │
│         /lib            │           │          /app            │
│   ┌─────────────────┐   │           │  ┌────────────────────┐  │
│   │   /components   │   ├──────────►│  │    /<routes>       │  │
│   └─────────────────┘   │           │  └────────────────────┘  │
│   ┌─────────────────┐   │           │                          │
│   │   /auth         │   │           │                          │
│   └─────────────────┘   │           └──────────────────────────┘
│   ┌─────────────────┐   │                        ▲
│   │   /server       │   │                        │
│   └─────────────────┘   │                        │
│   ┌─────────────────┐   │           ┌────────────┴─────────────┐
│   │   /hooks        │   │           │                          │
│   └─────────────────┘   │           │         /features        │
│   ┌─────────────────┐   │           │  ┌───────────────────┐   │
│   │   /utils        │   ├──────────►│  │     /courses      │   │
│   └─────────────────┘   │           │  └───────────────────┘   │
│   ┌─────────────────┐   │           │  ┌───────────────────┐   │
│   │   /database     │   │           │  │     /billing      │   │
│   └─────────────────┘   │           │  └───────────────────┘   │
│                         │           │                          │
└─────────────────────────┘           └──────────────────────────┘
```

Individual feature folders mimic the folder structure found in `/lib`, but
sometimes may have different requirements.

```
Example of a single feature folder (marketing) with its sub-folders

┌────────────────────────────┐
│         /marketing         │
│ ┌────────────────────────┐ │
│ │    /components         │ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │    /data               │ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │    /server             │ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │    /utils              │ │
│ └────────────────────────┘ │
│                            │
└────────────────────────────┘
```

The idea is that at any given time, when a developer is working on a feature,
she should _only_ have to deal with the logic internal to that feature and
whatever needed from the lib folder. When the feature is ready to be implemented
into the app, it should be a matter of relatively few imports into the app
folder.

Sharing code between features is **disallowed**! If it is discovered that a
piece of code from a feature should be shared with another, then it needs to be
elevated to the lib folder and imported back into the feature (e.g. as a
callback). Features should ever only concern themselves with their own internals
and what they need from the shared lib.

## Further Organizational Guidelines

- Server components, server cache and server actions are to be preferred over
  traditional client component and query hooks. Not only is this a faster way to
  implement code, but it comes with end-to-end type safety and is more
  performant. Where high interactivity is required, we will consider the
  traditional approach.
- Nextra.js is used to generate HTML out of the MDX files from the `/content`
  folder as well as handle routing and a majority of the styling. Additionally,
  we use DaisyUI, TailwindCSS and MUI but try to keep it in style with Nextra's.
  Ideally, we'd want less dependencies in the UI department, but we're open to
  new ideas.
- Prisma is used to interface with the database and to provide up-to-date type
  safety across the app. The major downside with Prisma is that it is
  query-heavy and not very performant. Currently, the DX is worth it but we may
  look into replacing it in the future with a more direct hands-on interface
  with the database.

## 🧑‍💻 Local Development

The web app requires a number of API keys to function properly. However, not all
these are required for most development. If you'd like to gain access to our
shared development environment, please get in touch service@systemphil.com or
[join our discord](https://discord.gg/2T4mPCCYhu) with an introduction of
yourself.

The remainder of this guide assumes you want to set up your own development
environment.

After you have forked and cloned the repository to your machine, begin by
creating a `.env` in the project root. Observe `.env.example` for a list of key
names and copy over at least the minimal set.

### Minimal Environment

Minimal environment will require these env vars:

- `NEXT_PUBLIC_SITE_ROOT` Copy this from `env.example`
- `NEXT_PUBLIC_GA_ID` Copy this from `env.example`
- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_GITHUB_ID`
- `AUTH_GITHUB_SECRET`
- `GCP_PRIMARY_BUCKET_NAME`
- `GCP_SECONDARY_BUCKET_NAME`
- `GCP_BUCKET_HANDLER_KEY`
- `STRIPE_API_KEY`

Note: without Stripe access, you won't be able to create or fully update
courses.

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

You can either [sign up on cockroachdb](https://www.cockroachlabs.com) to get a
serverless instance on the free tier or set up one locally.

1. To download and install cockroachdb locally, follow these guides for your
   system:
    - [Download latest stable production release](https://www.cockroachlabs.com/articles/releases)
    - [Installation instructions](https://www.cockroachlabs.com/articles/v24.2/install-cockroachdb)
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

#### 🔐 Authentication setup

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

#### 🪣 Buckets

Buckets are used for storage. We use GCP and they will likely incur some cost
for usage.

- ⚠️ The information in this section is sparse.

1. Two buckets are needed, one public and one restricted. However, both of these
   need to be handled by the same service account.
2. Start by [signing up to Google Cloud](https://cloud.google.com/).
3. Create a project.
4. Inside the project, navigate to storage (or search for it in the console).
5. Create two buckets, each _standard_, _single-region_ (preferably near you or
   near the database). For the bucket that will be public, turn off prevent
   public access.
6. Go to the bucket that is going to be public, and go to `permissions`, click
   `Grant Access`, input `allUsers` under "New principals" and for the role
   assign `Storage Object Viewer`. If you get a warning that you're making the
   bucket public, you're on the right track.
7. Put the names of the buckets as the local environment variables: the primary
   is the restricted one while the secondary is the public.
8. Now navigate to `Service Accounts` and create a new service account. Name it
   something recognizable and give it the following roles:
   `Service Account Token Creator`, `Service Account User` and
   `Storage Object Admin` (you can also assign these roles under `IAM` page).
9. With the service account created and ready, click on it and go to the `keys`
   tab where you will `add key`->`Create new key`. Select `JSON` and click
   `Create`. This will download a `.json` file. **DO NOT SHARE THIS WITH
   ANYONE**
10. Find the key file and base64 encode it. (On linux,
    `base64 key.json > key_base64.txt`). Copy the contents into the
    `GCP_BUCKET_HANDLER_KEY` env var (be sure to remove empty carriage returns
    and enclose the contents in quotes just in case).
11. That should be it! 🥳

#### 💵 Stripe

- ⚠️ The information in this section is sparse.

In order to create and fully update courses, a Stripe connection is needed. Sign
up an account on Stripe and set up a test environment. Get the API key and
populate the `STRIPE_API_KEY` env vars.

If you want to test checkouts, you must also create a webhook connection. To
test these locally, you must have the
[Stripe CLI](https://docs.stripe.com/stripe-cli) running simultaneously with
your app. Once you have the Stripe CLI installed and authenticated, we have a
shortcut you can use from the project: `npm run stripe:listen`.

#### 📧 Resend

- ⚠️ The information in this section is sparse.

We use Resend to handle emails. You will need to set up an account there and
generate API keys. Possibly you may need a domain as well.
