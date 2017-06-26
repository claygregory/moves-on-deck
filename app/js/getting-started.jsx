import React from 'react';

export default class GettingStarted extends React.PureComponent {
  render() {
    return (
      <div className="get-started">
        <h2>Get Started</h2>
        <p>Export your history from your <a href="https://accounts.moves-app.com/">Moves-App account page</a>, then
        drag and drop your <b>storyline.json</b> here to get started.</p>

        <p>Don't worry, everything runs locally in your browser. No sensitive data is uploaded.</p>

        <p>Source code is available on <a href="https://github.com/claygregory">GitHub</a></p>
      </div>
    );
  }
}