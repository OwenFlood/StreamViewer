import React from 'react'
import Home from './Home'
import Watch from './Watch'
import Api from '../Api'

export default class Router extends React.Component {
  render() {
    return (
      <div>
        {this.renderContent()}
      </div>
    );
  }
  
  renderContent = () => {
    // In the interest of time, I wrote a quick
    // router. I would normally use a library like
    // ReactNavigation.
    if (!this.props.currentUser.w3) {
      return (
        <button onClick={this.logIn} className="App-intro">
          Please log in with Google+
        </button>
      )
    }

    switch (window.location.pathname) {
      case '/home':
        return <Home currentUser={this.props.currentUser} />
      case '/watch':
        return <Watch currentUser={this.props.currentUser} />
      default:
        console.log("BYE");
    }
  }
  
  logIn = async () => {
    // wait until the user completes their sign in before continuing.
    const user = await this.props.googleAuth.signIn()
    // ^ if the user exits early, the function throws an exception
    // and the rest of the function is not run
    Api.logIn(user)
    // log in, then redirect to home page
    window.location = '/home'
  }
}
