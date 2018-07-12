import React from 'react'
import Home from './Home'

export default class Main extends React.Component {
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
    if (!this.props.currentUser) {
      return (
        <button onClick={this.logIn} className="App-intro">
          Please log in with Google+
        </button>
      )
    }
    
    switch (window.location.hash) {
      case '#home':
        return <Home />
        break;
      default:
        console.log("BYE");
    }
  }
  
  logIn = () => {
    this.GoogleAuth.signIn()
  }
}
