import React, { Component } from 'react';
import { Form, Button, Input, message } from 'antd';
import 'antd/dist/antd.css';
import './TrackForm.css';
import bookingUtils from "../utils/bookingUtils";

const FormItem = Form.Item;

class TrackForm extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.goToTrackingPage(values);
            } else {
              console.log('Failed tracking, err: ', err);
            }
        });
    };

    goToTrackingPage = (values) => {
        const bookingId = values.bookingId || '';
        bookingUtils.findBooking(bookingId)
          .then((result) => {
              console.log('Valid boooking found: ', result);
              this.props.onTrackSuccess(bookingId)
          })
          .catch((error) => {
              console.error('Failed to find booking: ', error);
              message.error('Booking with this id is not found');
          })
    };

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
            <Form onSubmit={this.handleSubmit.bind(this)} className="track-form">
                <FormItem {...formItemLayout} label="Booking ID">
                    {getFieldDecorator('bookingId',{
                        rules : [{
                            required : true , message : 'Please input the booking ID!'
                        }]
                    })
                    (<Input placeholder='Booking ID'/>)}
                </FormItem>

                <FormItem>
                    <Button type="primary" htmlType="submit" className="track-form-button">
                        Get booking information
                    </Button>
                </FormItem>

            </Form>
        )
    }
}

export default Form.create()(TrackForm);