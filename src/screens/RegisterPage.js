import React, { Component } from 'react';
import pathConstants from '../constants/pathConstants';
import RegisterForm from "../components/RegisterForm";
import { message } from 'antd';

class RegisterPage extends Component {
  render() {
    return (
      <div>
        <h1>Register Page</h1>
        <RegisterForm onRegisterSuccess={this.onRegisterSuccess}/>
      </div>
    );
  }

  /**
   * Go back to login when register is successful so that user can verify their
   * email and password to login to the system.
   */
  onRegisterSuccess = () => {
    this.props.history.push(pathConstants.LOGIN);
    message.info('User has been registered successfully, you can now login.')
  };
}

export default RegisterPage;
