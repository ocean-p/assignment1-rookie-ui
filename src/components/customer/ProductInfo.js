import axios from 'axios';
import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';

export default class ProductInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            price: '',
            image: '',
            quantity: '',
            description: '',
            averageRate: '',
            createDate: '',
            categoryId: '',

            categoryList: [],
        };
    }

    componentDidMount() {
        this.loadInfo();
        this.loadCategory();
    }

    loadInfo() {
        axios.get(`http://localhost:8080/customer/product/${this.props.id}`, 
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
                    categoryId: response.data.categoryId,
                    createDate: response.data.createDate,
                    averageRate: response.data.averageRate
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
                    alert("Error to load product info!");
                }
            }
            else{
                alert("Fail to load data!");
            }
        })
    }

    loadCategory() {
        axios.get('http://localhost:8080/customer/category', 
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            }
        )
        .then(response => {
            if (response.status === 200) {
                this.setState({ categoryList: response.data })
            }
        })
        .catch(() => {
            alert("Fail to load category!")
        })
    }


    render() {
        return (
            <div>
                <Container>
                    <Row xs="2">
                        <img src={this.state.image} 
                                alt={this.state.name}/>
                        <Col xs="6">
                            <p>
                                <span style={{fontSize: '20px', marginRight: '15px'}}>
                                    <b>Name:</b>
                                </span>
                                <span style={{fontSize: '20px'}}>
                                    {this.state.name}
                                </span> 
                            </p>
                            <p>
                                <span style={{fontSize: '20px', marginRight: '15px'}}>
                                    <b>Price:</b>
                                </span>
                                <span style={{fontSize: '20px'}}>
                                    {this.state.price}$
                                </span> 
                            </p>
                            <p>
                                <span style={{fontSize: '20px', marginRight: '15px'}}>
                                    <b>Quantity:</b>
                                </span>
                                <span style={{fontSize: '20px'}}>
                                    {this.state.quantity}
                                </span> 
                            </p>
                            <p>
                                <span style={{fontSize: '20px', marginRight: '15px'}}>
                                    <b>Description:</b>
                                </span>
                                <span style={{fontSize: '20px'}}>
                                    {this.state.description}
                                </span> 
                            </p>
                            <p>
                                <span style={{fontSize: '20px', marginRight: '15px'}}>
                                    <b>Point:</b>
                                </span>
                                <span style={{fontSize: '20px'}}>
                                    {this.state.averageRate}/10
                                </span> 
                            </p>
                            <p>
                                <span style={{fontSize: '20px', marginRight: '15px'}}>
                                    <b>Publish:</b>
                                </span>
                                <span style={{fontSize: '20px'}}>
                                    {this.state.createDate}
                                </span> 
                            </p>
                            <p>
                                <span style={{fontSize: '20px', marginRight: '15px'}}>
                                    <b>Category:</b>
                                </span>
                                <select style={{height: '40px', width: '100px', fontSize: '20px'}} disabled>
                                    {this.state.categoryList.map((category, index) => {
                                        return(
                                            <option key={index} value={category.id} 
                                                selected={this.state.categoryId === category.id}>
                                                {category.name}
                                            </option>
                                        )
                                    })}
                                </select>
                            </p>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
