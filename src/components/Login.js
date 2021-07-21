import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col } from 'reactstrap';
import axios from 'axios';

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    handleSignin(e) {
        e.preventDefault();
        axios.post('http://localhost:8080/signin', {
            username: e.target.username.value,
            password: e.target.password.value
        })
            .then(response => {
                if (response.status === 200) {
                    localStorage.setItem('accessToken', response.data.token);
                    localStorage.setItem('role', response.data.roles);
                    localStorage.setItem('name', response.data.username);
                    this.props.onLogin();
                }
            })
            .catch(err => {
                alert("Login Fail!");
            })
    }

    render() {
        return (
            <div>
                <h1 style={{
                    textAlign: 'center',
                    backgroundColor: 'green', color: 'white'
                }}>
                    LOGIN PAGE
                </h1>
                <Form inline onSubmit={e => this.handleSignin(e)}>
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
                                <Button color="primary">Sign In</Button>
                            </Col>
                        </Row>
                    </Container>
                </Form>
            </div>
        )
    }
}
