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
import AddProductForm from './products/AddProductForm';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button} from 'reactstrap';

export default class AdminHome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
        };
    }

    toggle() {
        this.setState({modal: !this.state.modal});
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
                    <h1 style={{ color: 'white', 
                                 backgroundColor: 'darkred',
                                 textAlign: 'center', 
                                 height: '60px'}}>
                        Admin Home Page
                    </h1>
                    <AdminNavBar />
                    <Button color="info" onClick={() => this.toggle()}>
                        Sign out
                    </Button>

                    <Route path="/accounts/customer" component = {CustomerAccounts}/>
                    <Route path="/accounts/admin" component = {AdminAccounts}/>
                    <Route path="/accounts/disabled" component = {DisabledAccounts}/>
                    <Route path="/accounts/add" component = {AddAccountForm}/>
                    <Route exact path="/categories" component = {AvailableCategories}/>
                    <Route exact path="/categories/disabled" component = {DisabledCategories}/>
                    <Route exact path="/categories/add" component = {AddCategoryForm}/>
                    <Route exact path="/products" component = {AvailableProducts}/>
                    <Route exact path="/products/disabled" component = {DisabledProducts}/>
                    <Route exact path="/products/add" component = {AddProductForm}/>

                    <Modal isOpen={this.state.modal}>
                        <ModalHeader>Notice</ModalHeader>
                        <ModalBody>
                            Are you sure to sign out ?
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" onClick={this.logout}>Sign out</Button>
                            <Button color="primary" onClick={() => this.toggle()}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                </div>
            </Router>
        )
    }
}
