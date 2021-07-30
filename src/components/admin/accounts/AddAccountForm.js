import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, Label, Input, FormGroup, Alert} from 'reactstrap';
import axios from 'axios';

export default class AddAccountForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isFail: false,
            messageFail: '',

            isSuccess: false
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
                    if(response.data.successCode === 'ADD_ACCOUNT_SUCCESS'){
                        this.setState({
                            isSuccess: true,
                            isFail: false
                        })
                    }
                }
            })
            .catch(err => {
                if (err.response) {
                    switch (err.response.data.message) {
                        case 'USERNAME_NOT_CORRECT_FORMAT':
                            this.setState({ messageFail: 'Username is not correct format.'});
                            break;
                        case 'PASSWORD_NOT_CORRECT_FORMAT':
                            this.setState({ messageFail: 'Password is not correct format.'});
                            break;
                        case 'FULLNAME_IS_EMPTY':
                            this.setState({ messageFail: 'Full name is empty.'});
                            break;
                        case 'PHONE_NOT_CORRECT_FORMAT':
                            this.setState({ messageFail: 'Phone is not correct format.'});
                            break;
                        case 'ADDRESS_IS_EMPTY':
                            this.setState({ messageFail: 'Address is empty.'});
                            break;
                        case 'USERNAME_ALREADY_TAKEN':
                            this.setState({ messageFail: 'Username already taken.'});
                            break;
                        case 'ROLE_NOT_CORRECT':
                            this.setState({ messageFail: 'Role must be admin or customer.'});
                            break;    
                        default:
                            this.setState({ messageFail: 'Error to add account.'});
                    }
                }
                else {
                    this.setState({ messageFail: 'Fail to add account.'});
                }
                this.setState({
                    isFail: true,
                    isSuccess: false
                });
            })
    }

    render() {
        return (
            <div>
                <h2 style={{textAlign: 'center'}}>
                    Add Account Form
                </h2>
                <br />
                <Form onSubmit={(e) => this.handleAdd(e)}>
                    <Container>
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <FormGroup className="mb-4">
                                    <Label for="username" className="mr-sm-2"><b>Username</b></Label>
                                    <Input type="text" name="username" id="username" />
                                    <p>
                                        <i>*No special characters and space</i>
                                    </p>   
                                </FormGroup>
                            </Col>          
                        </Row>
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <FormGroup className="mb-4">
                                    <Label for="password" className="mr-sm-2"><b>Password</b></Label>
                                    <Input type="password" name="password" id="password" />
                                    <p>
                                        <i>*No special characters and space - Min: 6 / Max: 20</i>
                                    </p>  
                                </FormGroup>
                            </Col>              
                        </Row>
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <FormGroup className="mb-4">
                                    <Label for="fullname" className="mr-sm-2"><b>Full name</b></Label>
                                    <Input type="text" name="fullname" id="fullname" />
                                    <p>
                                        <i>*Not empty.</i>
                                    </p>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <FormGroup className="mb-4">
                                    <Label for="phone" className="mr-sm-2"><b>Phone</b></Label>
                                    <Input type="number" name="phone" id="phone" />
                                    <p>
                                        <i>*Not empty - 10 or 11 numbers.</i>
                                    </p>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <FormGroup className="mb-4">
                                    <Label for="address" className="mr-sm-2"><b>Address</b></Label>
                                    <Input type="text" name="address" id="address" />
                                    <p>
                                        <i>*Not empty.</i>
                                    </p>
                                    <p style={{ color: 'red' }}>
                                        {this.state.addressErr}
                                    </p>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row xs="4" className="mb-4">
                            <Col></Col>
                            <Col>
                                <Label for="role"><b>Role</b></Label>
                            </Col>
                            <Col>
                                <select style={{ height: '30px', width: '150px'}} id="rolefield" name="role">
                                    <option>customer</option>
                                    <option>admin</option>
                                </select>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                {
                                    this.state.isFail &&
                                    <Alert color="danger">
                                        {this.state.messageFail}
                                    </Alert>
                                }
                                {
                                    this.state.isSuccess &&
                                    <Alert color="success">
                                        Success to add account.
                                    </Alert>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <Button color="primary" className="mb-4">Add Account</Button>
                            </Col>    
                        </Row>
                    </Container>
                </Form>
            </div>
        )
    }
}
