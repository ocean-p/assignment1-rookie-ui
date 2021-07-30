import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, Label, Input, Alert } from 'reactstrap';
import axios from 'axios';

export default class UpdateCategoryForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',

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
        axios.get(`http://localhost:8080/admin/category/${this.props.id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
        .then(response => {
            if(response.status === 200){
                this.setState({
                    name: response.data.name,
                    description: response.data.description
                })
            }
        })
        .catch(err => {
            if(err.response){
                if(err.response.data.message === 'CATEGORY_NOT_FOUND'){
                    this.setState({messageLoadFail: 'Category not found.'});
                }
                else if(err.response.data.message === 'CATEGORY_IS_DISABLED'){
                    this.setState({messageLoadFail: 'Category is disabled.'});
                }
                else{
                    this.setState({messageLoadFail: 'Error to load category.'});
                }
            }
            else{
                this.setState({messageLoadFail: 'Fail to load category.'});
            }
            this.setState({isLoadFail: true});
        })
    }


    handleUpdate(e) {
        e.preventDefault();
        axios.put(`http://localhost:8080/admin/category/${this.props.id}`, 
            {
                name: e.target.name.value,
                description: e.target.description.value
            },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            }
        )
        .then(response => {
            if(response.status === 200){
                this.props.onUpdate();
            }
        })
        .catch(err => {
            if(err.response){
                if(err.response.data.message === 'CATEGORY_NOT_FOUND'){
                    this.setState({messageUpdateFail: 'Category not found.'});
                }
                else if(err.response.data.message === 'CATEGORY_IS_DISABLED'){
                    this.setState({messageUpdateFail: 'Category is disabled.'});
                }
                else if(err.response.data.message === 'NAME_IS_EMPTY'){
                    this.setState({messageUpdateFail: 'Name is empty.'});
                }
                else if(err.response.data.message === 'DESCRIPTION_IS_EMPTY'){
                    this.setState({messageUpdateFail: 'Description is empty.'});
                }
                else{
                    this.setState({messageUpdateFail: 'Error to update category.'});
                }
            }
            else{
                this.setState({messageUpdateFail: 'Fail to update category.'});
            }
            this.setState({isUpdateFail: true})
        })
    }

    handleChange(e, key) {
        this.setState({ [key]: e.target.value });
    }

    render() {
        return (
            <div>
                <Form onSubmit={(e) => this.handleUpdate(e)}>
                    <Container>
                        <Row xs="2">
                            {
                                this.state.isLoadFail &&
                                <Alert color="danger">
                                    {this.state.messageLoadFail}
                                </Alert>
                            }
                        </Row>
                        <Row xs="3" className="mb-4">
                            <Col>
                                <Label for="name">Name</Label>
                            </Col>
                            <Col>
                                <Input type="text" name="name" id="name"
                                    value={this.state.name} 
                                    onChange={(e) => this.handleChange(e, "name")}/>
                            </Col>
                        </Row>
                        <Row xs="3" className="mb-4">
                            <Col>
                                <Label for="description">Description</Label>
                            </Col>
                            <Col>
                                <Input type="text" name="description" id="description"
                                    value={this.state.description} 
                                    onChange={(e) => this.handleChange(e, "description")}/>
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
