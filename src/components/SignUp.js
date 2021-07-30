import React, { Component } from 'react';
import {
    Button, Form, FormGroup,
    Label, Input, Container, Row, Col, Alert,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import axios from 'axios';

export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usernameErr: '',
            passwordErr: '',
            fullNameErr: '',
            phoneErr: '',
            addressErr: '',

            isFail: false,
            messageFail: '',

            modal: false
        };
    }

    validate(e) {
        let check = true;
        if (e.target.username.value === '') {
            check = false;
            this.setState({ usernameErr: 'Please input username' })
        }
        else {
            this.setState({ usernameErr: '' })
        }

        if (e.target.password.value === '') {
            check = false;
            this.setState({ passwordErr: 'Please input password' })
        }
        else if (e.target.password.value.length < 6 || e.target.password.value.length > 20) {
            check = false;
            this.setState({ passwordErr: 'Length Min:6 - Max:20' });
        }
        else {
            this.setState({ passwordErr: '' });
        }

        if (e.target.fullname.value === '') {
            check = false;
            this.setState({ fullNameErr: 'Please input full name' })
        }
        else {
            this.setState({ fullNameErr: '' })
        }

        if (e.target.phone.value === '') {
            check = false;
            this.setState({ phoneErr: 'Please input phone' })
        }
        else if (e.target.phone.value.length < 10 || e.target.phone.value.length > 11) {
            check = false;
            this.setState({ phoneErr: 'Phone is 10 or 11 numbers' })
        }
        else {
            this.setState({ phoneErr: '' })
        }

        if (e.target.address.value === '') {
            check = false;
            this.setState({ addressErr: 'Please input address' })
        }
        else {
            this.setState({ addressErr: '' })
        }

        return check;
    }

    handleSignUp(e) {
        e.preventDefault();

        if (this.validate(e) === false) return;

        axios.post('http://localhost:8080/signup', {
            username: e.target.username.value,
            password: e.target.password.value,
            fullName: e.target.fullname.value,
            phone: e.target.phone.value,
            address: e.target.address.value
        })
            .then(response => {
                if (response.status === 200) {
                    this.toggle();
                }
            })
            .catch(err => {
                if (err.response) {
                    switch (err.response.data.message) {
                        case 'USERNAME_NOT_CORRECT_FORMAT':
                            this.setState({ messageFail: 'Username is not correct format.' });
                            break;
                        case 'PASSWORD_NOT_CORRECT_FORMAT':
                            this.setState({ messageFail: 'Password is not correct format.' });
                            break;
                        case 'FULLNAME_IS_EMPTY':
                            this.setState({ messageFail: 'Full name is empty.' });
                            break;
                        case 'PHONE_NOT_CORRECT_FORMAT':
                            this.setState({ messageFail: 'Phone is not correct format.' });
                            break;
                        case 'ADDRESS_IS_EMPTY':
                            this.setState({ messageFail: 'Address is not correct format.' });
                            break;
                        case 'USERNAME_ALREADY_TAKEN':
                            this.setState({ messageFail: 'Username already taken.' });
                            break;
                        default:
                            this.setState({ messageFail: 'Error to sign up.' });
                    }
                }
                else {
                    this.setState({ messageFail: 'Fail to sign up.' });
                }
                this.setState({
                    isFail: true,
                })
            });
    }

    toggle() {
        this.setState({ modal: !this.state.modal })
    }

    onBack = () => {
        this.props.onClose();
    }

    render() {
        return (
            <div>
                <h1 style={{
                    backgroundColor: 'gold',
                    textAlign: 'center',
                    color: 'Green',
                    height: '60px',
                    marginBottom: '20px'
                }}>
                    Sign Up Form
                </h1>
                <Form inline onSubmit={(e) => this.handleSignUp(e)}>
                    <Container>
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <FormGroup className="mb-4">
                                    <Label for="username" className="mr-sm-2"><b>Username</b></Label>
                                    <Input type="text" name="username" id="username" />
                                    <p>
                                        <i>*No special characters and space.</i>
                                    </p>
                                    <p style={{ color: 'red' }}>
                                        {this.state.usernameErr}
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
                                        <i>*No special characters and space - Min: 6 / Max: 20.</i>
                                    </p>
                                    <p style={{ color: 'red' }}>
                                        {this.state.passwordErr}
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
                                    <p style={{ color: 'red' }}>
                                        {this.state.fullNameErr}
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
                                    <p style={{ color: 'red' }}>
                                        {this.state.phoneErr}
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
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                {
                                    this.state.isFail &&
                                    <Alert color="danger">
                                        {this.state.messageFail}
                                    </Alert>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <Button>Sign Up</Button>
                            </Col>
                        </Row>
                    </Container>
                </Form>
                <br />
                <Container>
                    <Row>
                        <Col sm="12" md={{ size: 6, offset: 3 }}>
                            <Button color="primary" className="mb-4" onClick={() => this.onBack()}>
                                Back To Sign In
                            </Button>
                        </Col>
                    </Row>
                </Container>
                <Modal isOpen={this.state.modal}>
                    <ModalHeader>Notice</ModalHeader>
                    <ModalBody>
                        <h4 style={{ color: 'green' }}>
                            Success to sign up - Now you can sign in.
                        </h4>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.onBack()}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
