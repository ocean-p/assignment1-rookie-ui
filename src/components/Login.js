import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col } from 'reactstrap';
import axios from 'axios';

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usernameErr: '', 
            passwordErr: ''
        };
    }

    validate(e) {
        let check = true;
        if(e.target.username.value === ''){
            check = false;
            this.setState({usernameErr: 'Please input username'})
        }
        else{
            this.setState({usernameErr: ''})
        }

        if(e.target.password.value === ''){
            check = false;
            this.setState({passwordErr: 'Please input password'})
        }
        else{
            this.setState({passwordErr: ''})
        }

        return check;
    }

    handleSignin(e) {
        e.preventDefault();

        if(this.validate(e) === false) return;

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
            .catch(() => {
                alert("Fail to login!");
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
                                    <p style={{color: 'red'}}>
                                        {this.state.usernameErr}
                                    </p>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <FormGroup className="mb-4">
                                    <Label for="password" className="mr-sm-2">Password</Label>
                                    <Input type="password" name="password" id="password" />
                                    <p style={{color: 'red'}}>
                                        {this.state.passwordErr}
                                    </p>
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
