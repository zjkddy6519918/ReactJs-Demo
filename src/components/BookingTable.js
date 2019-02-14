import React, {Component} from 'react';
import PropTypes from 'prop-types';
import bookingUtils from '../utils/bookingUtils';
import {Table, Button} from 'antd';
import 'antd/dist/antd.css';
import './BookingForm.css';
import localConst from "../constants/localStorageConstants";

const userId = localStorage.getItem(localConst.USER_ID) || '';

class BookingTable extends Component {

  constructor(props) {
    super(props);

    this.state = {
      columns: this.createColumnHeaders(),
      bookingRequests: []
    };

    this.getBookings();
  }

  createColumnHeaders = () => {
    return [{
      title: 'Booking ID',
      dataIndex: 'booking.id',
      key: 'id'
    }, {
      title: 'Departure Date',
      dataIndex: 'departDate',
      key: 'departDate'
    }, {
      title: 'Arrival Date',
      dataIndex: 'arrivalDate',
      key: 'arrivalDate'
    }, {
      title: 'No. of Boxes',
      dataIndex: 'boxNumber',
      key: 'boxNumber'
    }, {
      title: 'Shipment Name',
      dataIndex: 'shipmentName',
      key: 'shipmentName'
    }, {
      title: 'Shipment Type',
      dataIndex: 'shipmentType',
      key: 'shipmentType'
    }, {
      title: 'Pickup Address',
      dataIndex: 'pickupAddress',
      key: 'pickupAddress'
    }, {
      title: 'Destination Address',
      key: 'destAddress',
      dataIndex: 'destAddress'
    }, {
      title: 'Message (to Shipper)',
      key: 'message',
      dataIndex: 'message'
    }, {
      title: 'Status',
      key: 'status',
      dataIndex: 'booking.bookingAck.status'
    }, {
      title: 'Action',
      key: 'booking',
      dataIndex: 'booking',
      render: (booking) => (
        <Button onClick={() => {
          this.props.onViewBookingAck(booking);
        }}>View More</Button>
      ),
    }];
  };

  getBookings = () => {
    let findBookingsPromise;

    if (this.props.bookingId) {
      console.log('Getting booking for booking with ID: ' + this.props.bookingId);
      findBookingsPromise = bookingUtils.findBooking(this.props.bookingId);
    } else {
      console.log('Getting bookings for user with ID: ' + userId);
      const user = JSON.parse(localStorage.getItem(localConst.USER)) || {};
      findBookingsPromise = user.isAdmin ? bookingUtils.getAllBookings() : bookingUtils.findBookingForUser(userId);
    }

    findBookingsPromise
      .then((bookings) => {
        console.log(bookings);

        if (!Array.isArray(bookings)) {
          bookings = [bookings];
        }

        const requests = bookings.map((booking, index) => {
          const bookingRequest = Object.assign({
            key: index,
            booking: booking
          }, booking.bookingRequest);

          return bookingRequest;
        });

        this.setState({
          bookingRequests: requests
        })
      });
  };

  /**
   * Default function that will tell React what HTML to render
   */
  render() {
    return (
      <Table columns={this.state.columns} dataSource={this.state.bookingRequests} />
    )
  }
}

/**
 * List of properties that need to be passed to <BookingTable>
 */
BookingTable.propTypes = {
  onViewBookingAck: PropTypes.func.isRequired
};

export default BookingTable;
