import React, { Component } from 'react';
import PropTypes from 'prop-types';
import bookingUtils from '../utils/bookingUtils';
import { DatePicker, Form, Button, Input, Select, message } from 'antd';
import 'antd/dist/antd.css';
import './BookingForm.css';
import localConst from "../constants/localStorageConstants";

const FormItem = Form.Item;
const Option = Select.Option;

class BookingForm extends Component {
   userId = localStorage.getItem(localConst.USER_ID) || '';

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Validated booking input, values: ', values);
                this.bookRequest(values, this.userId);
            } else {
                console.log('Failed booking input validation, err: ', err);
            }
        });
    };

    bookRequest = (booking,userId) => {
        bookingUtils.createBooking(booking,userId)
            .then((result) => {
                console.log('Validated booking input, values: ', result);
                this.props.onBookingSuccess();
            })
            .catch((error) => {
                console.log('Failed to make the booking' , error);
                message.error(error.message);
            })
    };

    disabledDate = (value) =>{
      return value && value.valueOf() < Date.now();
    };

    /**
     * Default function that will tell React what HTML to render
     */
    render(){
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
                <FormItem {...formItemLayout} label="Customer">
                    {getFieldDecorator('customer',{
                        rules : [{
                            required : true , message : 'Please input the customer!'
                        }]
                    })(<Input placeholder='Customer'/>)}
                </FormItem>
                <FormItem {...formItemLayout} label="Shipment Type">
                    {getFieldDecorator('shipmentType', {
                      initialValue: "normal"
                    })(<Select>
                      <Option value='normal'>normal</Option>
                      <Option value='fragile'>fragile</Option>
                      <Option value='express'>express</Option>
                    </Select>)}
                </FormItem>
                <FormItem {...formItemLayout} label="Shipment Name">
                    {getFieldDecorator('shipmentName',{
                        rules : [{
                            required : true , message : 'Please input the shipment name!'
                        }]
                    })(<Input placeholder='Shipment Name'/>)}
                </FormItem>
                <FormItem {...formItemLayout} label="Box Number">
                    {getFieldDecorator('boxNumber',{
                        rules : [{
                            required : true , message : 'Please input the box number!'
                        }]
                    })(<Input type = "number" placeholder='Box Number'/>)}
                </FormItem>
                <FormItem {...formItemLayout} label="Destination Address">
                    {getFieldDecorator('destAddress',{
                        rules : [{
                            required : true , message : 'Please input the destination address!'
                        }]
                    })(<Input placeholder='Destination Address'/>)}
                </FormItem>
                <FormItem {...formItemLayout} label="Pickup Address">
                    {getFieldDecorator('pickupAddress',{
                        rules : [{
                            required : true , message : 'Please input the pickup address!'
                        }]
                    })(<Input placeholder='Pickup Address'/>)}
                </FormItem>
                <FormItem {...formItemLayout} label="Preferred Departure Date">
                    {getFieldDecorator('departDate')(<DatePicker style={{width: "100%"}} disabledDate={this.disabledDate}/>)}
                </FormItem>
                <FormItem {...formItemLayout} label="Preferred Arrival Date">
                    {getFieldDecorator('arrivalDate')(<DatePicker style={{width: "100%"}} disabledDate={this.disabledDate}/>)}
                </FormItem>
                <FormItem {...formItemLayout} label="Optional Message">
                    {getFieldDecorator('message')(<Input placeholder='Optional Message'/>)}
                </FormItem>
                {/* Submit button to make the booking */}
                <FormItem>
                    <Button type="primary" htmlType="submit" className="booking-form-button">
                        Create your booking!
                    </Button>
                </FormItem>
            </Form>
        )
    }

}

/**
 * List of properties that need to be passed to <BookingForm>
 */
BookingForm.propTypes = {
    onBookingSuccess: PropTypes.func.isRequired
};

export default Form.create()(BookingForm);
