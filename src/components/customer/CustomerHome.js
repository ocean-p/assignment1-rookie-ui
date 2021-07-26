import React, { Component } from 'react';
import CustomerNavBar from './CustomerNavBar';
import HomePage from './HomePage';
import Cart from './Cart';
import { BrowserRouter as Router, Route } from 'react-router-dom';

export default class CustomerHome extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        this.props.onLogout();
    }

    render() {
        return (
        <Router>
            <div>
                <h1 style={{ color: 'white', backgroundColor: 'blue' }}>
                    Customer Home Page
                </h1>
                <CustomerNavBar />
                <button type="submit" onClick={this.logout}>
                    Sign out
                </button>

                <Route exact path="/" component={HomePage} />
                <Route exact path="/cart" component={Cart} />
            </div>
        </Router>
        )
    }
}
