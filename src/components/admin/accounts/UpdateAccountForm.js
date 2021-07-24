import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, Label, Input } from 'reactstrap';
import axios from 'axios';

export default class UpdateAccountForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fullname: '',
            phone: '',
            address: ''
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        axios.get(`http://localhost:8080/admin/account/${this.props.username}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
        .then(response => {
            if(response.status === 200){
                this.setState({ 
                    fullname: response.data.fullName,
                    phone: response.data.phone,
                    address: response.data.address,
                })
            }
        })
        .catch(err => {
            if(err.response){
                if(err.response.data.message === 'ACCOUNT_NOT_FOUND'){
                    alert("Account not found");
                }
                else{
                    alert("Error");
                }
            }
            else{
                alert("Fail to load data!");
            }
        })
    }

    handleChange(e, key) {
        this.setState({ [key]: e.target.value });
    }

    handleUpdate(e) {
        e.preventDefault();
        axios.put(`http://localhost:8080/admin/account/${this.props.username}`,
            {
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
                alert("Success to update account!");
                this.props.onUpdate();
            }
        })
        .catch(err => {
            if(err.response){
                if(err.response.data.message === 'ACCOUNT_NOT_FOUND'){
                    alert("Account not found");
                }
                else if(err.response.data.message === 'ACCOUNT_NOT_BELONG_TO_CUSTOMER'){
                    alert("Account not belong to customer");
                }
                else if(err.response.data.message === 'ACCOUNT_IS_DISABLED'){
                    alert("Account is disabled");
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
                alert("Fail to update account!");
            }
        })    
    }

    render() {
        return (
            <div>
                <Form onSubmit={(e) => this.handleUpdate(e)}>
                    <Container>
                        <Row xs="3" className="mb-4">
                            <Col>
                                <Label for="password">Password</Label>
                            </Col>
                            <Col>
                                <Input type="password" name="password" id="passwordfield"/>
                            </Col>
                        </Row>
                        <Row xs="3" className="mb-4">
                            <Col>
                                <Label for="fullname">Fullname</Label>
                            </Col>
                            <Col>
                                <Input type="text" name="fullname" id="fullnamefield"
                                    value={this.state.fullname} 
                                    onChange={(e) => this.handleChange(e, "fullname")}/>
                            </Col>
                        </Row>
                        <Row xs="3" className="mb-4">
                            <Col>
                                <Label for="phone">Phone</Label>
                            </Col>
                            <Col>
                                <Input type="number" name="phone" id="phonefield"
                                    value={this.state.phone} 
                                    onChange={(e) => this.handleChange(e, "phone")}/>
                            </Col>
                        </Row>
                        <Row xs="3" className="mb-4">
                            <Col>
                                <Label for="address">Address</Label>
                            </Col>
                            <Col>
                                <Input type="text" name="address" id="addressfield"
                                    value={this.state.address} 
                                    onChange={(e) => this.handleChange(e, "address")}/>
                            </Col>
                        </Row>
                        <Row xs="3" className="mb-4">
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
                        <Button color="warning">Update</Button>
                    </Container>
                </Form>
            </div>
        )
    }
}
