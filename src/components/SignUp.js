import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col } from 'reactstrap';
import axios from 'axios';

export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleSignUp(e) {
        e.preventDefault();

        axios.post('http://localhost:8080/signup', {
            username: e.target.username.value,
            password: e.target.password.value,
            fullName: e.target.fullname.value,
            phone: e.target.phone.value,
            address: e.target.address.value
        })
            .then(response => {
                if (response.status === 200) {
                    console.log(response);
                    alert("SignUp Success!");
                    this.props.onClose();
                }
            })
            .catch(err => alert(err.response.data.message));
    }

    onBack = () => {
        this.props.onClose();
    }

    render() {
        return (
            <div>
                <h1 style={{ backgroundColor: 'yellow', textAlign: 'center' }}>
                    Sign Up Form
                </h1>
                <Form inline onSubmit={(e) => this.handleSignUp(e)}>
                    <Container>
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <FormGroup className="mb-4">
                                    <Label for="username" className="mr-sm-2">Username</Label>
                                    <Input type="text" name="username" id="username" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <FormGroup className="mb-4">
                                    <Label for="password" className="mr-sm-2">Password</Label>
                                    <Input type="password" name="password" id="password" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <FormGroup className="mb-4">
                                    <Label for="fullname" className="mr-sm-2">Full name</Label>
                                    <Input type="text" name="fullname" id="fullname" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <FormGroup className="mb-4">
                                    <Label for="phone" className="mr-sm-2">Phone</Label>
                                    <Input type="number" name="phone" id="phone" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <FormGroup className="mb-4">
                                    <Label for="address" className="mr-sm-2">Address</Label>
                                    <Input type="text" name="address" id="address" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <Button>Sign Up</Button>
                            </Col>
                        </Row>
                    </Container>
                </Form>
                <Container>
                    <Row>
                        <Col sm="12" md={{ size: 6, offset: 3 }}>
                            <div style={{color: 'grey'}}>-------------------</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="12" md={{ size: 6, offset: 3 }}>
                            <Button color="primary" onClick={() => this.onBack()}>Back To Sign In</Button>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
