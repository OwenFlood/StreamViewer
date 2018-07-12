import React from 'react'
import '../styles/App.css'
import { Navbar } from 'react-bootstrap'
import Main from './Main'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      isSignedIn: false,
      currentUser: null,
      locationChange: true, // this state is just to trigger reload on location change
    }
    this.GoogleAuth;
  }

  componentDidMount() {
    // initialize google api on load
    this.initGapi()
    // attach listener to location change to reload content
    window.addEventListener("hashchange", this.onLocationChange, false)
  }
  
  render() {
    console.log('current user: ', this.state.currentUser);
    return (
      <div className="App">
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#home">
                StreamViewer
              </a>
            </Navbar.Brand>
          </Navbar.Header>
        </Navbar>
        {this.renderMain()}
      </div>
    );
  }
  
  renderMain = () => (
    this.state.loading ?
      <div>I'm loading!</div> :
      <Main key={this.state.locationChange} currentUser={this.state.currentUser} />
  )
  
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
      this.setState({
        loading: false,
        currentUser: this.GoogleAuth.currentUser.get(),
      })
    })
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
  
  onLocationChange = () => {
    this.setState({ locationChange: !this.state.locationChange })
  }
}
