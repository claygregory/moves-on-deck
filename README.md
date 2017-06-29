
# Moves On Deck

Moves On Deck is a WebGL-powered visualization of your [Moves-App](https://www.moves-app.com/) location history, built with React and Uber's deck.gl framework.

## Usage

This project is currently available at <https://projects.claygregory.com/moves-on-deck/>. Data processing is entirely client-side in browser, so there's no need to deploy your own copy if just interested as an end-user.

<img src="./screenshots/screenshot-1.png" width="100%"/>

## Development

If you're interested in local development, the provided Gulpfile will allow you build and run your own copy. However, you'll need to supply your own Mapbox API key.

### Setup

From the project root, install the required dependencies with either NPM or Yarn:
```bash
npm install
```
or
```bash
yarn
```

### Running Locally

By default, Gulp will build the project and launch a local webserver on port 8000 with hot-reloading enabled. To use the Mapbox layer, you'll need to supply your own Mapbox API key, via the `MAPBOX_ACCESS_TOKEN` environmental variable. Your can request a free key from [Mapbox](https://www.mapbox.com) for limited usage.
```bash
MAPBOX_ACCESS_TOKEN=your_token gulp
```

### Production Build

As with above, you'll need a Mapbox API key. The value in the `MAPBOX_ACCESS_TOKEN` environmental variable will be statically inlined to your production build using [envify](https://github.com/hughsk/envify), ready for distribution. Running with `--type=production` will also compress and uglify the build:
```bash
MAPBOX_ACCESS_TOKEN=your_token gulp --type=production build
```

 The contents of the `dist` directory are then ready to deploy to a static web server.

## License

See the included [LICENSE](LICENSE.md) for rights and limitations under the terms of the MIT license.