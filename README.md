# tomatl

## What's this?

It's a little pomodoro timer with space for notes (one space for present task + one space for larger context). It also has sound + notifications, and auto-saves your notes to local storage. The project dependencies (react, tone, etc) are definitely gratuitous for this kind of thing, but it makes the project very easy to experiment with (which was very much the point).

You can give it a look at [helioscope.github.io/tomatl](https://helioscope.github.io/tomatl)


## Getting started

* Install (if you haven't already):
    * [Node.js](http://nodejs.org)
    * (TOTALLY OPTIONAL) [Brunch](http://brunch.io): `npm install -g brunch`
    * App dependencies: `npm install`
* Run:
    * `npm run start` — watches the project with continuous rebuild. This will also launch HTTP server with [pushState](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history).
    * `npm run build` — builds minified project for production
* Notes:
    * Write your code in the `app/` directory.
    * `public/` dir is fully auto-generated and served by HTTP server.
    * Place static files you want to be copied to `public` as-is in `app/assets/`.
    * All scss/css is bundled into a single css file that index.html imports, so there's no need to require the scss/css files individually in each component.
* Other info:
    * [Brunch site](http://brunch.io), [Brunch "Getting started" guide](https://github.com/brunch/brunch-guide#readme)
    * This started with the `brunch/with-react` Brunch "skeleton," then added SASS support.


## To Do:

* Update dependencies. They are egregiously out of date now.


## Extra rambling

I made this after becoming a parent and have used it more or less daily for a few years. Meant to put it on GitHub originally, but ended up just leaving it running locally. Code & dependencies are a bit dusty (it's been a few years).

"Tomatl" is the Aztec word for "tomato," if Wikipedia can be trusted on the matter. Either way it's fun to say.
