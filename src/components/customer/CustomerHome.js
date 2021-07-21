import React, { Component } from 'react'

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
            <div>
                <h1 style={{ color: 'white', backgroundColor: 'blue' }}>
                    Customer Home Page
                </h1>
                <button type="submit" onClick={this.logout}>
                    Sign out
                </button>
            </div>
        )
    }
}
