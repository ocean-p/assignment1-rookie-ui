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
            if(response.status === 200){
                alert("Success to add account!");
            }
        })
        .catch(err => {
            if(err.response){
                if(err.response.data.message === 'USERNAME_IS_EMPTY'){
                    alert("Username is empty");
                }
                else if(err.response.data.message === 'USERNAME_ALREADY_TAKEN'){
                    alert("Username already taken");
                }
                else if(err.response.data.message === 'PASSWORD_NOT_CORRECT_FORMAT'){
                    alert("Password - Max:20, Min:6");
                }
                else if(err.response.data.message === 'FULLNAME_IS_EMPTY'){
                    alert("Full name is empty");
                }
                else if(err.response.data.message === 'PHONE_NOT_CORRECT_FORMAT'){
                    alert("Phone not correct format - 10 or 11 numbers");
                }
                else if(err.response.data.message === 'ADDRESS_IS_EMPTY'){
                    alert("Address is empty");
                }
                else if(err.response.data.message === 'ROLE_NOT_CORRECT'){
                    alert("Role must be customer or admin");
                }
                else{
                    alert("Error");
                }
            }
            else{
                alert("Fail to add account!");
            }
        })
    }

    render() {
        return (
            <div>
                <h2 style={{marginLeft: '50px', marginTop: '20px'}}>
                    Add Account Form
                </h2>
                <br/>
                <Form onSubmit={(e) => this.handleAdd(e)}>
                    <Container>
                        <Row xs="4" className="mb-4">
                            <Col>
                                <Label for="username">Username</Label>
                            </Col>
                            <Col>
                                <Input type="text" name="username" id="usernamefield"
                                    placeholder="username"/>
                            </Col>
                        </Row>
                        <Row xs="4" className="mb-4">
                            <Col>
                                <Label for="password">Password</Label>
                            </Col>
                            <Col>
                                <Input type="password" name="password" id="passwordfield"
                                    placeholder="password"/>
                            </Col>
                        </Row>
                        <Row xs="4" className="mb-4">
                            <Col>
                                <Label for="fullname">Fullname</Label>
                            </Col>
                            <Col>
                                <Input type="text" name="fullname" id="fullnamefield"
                                    placeholder="full-name"/>
                            </Col>
                        </Row>
                        <Row xs="4" className="mb-4">
                            <Col>
                                <Label for="phone">Phone</Label>
                            </Col>
                            <Col>
                                <Input type="number" name="phone" id="phonefield"
                                    placeholder="phone"/>   
                            </Col>
                        </Row>
                        <Row xs="4" className="mb-4">
                            <Col>
                                <Label for="address">Address</Label>
                            </Col>
                            <Col>
                                <Input type="text" name="address" id="addressfield"
                                    placeholder="address"/>    
                            </Col>
                        </Row>
                        <Row xs="4" className="mb-4">
                            <Col>
                                <Label for="role">Role</Label>
                            </Col>
                            <Col>
                                <select style={{height: '30px'}} id="rolefield" name="role">
                                    <option>customer</option>
                                    <option>admin</option>
                                </select>
                            </Col>
                        </Row>
                        <Button color="primary">Add Account</Button>
                    </Container>
                </Form>
            </div>
        )
    }
}
