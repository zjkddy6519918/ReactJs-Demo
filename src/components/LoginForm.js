import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Icon, Input, Button, message } from 'antd';
import pathConstants from '../constants/pathConstants'
import userUtils from '../utils/userUtils';
import 'antd/dist/antd.css';
import './LoginForm.css';
import PropTypes from 'prop-types';

const FormItem = Form.Item;

class LoginForm extends Component {

  /**
   * Authenticates user using the login form's values and calls
   * onLoginSuccess() if user is authenticated, which will then login the user.
   * Otherwise, show an error message.
   */
  authenticateUser = (values) => {
    userUtils.authenticateUser(values)
      .then((result) => {
        console.log('User is authenticated: ', result);
        console.log('Logging in...');
        this.props.onLoginSuccess();
      })
      .catch((error) => {
        console.error('Failed to authenticate user, error: ', error);
        message.error(error.message);
      })
  };

  /**
   * Handles the process needed to be done when submit button is clicked.
   * It will validate all the input and call authenticateUser()
   */
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Validated login input, values: ', values);
        this.authenticateUser(values);
      } else {
        console.error('Failed login validation, err: ', err);
      }
    });
  };

  /**
   * Default function that will tell React what HTML to render
   */
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Form onSubmit={this.handleSubmit} className='login-form'>

          {/* Email input */}
          <FormItem>
            {getFieldDecorator('email')(
              <Input prefix={<Icon type='mail' style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder='Email' />
            )}
          </FormItem>

          {/* Password input */}
          <FormItem>
            {getFieldDecorator('password')(
              <Input prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />} type='password' placeholder='Password' />
            )}
          </FormItem>

          {/* Submit button to login */}
          <FormItem>
            <Button type='primary' htmlType='submit' className='login-form-button'>
              Log in
            </Button>
          </FormItem>
        </Form>

        {/* Link to register a new account */}
        <Link to={pathConstants.REGISTER}>Click here to register</Link>
        <br/>

        {/* Link to track the booking */}
        <Link to={pathConstants.TRACK}>Click here to track a booking</Link>
      </div>
    );
  }
}

/**
 * List of properties that need to be passed to <RegisterForm>
 */
LoginForm.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired
};

export default Form.create()(LoginForm);
