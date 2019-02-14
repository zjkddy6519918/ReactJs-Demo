import React, { Component } from 'react';
import BookingForm from "../components/BookingForm";
import pathConstants from "../constants/pathConstants";
import {message} from "antd";

class BookingPage extends Component {
    render() {
        return (
            <div>
                <h1>Booking Page</h1>
                <BookingForm onBookingSuccess={this.onBookingSuccess}/>
            </div>
        );
    }

    onBookingSuccess = () => {
        this.props.history.push(pathConstants.HOME);
        message.info('User has booked a request successfully!')
    };
}

export default BookingPage;
