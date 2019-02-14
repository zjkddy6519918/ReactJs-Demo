import React, { Component } from 'react';
import PropTypes from 'prop-types';
import userUtils from '../utils/userUtils';
import { Form, Input, Button, message } from 'antd';
import 'antd/dist/antd.css';
import './UserProfileForm.css';
import localConst from "../constants/localStorageConstants";

const userId = localStorage.getItem(localConst.USER_ID) || '';
const FormItem = Form.Item;

class UserProfileForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      userDetails: JSON.parse(localStorage.getItem(localConst.USER)) || {}
    };
  }

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
   * It will validate all the input and call updateProfile()
   */
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Validated update profile input, values: ', values);
        this.updateProfile(values);
      } else {
        console.log('Failed update profile validation, err: ', err);
      }
    });
  };

  onEditButtonClicked = () => {
    const isNowEditing = !this.state.isEditing;

    this.setState({
      isEditing: isNowEditing
    });

    if (!isNowEditing) { this.resetProfile(); }

    console.log(`Now editing profile: ${isNowEditing}`);
  };

  resetProfile = () => {
    console.log(`Resetting user profile`);

    this.props.form.setFieldsValue({
      email: this.state.userDetails.email,
      name: this.state.userDetails.name,
      address: this.state.userDetails.address,
      contactNumber: this.state.userDetails.contactNumber,
      password: this.state.userDetails.password,
      confirmPassword: this.state.userDetails.password,
    });
  };

  /**
   * Updates user profile and calls onProfileUpdated() if user updated successfully.
   * Otherwise, show an error message.
   */
  updateProfile = (user) => {
    userUtils.updateUser(userId, user)
      .then((result) => {
        console.log(`Updated user profile: ${JSON.stringify(result)}`);
        userUtils.storeUserDetails(userId, result);
        this.props.onProfileUpdated();
      })
      .catch((error) => {
        console.error('Failed to update user profile, error: ', error);
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
      <Form onSubmit={this.handleSubmit.bind(this)} className="user-profile-form">

        {/* Email input (validates email format and email is filled) */}
        <FormItem
          {...formItemLayout}
          label="E-mail"
        >
          {getFieldDecorator('email', {
            initialValue: this.state.userDetails.email,
            rules: [{
              type: 'email', message: 'The input is not valid E-mail!',
            }, {
              required: true, message: 'Please input your E-mail!',
            }],
          })(
            <Input placeholder="E-mail" disabled={!this.state.isEditing} />
          )}
        </FormItem>

        {/* Name input (validates name is filled) */}
        <FormItem
          {...formItemLayout}
          label="Name"
        >
          {getFieldDecorator('name', {
            initialValue: this.state.userDetails.name,
            rules: [{
              required: true, message: 'Please input your name!',
            }],
          })(
            <Input placeholder="Name" disabled={!this.state.isEditing} />
          )}
        </FormItem>

        {/* Address input (validates address is filled) */}
        <FormItem
          {...formItemLayout}
          label="Address"
        >
          {getFieldDecorator('address', {
            initialValue: this.state.userDetails.address,
            rules: [{
              required: true, message: 'Please input your home address!',
            }],
          })(
            <Input placeholder="Address" disabled={!this.state.isEditing} />
          )}
        </FormItem>

        {/* Contact number input (validates contact number is filled) */}
        <FormItem
          {...formItemLayout}
          label="Contact number"
        >
          {getFieldDecorator('contactNumber', {
            initialValue: this.state.userDetails.contactNumber,
            rules: [{
              required: true, message: 'Please input your contact number!',
            }],
          })(
            <Input type="number" placeholder="Contact Number" disabled={!this.state.isEditing} />
          )}
        </FormItem>

        {/* Password input (validates password is filled) */}
        <FormItem
          {...formItemLayout}
          label="Password"
        >
          {getFieldDecorator('password', {
            initialValue: this.state.userDetails.password,
            rules: [{
              required: true, message: 'Please input your password!',
            }],
          })(
            <Input type="password" placeholder="Password" disabled={!this.state.isEditing} />
          )}
        </FormItem>

        {/* Confirm password input (validates confirm password is filled and matches password input) */}
        <FormItem
          {...formItemLayout}
          label="Confirm password"
        >
          {getFieldDecorator('confirmPassword', {
            initialValue: this.state.userDetails.password,
            rules: [{
              required: true, message: 'Please confirm your password!',
            }, {
              validator: this.compareToFirstPassword,
            }],
          })(
            <Input type="password" placeholder="Confirm Password" disabled={!this.state.isEditing} />
          )}
        </FormItem>

        {/* Edit button */}
        <FormItem>
          <Button onClick={this.onEditButtonClicked}>
            { this.state.isEditing ? "Cancel" : "Edit" }
          </Button>
        </FormItem>
        
        {/* Submit button to update user profile*/}
        { this.state.isEditing ?
          <FormItem>
            <Button type="primary" htmlType="submit" className="save-form-button">
              Update profile
            </Button>
          </FormItem>
          : null
        }
      </Form>
    );
  }
}

/**
 * List of properties that need to be passed to <UserProfile>
 */
UserProfileForm.propTypes = {
  onProfileUpdated: PropTypes.func.isRequired
};

export default Form.create()(UserProfileForm);
