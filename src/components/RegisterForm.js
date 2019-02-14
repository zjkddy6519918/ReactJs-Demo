import React, { Component } from 'react';
import PropTypes from 'prop-types';
import userUtils from '../utils/userUtils';
import { Form, Input, Button, message } from 'antd';
import 'antd/dist/antd.css';
import './RegisterForm.css';

const FormItem = Form.Item;

class RegisterForm extends Component {

  /**
   * Validates the "confirm password" input to "password" input
   */
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Please ensure that this matches the password above');
    } else {
      callback();
    }
  };

  /**
   * Handles the process needed to be done when submit button is clicked.
   * It will validate all the input and call registerUser()
   */
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Validated register input, values: ', values);
        this.registerUser(values);
      } else {
        console.log('Failed register validation, err: ', err);
      }
    });
  };

  /**
   * Registers user and calls onRegisterSuccess() if user created/registered successfully,
   * which will login the user.
   * Otherwise, show an error message.
   */
  registerUser = (user) => {
    userUtils.createUser(user)
      .then((result) => {
        console.log('User is registered: ', result);
        this.props.onRegisterSuccess();
      })
      .catch((error) => {
        console.error('Failed to register user, error: ', error);
        message.error(error.message);
      })
  };

  /**
   * Default function that will tell React what HTML to render
   */
  render() {
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

    return (
      <Form onSubmit={this.handleSubmit.bind(this)} className="register-form">

        {/* Email input (validates email format and email is filled) */}
        <FormItem
          {...formItemLayout}
          label="E-mail"
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'The input is not valid E-mail!',
            }, {
              required: true, message: 'Please input your E-mail!',
            }],
          })(
            <Input placeholder="E-mail" />
          )}
        </FormItem>

        {/* Name input (validates name is filled) */}
        <FormItem
          {...formItemLayout}
          label="Name"
        >
          {getFieldDecorator('name', {
            rules: [{
              required: true, message: 'Please input your name!',
            }],
          })(
            <Input placeholder="Name" />
          )}
        </FormItem>

        {/* Address input (validates address is filled) */}
        <FormItem
          {...formItemLayout}
          label="Address"
        >
          {getFieldDecorator('address', {
            rules: [{
              required: true, message: 'Please input your home address!',
            }],
          })(
            <Input placeholder="Address" />
          )}
        </FormItem>

        {/* Contact number input (validates contact number is filled) */}
        <FormItem
          {...formItemLayout}
          label="Contact number"
        >
          {getFieldDecorator('contactNumber', {
            rules: [{
              required: true, message: 'Please input your contact number!',
            }],
          })(
            <Input type="number" placeholder="Contact Number" />
          )}
        </FormItem>

        {/* Password input (validates password is filled) */}
        <FormItem
          {...formItemLayout}
          label="Password"
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: 'Please input your password!',
            }],
          })(
            <Input type="password" placeholder="Password" />
          )}
        </FormItem>

        {/* Confirm password input (validates confirm password is filled and matches password input) */}
        <FormItem
          {...formItemLayout}
          label="Confirm password"
        >
          {getFieldDecorator('confirmPassword', {
            rules: [{
              required: true, message: 'Please confirm your password!',
            }, {
              validator: this.compareToFirstPassword,
            }],
          })(
            <Input type="password" placeholder="Confirm Password" />
          )}
        </FormItem>

        {/* Submit button to create account */}
        <FormItem>
          <Button type="primary" htmlType="submit" className="register-form-button">
            Create account!
          </Button>
        </FormItem>
      </Form>
    );
  }
}

/**
 * List of properties that need to be passed to <RegisterForm>
 */
RegisterForm.propTypes = {
  onRegisterSuccess: PropTypes.func.isRequired
};

export default Form.create()(RegisterForm);
