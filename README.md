# 🚧 This is a work in progress

If you'd like to be part of the development of sPhil, kindly follow the
instructions below. If you have any further questions or would like to get
involved,
[get in touch with Filip (Firgrep) here](mailto:service@systemphil.com).

## Setting up your local development environment

### Setting up a database instance for local development (cockroachdb)

1. To download and install cockroachdb locally, follow these guides for your
   system:
    - [Download latest stable production release](https://www.cockroachlabs.com/docs/releases)
    - [Installation instructions](https://www.cockroachlabs.com/docs/v24.2/install-cockroachdb)
2. Verify installation was successful, running `cockroach demo` and inputting
   `SELECT ST_IsValid(ST_MakePoint(1,2));` into the interactive shell.
3. Start a single-node local instance (commands for Windows may vary). Make sure
   to input your home directory.
    - ```sh
      cockroach start-single-node --insecure \
      --listen-addr=localhost:26257 \
      --http-addr=localhost:8080 \
      --store=path=/home/YOUR_USER/cockroach-data,size=2GB
      ```
4. From the standard output, make sure to extract and save the `sql:` path for
   the `DATABASE_URL` for the `.env`. Starts with "postgresql://".

## Setting up your local environment and branch

0.0. Once you have access to the repo on github, fork and/or clone it into a
folder where you keep your projects.

0.1. Then `cd sphil` to get into the project directory.

0.2. Make your own development branch `git checkout -b dev-<your-name>`
(example: `git checkout -b dev-tim`).

0.3. In future, when getting the latest changes from the main development
branch, run `git merge main` whilst on your development branch to incorporate
the changes into your branch.

### Packages Installation

1.0. Once inside, run `npm i` (alias `npm install`) to install all the packages.
This will create the `/node_modules` folder.

### Environmental Variables

2.0. There are no environmental variables! This is a static website. (Caveat: we
defined some public variables depending on where the site is hosted.)

### Running the Server

9.9. Finally, to start a local development server, run `npm run dev` and open up
`http://localhost:3000` on your favorite browser.

-   Whenever you make any edits to the source files while the server is running,
    the server will pick up those changes and output them immediately. This is
    extremely handy during development, as you can input code and hit `ctrl` +
    `k` then `s` (save-all) and view directly your latest changes.
-   To terminate the server, hit `ctrl` + `c` on your keyboard whilst in the
    terminal where the server runs, input `y` when prompted to terminate batch
    job.

> ❗ You may get an error (e.g. `useRef` is `null`) as your development server
> refreshes. This is likely due to how `nextra` processes the `mdx` files.
> Perform a hard refresh (hit `F5`) to resolve this.

## License

All files and content under `/src/pages`, with the exception of
`/src/pages/_app.mdx`, `/src/pages/_document.tsx`,
`/src/pages/acknowledgements.tsx`, `/src/pages/index.mdx`,
`/src/pages/privacy.tsx`, `/src/pages/team.mdx`, `/src/pages/terms.mdx`, any
files within `src/pages/contributing` folder and any `_meta.json` files, are
subject to Attribution-NonCommercial-ShareAlike 4.0 International License. The
rest follows Apache License Version 2.0, January 2004.
