import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, Label, Input } from 'reactstrap';
import axios from 'axios';

export default class AddCategoryForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            
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
                alert("Success to create!");
            }
        })
        .catch(err => {
            if(err.response){
                if(err.response.data.message === 'NAME_IS_EMPTY'){
                    alert("Name is empty");
                }
                else if(err.response.data.message === 'DESCRIPTION_IS_EMPTY'){
                    alert("Description is empty");
                }
                else{
                    alert("Error");
                }
            }
            else{
                alert("Fail to Create!");
            }
        })
    }

    render() {
        return (
            <div>
                <h2 style={{marginLeft: '50px', marginTop: '20px'}}>
                    Add Category Form
                </h2>
                <br/>
                <Form onSubmit={(e) => this.handleAdd(e)}>
                    <Container>
                        <Row xs="4" className="mb-4">
                            <Col>
                                <Label for="name">Name</Label>
                            </Col>
                            <Col>
                                <Input type="text" name="name" id="name" placeholder="name" />
                            </Col>
                        </Row>
                        <Row xs="4" className="mb-4">
                            <Col>
                                <Label for="description">Description</Label>
                            </Col>
                            <Col>
                                <Input type="text" name="description" id="description"
                                    placeholder="description" />
                            </Col>
                        </Row>
                        <Button color="primary">Create Category</Button>
                    </Container>
                </Form>
            </div>
        )
    }
}
