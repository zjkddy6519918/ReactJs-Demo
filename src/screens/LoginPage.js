import React, { Component } from 'react';
import LoginForm from '../components/LoginForm';
import pathConstants from '../constants/pathConstants'

class LoginPage extends Component {
  constructor(props) {
    super(props);
    localStorage.clear();
  }

  /**
   * Go to home when login is successful
   */
  onLoginSuccess = () => {
    this.props.history.push(pathConstants.HOME);
  };

  /**
   * Default function that will tell React what HTML to render
   */
  render() {
    return (
      <div>
        <h1>Login Page</h1>
        <LoginForm onLoginSuccess={this.onLoginSuccess} />
      </div>
    );
  }
}

export default LoginPage;
