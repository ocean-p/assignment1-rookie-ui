import React, { Component } from 'react';
import CustomerNavBar from './CustomerNavBar';
import HomePage from './HomePage';
import Cart from './cart/Cart';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

export default class CustomerHome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
        };
    }

    toggle() {
        this.setState({ modal: !this.state.modal });
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
                    <h1 style={{
                        color: 'white',
                        backgroundColor: 'blue',
                        textAlign: 'center',
                        height: '60px'
                    }}>
                        Customer Home Page
                    </h1>
                    <CustomerNavBar />
                    <Button color="info" onClick={() => this.toggle()}>
                        Sign out
                    </Button>

                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/cart" component={Cart} />

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
