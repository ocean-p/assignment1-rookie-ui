import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, Label, Input } from 'reactstrap';
import axios from 'axios';

export default class AddAccountForm extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    handleAdd(e) {
        e.preventDefault();
        axios.post('http://localhost:8080/admin/account',
            {
                username: e.target.username.value,
                password: e.target.password.value,
                fullName: e.target.fullname.value,
                phone: e.target.phone.value,
                address: e.target.address.value,
                role: e.target.role.value,
            },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            }
        )
            .then(response => {
                if (response.status === 200) {
                    alert("Success to add account.");
                }
            })
            .catch(err => {
                if (err.response) {
                    switch (err.response.data.message) {
                        case 'USERNAME_NOT_CORRECT_FORMAT':
                            alert("Username not correct format !");
                            break;
                        case 'PASSWORD_NOT_CORRECT_FORMAT':
                            alert("Password not correct format !");
                            break;
                        case 'FULLNAME_IS_EMPTY':
                            alert("Full name is empty !");
                            break;
                        case 'PHONE_NOT_CORRECT_FORMAT':
                            alert("Phone not correct format !");
                            break;
                        case 'ADDRESS_IS_EMPTY':
                            alert("Address is empty !");
                            break;
                        case 'USERNAME_ALREADY_TAKEN':
                            alert("Username already used !");
                            break;
                        case 'ROLE_NOT_CORRECT':
                            alert("Role Role must be customer or admin !");
                            break;    
                        default:
                            alert("Error to add account !");
                    }
                }
                else {
                    alert("Fail to add account!");
                }
            })
    }

    render() {
        return (
            <div>
                <h2 style={{ marginLeft: '50px', 
                             marginTop: '20px'}}>
                    Add Account Form
                </h2>
                <br />
                <Form onSubmit={(e) => this.handleAdd(e)}>
                    <Container>
                        <Row xs="4" className="mb-4">
                            <Col>
                                <Label for="username"><b>Username</b></Label>
                            </Col>
                            <Col>
                                <Input type="text" name="username" id="usernamefield"
                                    placeholder="No special characters and space" />
                            </Col>
                        </Row>
                        <Row xs="4" className="mb-4">
                            <Col>
                                <Label for="password"><b>Password</b></Label>
                            </Col>
                            <Col>
                                <Input type="password" name="password" id="passwordfield"
                                    placeholder="Min: 6 / Max: 20" />
                            </Col>
                        </Row>
                        <Row xs="4" className="mb-4">
                            <Col>
                                <Label for="fullname"><b>Fullname</b></Label>
                            </Col>
                            <Col>
                                <Input type="text" name="fullname" id="fullnamefield"
                                    placeholder="Not empty" />
                            </Col>
                        </Row>
                        <Row xs="4" className="mb-4">
                            <Col>
                                <Label for="phone"><b>Phone</b></Label>
                            </Col>
                            <Col>
                                <Input type="number" name="phone" id="phonefield"
                                    placeholder="Not empty - 10 or 11 numbers" />
                            </Col>
                        </Row>
                        <Row xs="4" className="mb-4">
                            <Col>
                                <Label for="address"><b>Address</b></Label>
                            </Col>
                            <Col>
                                <Input type="text" name="address" id="addressfield"
                                    placeholder="Not empty" />
                            </Col>
                        </Row>
                        <Row xs="4" className="mb-4">
                            <Col>
                                <Label for="role"><b>Role</b></Label>
                            </Col>
                            <Col>
                                <select style={{ height: '30px' }} id="rolefield" name="role">
                                    <option>customer</option>
                                    <option>admin</option>
                                </select>
                            </Col>
                        </Row>
                        <Button color="primary" className="mb-4">Add Account</Button>
                    </Container>
                </Form>
            </div>
        )
    }
}
