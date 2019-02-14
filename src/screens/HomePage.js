import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import localConst from '../constants/localStorageConstants';
import pathConstants from "../constants/pathConstants";

class HomePage extends Component {
  constructor(props) {
    super(props);

    const userDetails = JSON.parse(localStorage.getItem(localConst.USER));
    this.state = {
      isAdmin: userDetails.isAdmin,
      name: userDetails.name
    };
  }

  renderAdminOptions = () => {
    return (
      <div>
        <h1>Hello Admin {this.state.name}</h1>
        <Link to={'/' + pathConstants.PROFILE} >View your profile</Link>
        <br />
        <Link to={'/' + pathConstants.VIEW_BOOKING} >View your bookings</Link>
      </div>
    );
  };

  renderCustomerOptions = () => {
    return (
      <div>
        <h1>Hello {this.state.name}</h1>
        <Link to={'/' + pathConstants.BOOKING} >Make a booking</Link>
        <br />
        <Link to={'/' + pathConstants.PROFILE} >View your profile</Link>
        <br />
        <Link to={'/' + pathConstants.VIEW_BOOKING} >View your bookings</Link>
      </div>
    );
  };

  render() {
      return (this.state.isAdmin ?
        this.renderAdminOptions() :
        this.renderCustomerOptions());
  }
}

export default HomePage;
