import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import bookingUtils from '../utils/bookingUtils';
import { DatePicker, TimePicker, Form, Button, Input, Select, message } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import './BookingAck.css';
import localConst from "../constants/localStorageConstants";
import userUtils from "../utils/userUtils";
import _ from 'underscore';

const user = JSON.parse(localStorage.getItem(localConst.USER)) || {};
const FormItem = Form.Item;

class BookingAck extends Component {

  /* Store old booking for email */
  oldBooking = {};

  constructor(props) {
    super(props);

    this.state = {
      booking: props.booking,
      customer: {},
      user: JSON.parse(localStorage.getItem(localConst.USER)) || {}
    };

    this.oldBooking = props.booking;
    this.getCustomerInformation(props.booking.bookingRequest.userId);
  }

  disabledDate = (value) =>{
    return value && value.valueOf() < Date.now();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Validated booking ack input, values: ', values);
        this.updateBookingAck(values);
      } else {
        console.log('Failed booking ack validation, err: ', err);
      }
    });
  };

  updateBookingAck = (bookingAck) => {
    const customer = this.state.customer;

    console.log('The customer is: ', customer);

    bookingUtils.updateBookingAck(this.state.booking.id, bookingAck)
      .then((result) => {
        console.log('Updated booking ack, values: ', result);

        /* Get booking changes and only send email if there are changes made to booking ack */
        const oldBookingAck = this.oldBooking.bookingAck || {};
        const bookingChanges = _.omit(result.bookingAck, (value, key) => {
          return oldBookingAck[key] === value;
        });
        if (bookingChanges != {}) {
          console.log('Bookings changes: ', bookingChanges);
          this.sendEmail(this.oldBooking, result, bookingChanges, customer);
        } else {
          console.log('No booking changes');
        }

        this.props.onBookingAckSuccess();
      })
      .catch((error) => {
        console.log('Failed to update booking ack, error: ' , error);
        message.error(error.message);
      })
  };

  getCustomerInformation = (userId) => {
    userUtils.findUserWithId(userId)
      .then((result) => {
        console.log('User for this booking: ', result);
        this.setState({
          customer: result
        });
      })
      .catch((error) => {
        console.log('Failed to get user for booking ack, error: ' , error);
      })
  };

  getBookingCost = () => {
    const boxNumber = this.state.booking.bookingRequest.boxNumber || 0;
    const cost = 35;

    return boxNumber * cost;
  };

  /**
   * Default function that will tell React what HTML to render
   */
  render(){
    const Option = Select.Option;
    const { getFieldDecorator } = this.props.form;
    /* Layout properties for <FormItem>. Here used to make the input label align
     * to the same line as the input field. */
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return(
      <Form onSubmit={this.handleSubmit.bind(this)} className="booking-form">

        <a href="#" onClick={this.props.onBackPressed}>Back</a>

        <FormItem {...formItemLayout} label="Shipping Status">
          {getFieldDecorator('status', {
            initialValue: this.props.booking.bookingAck.status || 'To be Approved'
          })
          (<Select disabled={!this.state.user.isAdmin}>
            <Option value='To be Approved'>To be Approved</Option>
            <Option value='Request Accepted'>Request Accepted</Option>
            <Option value='Pick-up Scheduled'>Pick-up Scheduled</Option>
            <Option value='To be Shipped'>To be Shipped</Option>
            <Option value='Shipped'>Shipped</Option>
            <Option value='Arrived at Destination'>Arrived at Destination</Option>
            <Option value='Delivered'>Delivered</Option>
            <Option value='Delivery Delayed'>Delivery Delayed</Option>
          </Select>)}
        </FormItem>

        <FormItem {...formItemLayout} label="Pickup date">
          {getFieldDecorator('pickupDate', {
            rules : [{
              required : true , message: (
                !this.state.user.isAdmin ?
                  'Pickup date not yet supplied' :
                  'Please select a pickup date!'
              )
            }],
            initialValue: this.props.booking.bookingAck.pickupDate ?
              moment(this.props.booking.bookingAck.pickupDate) :
              null
          })
          (<DatePicker style={{width: "100%"}} disabled={!this.state.user.isAdmin} disabledDate={this.disabledDate}/>)}
        </FormItem>

        <FormItem {...formItemLayout} label="Pickup time">
          {getFieldDecorator('pickupTime', {
            rules : [{
              required : true , message: (
                !this.state.user.isAdmin ?
                  'Pickup time not yet supplied' :
                  'Please select a pickup time!'
              )
            }],
            initialValue: this.props.booking.bookingAck.pickupTime ?
              moment(this.props.booking.bookingAck.pickupTime, 'HH:mm:ss') :
              null
          })
          (<TimePicker style={{width: "100%"}} disabled={!this.state.user.isAdmin} />)}
        </FormItem>

        <FormItem {...formItemLayout} label="Cost ($35/box)">
          {getFieldDecorator('cost', {
            initialValue: '$' + this.getBookingCost()
          })
          (<Input placeholder='Cost' disabled={true} />)}
        </FormItem>

        <FormItem {...formItemLayout} label="HBL Number">
          {getFieldDecorator('hblNumber',{
            initialValue: this.props.booking.bookingAck.hblNumber
          })
          (<Input placeholder='HBL Number' disabled={!this.state.user.isAdmin} />)}
        </FormItem>

        <FormItem {...formItemLayout} label="Optional Message">
          {getFieldDecorator('message', {
            initialValue: this.props.booking.bookingAck.message
          })
          (<Input placeholder='Optional Message' disabled={!this.state.user.isAdmin}/>)}
        </FormItem>

        {this.state.user.isAdmin ?
          <div>
            <FormItem {...formItemLayout} label="Customer name">
              <Input disabled={true} defaultValue={this.state.customer.name} />
            </FormItem>
            <FormItem {...formItemLayout} label="Customer email">
              <Input disabled={true} defaultValue={this.state.customer.email} />
            </FormItem>
            <FormItem {...formItemLayout} label="Customer contact number">
              <Input disabled={true} defaultValue={this.state.customer.contactNumber} />
            </FormItem>

            <FormItem>
              <Button type="primary" htmlType="submit" className="booking-form-button">
                Update booking!
              </Button>
            </FormItem>
          </div>
          : null
        }
      </Form>
    )
  }

  sendEmail = (oldBooking, newBooking, bookingChanges, customer) => {
    console.log('Sending email...');

    axios.post('http://localhost:3001/sendEmail', {
      oldBooking,
      newBooking,
      bookingChanges,
      customer
    })
      .then(function (response) {
        // handle success
        console.log(response);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }
}

/**
 * List of properties that need to be passed to <BookingForm>
 */
BookingAck.propTypes = {
  onBackPressed: PropTypes.func.isRequired,
  onBookingAckSuccess: PropTypes.func.isRequired,
  booking: PropTypes.object.isRequired,
};

export default Form.create()(BookingAck);
