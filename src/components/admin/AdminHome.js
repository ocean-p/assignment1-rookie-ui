import React, { Component } from 'react';
import AdminNavBar from './AdminNavBar';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import CustomerAccounts from './accounts/CustomerAccounts';
import AdminAccounts from './accounts/AdminAccounts';
import DisabledAccounts from './accounts/DisabledAccounts';
import AvailableCategories from './categories/AvailableCategories';
import DisabledCategories from './categories/DisabledCategories';
import AvailableProducts from './products/AvailableProducts';
import DisabledProducts from './products/DisabledProducts';
import AddAccountForm from './accounts/AddAccountForm';
import AddCategoryForm from './categories/AddCategoryForm';

export default class AdminHome extends Component {

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
                    <h1 style={{ color: 'white', backgroundColor: 'red' }}>
                        Admin Home Page
                    </h1>
                    <AdminNavBar />
                    <button type="submit" onClick={this.logout}>
                        Sign out
                    </button>

                    <Route path="/accounts/customer" component = {CustomerAccounts}/>
                    <Route path="/accounts/admin" component = {AdminAccounts}/>
                    <Route path="/accounts/disabled" component = {DisabledAccounts}/>
                    <Route path="/accounts/add" component = {AddAccountForm}/>
                    <Route exact path="/categories" component = {AvailableCategories}/>
                    <Route exact path="/categories/disabled" component = {DisabledCategories}/>
                    <Route exact path="/categories/add" component = {AddCategoryForm}/>
                    <Route exact path="/products" component = {AvailableProducts}/>
                    <Route exact path="/products/disabled" component = {DisabledProducts}/>
                </div>
            </Router>
        )
    }
}
