import React, { Component } from 'react';
import TrackForm from "../components/TrackForm";
import pathConstants from "../constants/pathConstants";
import {message} from "antd";
import localConst from "../constants/localStorageConstants";

class TrackPage extends Component {
    render() {
        return (
            <div>
                <h1>Track your booking here</h1>
                <TrackForm onTrackSuccess={this.onTrackSuccess}/>
            </div>
        );
    }

    onTrackSuccess = (value) => {
      localStorage.setItem(localConst.TRACKED_BOOKING, value);
      this.props.history.push(pathConstants.VIEW_SINGLE_BOOKING);
    };
}

export default TrackPage;
