import axios from 'axios';
import React, { Component } from 'react';
import { Container, Form, Row, Col, Button } from 'reactstrap';

export default class Rating extends Component {

    constructor(props) {
        super(props);
        this.state = {
            point: 0
        };
    }

    componentDidMount() {
        this.getPoint();
    }

    getPoint() {
        axios.post('http://localhost:8080/customer/product/rating/point',
            {
                productId: `${this.props.id}`,
                username: `${localStorage.getItem('name')}`
            },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            }
        )
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        point: response.data
                    })
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.data.message === 'PRODUCT_NOT_FOUND') {
                        alert("Product not found");
                    }
                    else if (err.response.data.message === 'PRODUCT_IS_DISABLED') {
                        alert("Product is disabled");
                    }
                    else if (err.response.data.message === 'ACCOUNT_NOT_FOUND') {
                        alert("Account not found");
                    }
                    else if (err.response.data.message === 'ACCOUNT_IS_DISABLED') {
                        alert("Account is disabled");
                    }
                    else {
                        alert("Error to get point!");
                    }
                }
                else {
                    alert("Fail to get point!");
                }
            })
    }

    handleRating(e) {
        e.preventDefault();
        axios.post('http://localhost:8080/customer/product/rating', 
            {
                productId: `${this.props.id}`,
                username: `${localStorage.getItem('name')}`,
                point: e.target.point.value
            },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            }
        )
        .then(response => {
            if(response.status === 200){
                alert(response.data);
                this.props.onClose();
            }
        })
        .catch(err => {
            if (err.response) {
                if (err.response.data.message === 'PRODUCT_NOT_FOUND') {
                    alert("Product not found");
                }
                else if (err.response.data.message === 'PRODUCT_IS_DISABLED') {
                    alert("Product is disabled");
                }
                else if (err.response.data.message === 'ACCOUNT_NOT_FOUND') {
                    alert("Account not found");
                }
                else if (err.response.data.message === 'ACCOUNT_IS_DISABLED') {
                    alert("Account is disabled");
                }
                else if (err.response.data.message === 'POINT_NOT_CORRECT') {
                    alert("Point - Max:10, Min:1");
                }
                else if (err.response.data.message === 'RATING_ALREADY') {
                    alert("This product already rated - please update your rate");
                }
                else {
                    alert("Error to rate!");
                }
            }
            else {
                alert("Fail to rate!");
            }
        })
    }

    handleUpdateRating(e) {
        e.preventDefault();
        axios.put('http://localhost:8080/customer/product/rating', 
            {
                productId: `${this.props.id}`,
                username: `${localStorage.getItem('name')}`,
                point: e.target.point.value
            },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            }
        )
        .then(response => {
            if(response.status === 200){
                alert(response.data);
                this.props.onClose();
            }
        })
        .catch(err => {
            if (err.response) {
                if (err.response.data.message === 'PRODUCT_NOT_FOUND') {
                    alert("Product not found");
                }
                else if (err.response.data.message === 'PRODUCT_IS_DISABLED') {
                    alert("Product is disabled");
                }
                else if (err.response.data.message === 'ACCOUNT_NOT_FOUND') {
                    alert("Account not found");
                }
                else if (err.response.data.message === 'ACCOUNT_IS_DISABLED') {
                    alert("Account is disabled");
                }
                else if (err.response.data.message === 'POINT_NOT_CORRECT') {
                    alert("Point - Max:10, Min:1");
                }
                else if (err.response.data.message === 'RATING_NOT_FOUND') {
                    alert("Not yet rating this product - can not update");
                }
                else {
                    alert("Error to update!");
                }
            }
            else {
                alert("Fail to update!");
            }
        })
    }

    render() {
        return (
            <div>
                {
                    this.state.point <= 0 &&
                    <div>
                        <h4 style={{marginBottom: '20px'}}>
                            Not yet rating this product
                        </h4>
                        <Container>
                            <Form onSubmit={(e) => this.handleRating(e)}>
                                <Row xs="4">
                                    <Col>
                                        <select style={{height: '40px', width: '100px', paddingLeft: '10px'}}
                                            name="point" id="point">
                                            <option value="10">10 Point</option>
                                            <option value="9">9 Point</option>
                                            <option value="8">8 Point</option>
                                            <option value="7">7 Point</option>
                                            <option value="6">6 Point</option>
                                            <option value="5">5 Point</option>
                                            <option value="4">4 Point</option>
                                            <option value="3">3 Point</option>
                                            <option value="2">2 Point</option>
                                            <option value="1">1 Point</option>
                                        </select>
                                    </Col>
                                    <Col>
                                        <Button color="primary">Rating</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Container>
                    </div>
                }
                {
                    this.state.point > 0 &&
                    <div>
                        <h4>
                            Already rating - point: {this.state.point}
                        </h4>
                        <p style={{ color: 'grey', marginBottom: '20px'}}>
                            Can update rating anytime
                        </p>
                        <Container>
                            <Form onSubmit={(e) => this.handleUpdateRating(e)}>
                                <Row xs="4">
                                    <Col>
                                        <select style={{height: '40px', width: '100px', paddingLeft: '10px'}}
                                            name="point" id="point">
                                            <option value="10">10 Point</option>
                                            <option value="9">9 Point</option>
                                            <option value="8">8 Point</option>
                                            <option value="7">7 Point</option>
                                            <option value="6">6 Point</option>
                                            <option value="5">5 Point</option>
                                            <option value="4">4 Point</option>
                                            <option value="3">3 Point</option>
                                            <option value="2">2 Point</option>
                                            <option value="1">1 Point</option>
                                        </select>
                                    </Col>
                                    <Col>
                                        <Button color="success">Update</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Container>
                    </div>
                }
            </div>
        )
    }
}
