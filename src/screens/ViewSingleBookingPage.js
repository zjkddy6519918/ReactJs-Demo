import React, { Component } from 'react';
import BookingAck from '../components/BookingAck'
import BookingTable from '../components/BookingTable';
import localConst from "../constants/localStorageConstants";
import {message} from "antd/lib/index";
import PropTypes from "prop-types";

class ViewSingleBookingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isViewingBookingAck: false,
      currentBookingForAck: {}
    }
  }

  renderBookingAckPage = () => {
    return (
      <div>
        <h1>Booking Details</h1>
        <BookingAck booking={this.state.currentBookingForAck} onBookingAckSuccess={this.onBookingAckSuccess} onBackPressed={this.onBookingAckBackPressed} />
      </div>
    );
  };

  renderBookingTablePage = () => {
    return (
      <div>
        <h1>Your booking</h1>
        <BookingTable onViewBookingAck={this.onViewBookingAck} bookingId={this.props.bookingId} />
      </div>
    );
  };

  render() {
    return (this.state.isViewingBookingAck ? this.renderBookingAckPage() : this.renderBookingTablePage())
  }

  onBookingAckSuccess = () => {
    console.log('Successful booking ack!');
    this.setState({
      isViewingBookingAck: false
    });
    message.info('Booking details has been updated!')
  };

  onViewBookingAck = (booking) => {
    this.setState({
      isViewingBookingAck: true,
      currentBookingForAck: booking
    })
  };

  onBookingAckBackPressed = () => {
    this.setState({
      isViewingBookingAck: false
    });
  };
}

// BookingAck.propTypes = {
//   bookingId: PropTypes.string.isRequired,
// };

export default ViewSingleBookingPage;
