import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, Label, Input, Alert } from 'reactstrap';
import axios from 'axios';

export default class UpdateAccountForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fullname: '',
            phone: '',
            address: '',

            isUpdateFail: false,
            messageUpdateFail: '',

            isLoadFail: false,
            messageLoadFail: '',
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
                if(response.data.successCode === 'LOAD_ACCOUNT_SUCCESS'){
                    this.setState({ 
                        fullname: response.data.datas.fullName,
                        phone: response.data.datas.phone,
                        address: response.data.datas.address,
                    })
                }
            }
        })
        .catch(err => {
            if(err.response){
                if(err.response.data.message === 'ACCOUNT_NOT_FOUND'){
                    this.setState({messageLoadFail: 'Account not found.'})
                }
                else{
                    this.setState({messageLoadFail: 'Error to load account.'})
                }
            }
            else{
                this.setState({messageLoadFail: 'Fail to load account.'})
            }
            this.setState({isLoadFail: true})
        })
    }

    handleChange(e, key) {
        this.setState({ [key]: e.target.value });
    }

    handleUpdate(e) {
        e.preventDefault();
        axios.put(`http://localhost:8080/admin/account/${this.props.username}`,
            {
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
                if(response.data.successCode === 'UPDATE_ACCOUNT_SUCCESS'){
                    this.props.onUpdate();
                }
            }
        })
        .catch(err => {
            if(err.response){
                switch (err.response.data.message) {
                    case 'ACCOUNT_NOT_FOUND':
                        this.setState({messageUpdateFail: 'Account not found.'});
                        break;
                    case 'ACCOUNT_NOT_BELONG_TO_CUSTOMER':
                        this.setState({messageUpdateFail: 'Account not belong to customer.'});
                        break;
                    case 'ACCOUNT_IS_DISABLED':
                        this.setState({messageUpdateFail: 'Account is disabled.'});
                        break;
                    case 'FULLNAME_IS_EMPTY':
                        this.setState({messageUpdateFail: 'Full name is empty.'});
                        break;
                    case 'PHONE_NOT_CORRECT_FORMAT':
                        this.setState({messageUpdateFail: 'Phone is not correct format.'});
                        break;
                    case 'ADDRESS_IS_EMPTY':
                        this.setState({messageUpdateFail: 'Address is empty.'});
                        break;
                    case 'ROLE_NOT_CORRECT':
                        this.setState({messageUpdateFail: 'Role must be admin or customer.'});
                        break;
                    default:
                        this.setState({messageUpdateFail: 'Error to update account.'});   
                }
            }
            else{
                this.setState({messageUpdateFail: 'Fail to update account.'});
            }
            this.setState({isUpdateFail: true});
        })    
    }

    render() {
        return (
            <div>
                <Form onSubmit={(e) => this.handleUpdate(e)}>
                    <Container>
                        <Row>
                            {
                                this.state.isLoadFail &&
                                <Alert color="danger">
                                    {this.state.messageLoadFail}
                                </Alert>
                            }
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
                        <Row xs="2">
                            {
                                this.state.isUpdateFail &&
                                <Alert color="danger">
                                    {this.state.messageUpdateFail}
                                </Alert>
                            }
                        </Row>
                        <Button color="warning">Update</Button>
                    </Container>
                </Form>
            </div>
        )
    }
}
