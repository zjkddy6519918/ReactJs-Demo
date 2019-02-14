import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import pathConstants from '../constants/pathConstants';
import UserProfile from "../components/UserProfileForm";
import { message } from 'antd';

class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false
    };
  }

  render() {
    return (
      <div>
        <h1>Profile Page</h1>
        <Link to={'/' + pathConstants.HOME} >Go back to home</Link>
        <UserProfile isEditing={this.state.isEditing} onProfileUpdated={this.onProfileUpdated} />
      </div>
    );
  }

  /**
   * Go back to home when user has successfully updated their profile.
   */
  onProfileUpdated = () => {
    this.props.history.push(pathConstants.HOME);
    message.info('User profile has been updated successfully.')
  };
}

export default RegisterPage;
