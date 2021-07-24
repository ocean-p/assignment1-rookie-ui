import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, Label, Input } from 'reactstrap';
import axios from 'axios';

export default class AddProductForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categoryList: []
        };
    }

    componentDidMount() {
        this.loadCategory();
    }

    loadCategory() {
        axios.get('http://localhost:8080/admin/category/list', {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({ categoryList: response.data })
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    handleAdd(e) {
        e.preventDefault();
        axios.post('http://localhost:8080/admin/product', 
            {
                name: e.target.name.value,
                price: e.target.price.value,
                quantity: e.target.quantity.value,
                description: e.target.description.value,
                image: e.target.image.value,
                categoryId: e.target.category.value
            },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } 
            }
        )
        .then(response => {
            if(response.status === 200){
                alert('Success to add product');
            }
        })
        .catch(err => {
            if(err.response){
                if(err.response.data.message === 'CATEGORY_NOT_FOUND'){
                    alert("Category not found");
                }
                else if(err.response.data.message === 'CATEGORY_IS_DISABLED'){
                    alert("Category is disabled");
                }
                else if(err.response.data.message === 'NAME_IS_EMPTY'){
                    alert("Name is empty");
                }
                else if(err.response.data.message === 'IMAGEURL_IS_EMPTY'){
                    alert("Image url is empty");
                }
                else if(err.response.data.message === 'PRICE_LESS_THAN_ZERO'){
                    alert("Price must be > 0");
                }
                else if(err.response.data.message === 'QUANTITY_LESS_THAN_ZERO'){
                    alert("Quantity must be > 0");
                }
                else{
                    alert("Error");
                }
            }
            else{
                alert("Fail to add product!");
            }
        })
    }

    render() {
        return (
            <div>
                <h2 style={{marginLeft: '50px', marginTop: '20px'}}>
                    Add Product Form
                </h2>
                <br/>
                <Form onSubmit={(e) => this.handleAdd(e)}>
                    <Container>
                        <Row xs="4" className="mb-4">
                            <Col>
                                <Label for="name">Name</Label>
                            </Col>
                            <Col>
                                <Input type="text" name="name" id="name"
                                    placeholder="name"/>
                            </Col>
                        </Row>
                        <Row xs="4" className="mb-4">
                            <Col>
                                <Label for="price">Price</Label>
                            </Col>
                            <Col>
                                <Input type="text" name="price" id="price"
                                    placeholder="price"/>
                            </Col>
                        </Row>
                        <Row xs="4" className="mb-4">
                            <Col>
                                <Label for="quantity">Quantity</Label>
                            </Col>
                            <Col>
                                <Input type="number" name="quantity" id="quantity"
                                    placeholder="quantity"/>
                            </Col>
                        </Row>
                        <Row xs="4" className="mb-4">
                            <Col>
                                <Label for="description">Description</Label>
                            </Col>
                            <Col>
                                <Input type="text" name="description" id="description"
                                    placeholder="description -- can be blank"/>   
                            </Col>
                        </Row>
                        <Row xs="4" className="mb-4">
                            <Col>
                                <Label for="image">Image URL</Label>
                            </Col>
                            <Col>
                                <Input type="text" name="image" id="image"
                                    placeholder="image"/>    
                            </Col>
                        </Row>
                        <Row xs="4" className="mb-4">
                            <Col>
                                <Label for="category">Category</Label>
                            </Col>
                            <Col>
                                <select style={{height: '40px', width: '100px'}} id="category" name="category">
                                    {this.state.categoryList.map((category, index) => {
                                        return(
                                            <option key={index} value={category.id}>
                                                {category.name}
                                            </option>
                                        )
                                    })}
                                </select>
                            </Col>
                        </Row>
                        <Button color="primary">Add Product</Button>
                    </Container>
                </Form>
            </div>
        )
    }
}
