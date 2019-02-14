import React, {Component} from 'react';
import {Link, Redirect, Route} from 'react-router-dom';
import {Layout, Menu} from 'antd';
import './App.css';
import pathConstants from './constants/pathConstants';
import localConstants from './constants/localStorageConstants';
import LoginPage from './screens/LoginPage';
import HomePage from './screens/HomePage';
import RegisterPage from './screens/RegisterPage';
import BookingPage from './screens/BookingPage';
import ProfilePage from './screens/ProfilePage';
import ViewBookingPage from "./screens/ViewBookingPage";
import TrackPage from "./screens/TrackPage";
import ViewSingleBookingPage from "./screens/ViewSingleBookingPage";

class App extends Component {

  /**
   * Used by path '/' to redirect to login page whenever this app is launched
   */
  redirectToLogin() {
    return (
      <Redirect to={pathConstants.LOGIN}/>
    )
  }

  /**
   * Default function that will tell React what HTML to render.
   * In here, define which pages to render when specific route paths are used.
   * E.g. when path is '.../login', this app will render LoginPage.
   */
  render() {
    const Header = Layout.Header;
    const Content = Layout.Content;
    const Footer = Layout.Footer;

    return (
      <div className='App'>
        <Layout style={{height: "100vh"}}>

          {window.location.pathname.includes(pathConstants.LOGIN) ||
            window.location.pathname.includes(pathConstants.REGISTER) ||
            window.location.pathname.includes(pathConstants.TRACK) ||
              window.location.pathname.includes(pathConstants.VIEW_SINGLE_BOOKING) ?
            (
              <Header>
                <span className="navbar-home">
                  {window.location.pathname.includes(pathConstants.LOGIN) ?
                    null :
                    <Link className="navbar-home-link" to={'/' + pathConstants.LOGIN}>Back to Login</Link>
                  }
                </span>
              </Header>
            )
              :
            (
              <Header>
                <span className="navbar-home">
                  <Link className="navbar-home-link" to={'/' + pathConstants.HOME}>Red Team</Link>
                </span>
                <Menu
                  theme="dark"
                  mode="horizontal"
                  defaultSelectedKeys={['2']}
                  style={{lineHeight: '64px', float: 'right'}}
                  >
                  <Menu.Item key="1">
                    <Link to={'/' + pathConstants.LOGIN} >Logout</Link>
                  </Menu.Item>
                  {/*<Menu.Item key="2">View bookings</Menu.Item>*/}
                  {/*<Menu.Item key="3">Profile</Menu.Item>*/}
                </Menu>
              </Header>
            )
          }

          <Content style={{padding: "25px"}}>
            <Route path='/' exact component={this.redirectToLogin} />
            <Route path={'/' + pathConstants.LOGIN} exact component={LoginPage} />
            <Route path={'/' + pathConstants.REGISTER} exact component={RegisterPage} />
            <Route path={'/' + pathConstants.HOME} exact component={HomePage} />
            <Route path={'/' + pathConstants.BOOKING} exact component={BookingPage} />
            <Route path={'/' + pathConstants.PROFILE} exact component={ProfilePage} />
            <Route path={'/' + pathConstants.VIEW_BOOKING} exact component={ViewBookingPage} />
            <Route path={'/' + pathConstants.VIEW_SINGLE_BOOKING} component={() => <ViewSingleBookingPage bookingId={localStorage.getItem(localConstants.TRACKED_BOOKING)} />} />
            <Route path={'/' + pathConstants.TRACK} exact component={TrackPage} />
          </Content>

          <Footer>Made by SWEN90016 Red Team</Footer>
        </Layout>
      </div>
    );
  }
}

export default App;
