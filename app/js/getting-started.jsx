import React from 'react';

export default class GettingStarted extends React.PureComponent {
  render() {
    return (
      <div className="get-started">
        <p>
          Moves On Deck is a WebGL-powered visualization of your <a href="https://www.moves-app.com/">Moves</a> location history.
        </p>

        <h3>Getting Started</h3>
        <p>Export your history from your <a href="https://accounts.moves-app.com/">Moves account</a>, extract the JSON archive, and then
        drag and drop your <em>storyline.json</em> here.</p>

        <h3>Privacy</h3>
        <p>All data processing runs locally, right in your browser. So don't worry, no sensitive data will be uploaded.</p>

        <footer className="credits">
          <p>
            Built by <a href="https://claygregory.com/">Clay Gregory</a>. Full source code available on <a href="https://github.com/claygregory/moves-on-deck">GitHub</a>.
            Map layer by <a href="https://www.mapbox.com">Mapbox</a>.
            Icons by <a href="https://icons8.com/">Icons8</a>.
          </p>
        </footer>
      </div>
    );
  }
}