import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      isSignedIn: false,
    }
    this.googleAuth;
  }

  componentDidMount() {
    // initialize google api on load
    this.initGapi()
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to StreamViewer</h1>
        </header>
        {
          !this.state.loading &&
          !this.GoogleAuth.isSignedIn.get() && 
          <button onClick={this.logIn} className="App-intro">
            Please log in with Google+
          </button>
        }
      </div>
    );
  }
  
  logIn = () => {
    this.GoogleAuth.signIn()
  }
  
  updateSigninStatus = (isSignedIn) => {
    if (isSignedIn) {
      this.setState({ isSignedIn })
      console.log('logged in');
    } else {
      this.setState({ isSignedIn })
      console.log('not logged in');
    }
  }
  
  initGapi = () => {
    // create a script tag that loads gapi
    // then runs onLoadGapi when done
    const gapiScript = document.createElement('script')
    gapiScript.src = '//apis.google.com/js/client:platform.js'
    gapiScript.onload = this.onLoadGapi
    gapiScript.async = 'async'
    gapiScript.defer = 'defer'
    document.getElementById('root').append(gapiScript)
  }
  
  onLoadGapi = () => {
    window.gapi.load('client:auth2', this.initClient);
  }
  
  initClient = () => {
    // send tokens to google to initialize
    window.gapi.client.init({
      'apiKey': process.env.REACT_APP_API_KEY,
      'clientId': process.env.REACT_APP_CLIENT_ID,
      'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
    }).then(() => {
      this.GoogleAuth = window.gapi.auth2.getAuthInstance();
      this.GoogleAuth.isSignedIn.listen(this.updateSigninStatus);
      this.setState({ loading: false })
    })
  }
}

export default App;
