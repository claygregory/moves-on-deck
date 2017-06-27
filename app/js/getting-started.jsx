import React from 'react';

export default class GettingStarted extends React.PureComponent {
  render() {
    return (
      <div className="get-started">
        <p>Export your history from your <a href="https://accounts.moves-app.com/">Moves-App account page</a>, then
        drag and drop your <b>storyline.json</b> here to get started.</p>

        <p>Don't worry, everything runs locally in your browser. No sensitive data is uploaded.</p>

        <footer>
          <p>
            Built by <a href="https://claygregory.com/">Clay Gregory</a>. Full source code available on <a href="https://github.com/claygregory/moves-on-deck">GitHub</a>.
            Map tiles by <a href="https://www.mapbox.com">Mapbox</a>.
            Icons by <a href="https://icons8.com/">Icons8</a>.
          </p>
        </footer>
      </div>
    );
  }
}