import React, { Component } from 'react';
import BookingAck from '../components/BookingAck'
import BookingTable from '../components/BookingTable';
import localConst from "../constants/localStorageConstants";
import {message} from "antd/lib/index";

class ViewBookingPage extends Component {
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
          <BookingAck booking={this.state.currentBookingForAck} onBookingAckSuccess={this.onBookingAckSuccess} onBackPressed={this.onBookingAckBackPressed}/>
        </div>
      );
    };

    renderBookingTablePage = () => {
      const user = JSON.parse(localStorage.getItem(localConst.USER)) || {};

      return (
        <div>
          <h1>{user.isAdmin ? "Your booking requests" : "You bookings"}</h1>
          <BookingTable onViewBookingAck={this.onViewBookingAck} />
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

export default ViewBookingPage;
