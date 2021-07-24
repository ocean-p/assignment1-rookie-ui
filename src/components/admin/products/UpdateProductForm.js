import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, Label, Input } from 'reactstrap';
import axios from 'axios';

export default class UpdateProductForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
           name: '',
           price: 0,
           quantity: 0,
           description: '',
           image: '',
           categoryId: 1, 
           categoryList: []
        };
    }

    componentDidMount() {
        this.loadCategory();
        this.loadData();
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

    loadData() {
        axios.get(`http://localhost:8080/admin/product/${this.props.id}`, 
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            }
        )
        .then(response => {
            if(response.status === 200){
                this.setState({
                    name: response.data.name,
                    price: response.data.price,
                    quantity: response.data.quantity,
                    image: response.data.image,
                    description: response.data.description,
                    categoryId: response.data.categoryId
                })
            }
        })
        .catch(err => {
            if(err.response){
                if(err.response.data.message === 'PRODUCT_NOT_FOUND'){
                    alert("Product not found");
                }
                else if(err.response.data.message === 'PRODUCT_IS_DISABLED'){
                    alert("Product is disabled");
                }
                else{
                    alert("Error");
                }
            }
            else{
                alert("Fail to load data!");
            }
        })
    }

    handleUpdate(e) {
        e.preventDefault();
        axios.put(`http://localhost:8080/admin/product/${this.props.id}`, 
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
                alert('Success to update product!');
                this.props.onUpdate();
            }
        })
        .catch(err => {
            if(err.response){
                if(err.response.data.message === 'PRODUCT_NOT_FOUND'){
                    alert("Product not found");
                }
                else if(err.response.data.message === 'PRODUCT_IS_DISABLED'){
                    alert("Product is disabled");
                }
                else if(err.response.data.message === 'CATEGORY_NOT_FOUND'){
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
                else if(err.response.data.message === 'DESCRIPTION_IS_EMPTY'){
                    alert("Description is empty");
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
                alert("Fail to update product!");
            }
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
                                <Label for="price">Price</Label>
                            </Col>
                            <Col>
                                <Input type="text" name="price" id="price"
                                    value={this.state.price} 
                                    onChange={(e) => this.handleChange(e, "price")}/>
                            </Col>
                        </Row>
                        <Row xs="3" className="mb-4">
                            <Col>
                                <Label for="quantity">Quantity</Label>
                            </Col>
                            <Col>
                                <Input type="number" name="quantity" id="quantity"
                                    value={this.state.quantity} 
                                    onChange={(e) => this.handleChange(e, "quantity")}/>
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
                        <Row xs="3" className="mb-4">
                            <Col>
                                <Label for="image">Image URL</Label>
                            </Col>
                            <Col>
                                <Input type="text" name="image" id="image"
                                    value={this.state.image} 
                                    onChange={(e) => this.handleChange(e, "image")}/>    
                            </Col>
                        </Row>
                        <Row xs="3" className="mb-4">
                            <Col>
                                <Label for="category">Category</Label>
                            </Col>
                            <Col>
                                <select style={{height: '40px', width: '100px'}} id="category" name="category">
                                    {this.state.categoryList.map((category, index) => {
                                        return(
                                            <option key={index} value={category.id} 
                                                selected={this.state.categoryId === category.id}>
                                                {category.name}
                                            </option>
                                        )
                                    })}
                                </select>
                            </Col>
                        </Row>
                        <Button color="warning">Update</Button>
                    </Container>
                </Form>
            </div>
        )
    }
}
