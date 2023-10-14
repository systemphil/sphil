# 🚧 This is a work in progress

If you'd like to be part of the development of sPhil, kindly follow the instructions below. If you have any further questions or would like to get involved, [get in touch with Firgrep here](https://www.filipniklas.com/#/contact).

## Setting up your local environment and branch

0.0. Once you have access to the repo on github, fork and/or clone it into a folder where you keep your projects.

0.1. Then `cd sphil` to get into the project directory.

0.2. Make your own development branch `git branch dev-<your-name>` (example: `git branch dev-tim`).

0.3. Set the newly made development branch as the current active branch, run `git checkout <your-branch-name>`.

0.4. In future, when getting the latest changes from the main development branch, run `git merge dev` whilst on your development branch to incorporate the changes into your branch.

### Packages Installation

1.0. Once inside, run `npm i` (alias `npm install`) to install all the packages. This will create the `/node_modules` folder.

### Environmental Variables

2.0. There are no environmental variables! This is a static website. (Caveat: we defined some public variables depending on where the site is hosted.)

### Running the Server

9.9. Finally, to start a local development server, run `npm run dev` and open up `http://localhost:3000` on your favorite browser.

- Whenever you make any edits to the source files while the server is running, the server will pick up those changes and output them immediately. This is extremely handy during development, as you can input code and hit `ctrl` + `k` then `s` (save-all) and view directly your latest changes.
- To terminate the server, hit `ctrl` + `c` on your keyboard whilst in the terminal where the server runs, input `y` when prompted to terminate batch job.

> ❗ You may get an error (e.g. `useRef` is `null`) as your development server refreshes. This is likely due to how `nextra` processes the `mdx` files. Perform a hard refresh (hit `F5`) to resolve this.
