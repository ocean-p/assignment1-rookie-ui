import axios from 'axios';
import React, { Component } from 'react';
import { Container, Row, Col, Alert } from 'reactstrap';

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

            isLoadFail: false,
            messageLoadFail: '',
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
                if(response.data.successCode === 'LOAD_PRODUCT_SUCCESS'){
                    this.setState({
                        name: response.data.datas.name,
                        price: response.data.datas.price,
                        quantity: response.data.datas.quantity,
                        image: response.data.datas.image,
                        description: response.data.datas.description,
                        categoryId: response.data.datas.categoryId,
                        createDate: response.data.datas.createDate,
                        averageRate: response.data.datas.averageRate
                    })
                }
            }
        })
        .catch(err => {
            if(err.response){
                if(err.response.data.message === 'PRODUCT_NOT_FOUND'){
                    this.setState({messageLoadFail: 'Product not found.'});
                }
                else if(err.response.data.message === 'PRODUCT_IS_DISABLED'){
                    this.setState({messageLoadFail: 'Product is disabled.'});
                }
                else{
                    this.setState({messageLoadFail: 'Error to load product info.'});
                }
            }
            else{
                this.setState({messageLoadFail: 'Fail to load product info.'});
            }
            this.setState({isLoadFail: true});
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
                if(response.data.successCode === 'LOAD_CATEGORY_SUCCESS') {
                    this.setState({ categoryList: response.data.datas })
                }
            }
        })
        .catch(() => {
            this.setState({
                isLoadFail: true,
                messageLoadFail: 'Fail to load category'
            })
        })
    }


    render() {
        return (
            <div>
                <Container>
                    <Row xs="2">
                        {
                            this.state.isLoadFail &&
                            <Alert color="danger">
                                {this.state.messageLoadFail}
                            </Alert>
                        }
                    </Row>
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
                                <select style={{height: '40px', width: '130px', fontSize: '20px'}} disabled>
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
