import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col } from 'reactstrap';
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
        else if(e.target.password.value.length < 6 || e.target.password.value.length > 20){
            check = false;
            this.setState({passwordErr: 'Length Min:6 - Max:20'});
        }
        else{
            this.setState({passwordErr: ''});
        }
        
        if(e.target.fullname.value === '') {
            check = false;
            this.setState({fullNameErr: 'Please input full name'})
        }
        else{
            this.setState({fullNameErr: ''})
        }

        if(e.target.phone.value === '') {
            check = false;
            this.setState({phoneErr: 'Please input phone'})
        }
        else if(e.target.phone.value.length < 10 || e.target.phone.value.length > 11){
            check = false;
            this.setState({phoneErr: 'Phone is 10 or 11 numbers'})
        }
        else{
            this.setState({phoneErr: ''})
        }

        if(e.target.address.value === ''){
            check = false;
            this.setState({addressErr: 'Please input address'})
        }
        else{
            this.setState({addressErr: ''})
        }

        return check;
    }

    handleSignUp(e) {
        e.preventDefault();

        if(this.validate(e) === false) return;

        axios.post('http://localhost:8080/signup', {
            username: e.target.username.value,
            password: e.target.password.value,
            fullName: e.target.fullname.value,
            phone: e.target.phone.value,
            address: e.target.address.value
        })
            .then(response => {
                if (response.status === 200) {
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
                                <FormGroup className="mb-4">
                                    <Label for="fullname" className="mr-sm-2">Full name</Label>
                                    <Input type="text" name="fullname" id="fullname" />
                                    <p style={{color: 'red'}}>
                                        {this.state.fullNameErr}
                                    </p>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <FormGroup className="mb-4">
                                    <Label for="phone" className="mr-sm-2">Phone</Label>
                                    <Input type="number" name="phone" id="phone" />
                                    <p style={{color: 'red'}}>
                                        {this.state.phoneErr}
                                    </p>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <FormGroup className="mb-4">
                                    <Label for="address" className="mr-sm-2">Address</Label>
                                    <Input type="text" name="address" id="address" />
                                    <p style={{color: 'red'}}>
                                        {this.state.addressErr}
                                    </p>
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
                <br/>
                <Container>
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
