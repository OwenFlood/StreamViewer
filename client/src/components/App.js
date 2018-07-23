import React from 'react'
import '../styles/App.css'
import {
  Navbar,
  Nav,
  NavItem,
} from 'react-bootstrap'
import Router from './Router'

export default class App extends React.Component {
  state = {
    loading: true,
    isSignedIn: false,
    currentUser: null,
    locationChange: true, // this state is just to trigger reload on location change
  }

  componentDidMount() {
    // initialize google api on load
    this.initGapi()
    // attach listener to location change to reload content
    window.addEventListener("hashchange", this.onLocationChange, false)
  }
  
  render() {
    return (
      <div className="App">
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/home">
                StreamViewer
              </a>
            </Navbar.Brand>
          </Navbar.Header>

          <Navbar.Collapse>
            <Nav pullRight>
              {this.renderSignedIn()}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {this.renderMain()}
      </div>
    );
  }
  
  renderMain = () => (
    this.state.loading ?
      <div>Loading...</div> :
      <Router
        key={this.state.locationChange}
        googleAuth={this.state.googleAuth}
        currentUser={this.state.currentUser} />
  )
  
  renderSignedIn = () => {
    if (window.gapi && window.gapi.auth2.getAuthInstance().isSignedIn.Ab) {
      return (
        <NavItem onClick={this.signOut}>
          Sign Out
        </NavItem>
      )
    }
  }
  
  signOut = () => {
    window.gapi.auth2.getAuthInstance().disconnect()
    window.location = '/home'
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
      apiKey: process.env.REACT_APP_API_KEY,
      clientId: process.env.REACT_APP_OAUTH_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/youtube.force-ssl',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
    }).then(() => {
      let googleAuth = window.gapi.auth2.getAuthInstance();
      googleAuth.isSignedIn.listen(this.updateSigninStatus);
      this.setState({
        loading: false,
        currentUser: googleAuth.currentUser.get(),
        googleAuth,
      })
    })
  }
  
  updateSigninStatus = (isSignedIn) => {
    if (isSignedIn) {
      this.setState({ isSignedIn })
    } else {
      this.setState({ isSignedIn })
    }
  }
  
  onLocationChange = () => {
    this.setState({ locationChange: !this.state.locationChange })
  }
}
