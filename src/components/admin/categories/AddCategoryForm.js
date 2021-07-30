import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, Label, Input, FormGroup, Alert } from 'reactstrap';
import axios from 'axios';

export default class AddCategoryForm extends Component {

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
        axios.post('http://localhost:8080/admin/category', 
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
                this.setState({
                    isFail: false,
                    isSuccess: true,
                })
            }
        })
        .catch(err => {
            if(err.response){
                if(err.response.data.message === 'NAME_IS_EMPTY'){
                    this.setState({messageFail: 'Name is empty.'})
                }
                else{
                    this.setState({messageFail: 'Error to add category.'})
                }
            }
            else{
                this.setState({messageFail: 'Fail to add category.'})
            }
            this.setState({
                isFail: true,
                isSuccess: false,
            })
        })
    }

    render() {
        return (
            <div>
                <h2 style={{textAlign: 'center'}}>
                    Add Category Form
                </h2>
                <br/>
                <Form onSubmit={(e) => this.handleAdd(e)}>
                    <Container>
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <FormGroup className="mb-4">
                                    <Label for="name" className="mr-sm-2"><b>Name</b></Label>
                                    <Input type="text" name="name" id="name" />
                                    <p>
                                        <i>*Not empty.</i>
                                    </p>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <FormGroup className="mb-4">
                                    <Label for="description" className="mr-sm-2"><b>Description</b></Label>
                                    <Input type="text" name="description" id="description" />
                                    <p>
                                        <i>*Can be blank.</i>
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
                                {
                                    this.state.isSuccess && 
                                    <Alert color="success">
                                        Success to add category.
                                    </Alert>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <Button color="primary">Add Category</Button>
                            </Col>
                        </Row>
                    </Container>
                </Form>
            </div>
        )
    }
}
