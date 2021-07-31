import axios from 'axios';
import React, { Component } from 'react';
import { Container, Form, Row, Col, Button, Alert } from 'reactstrap';

export default class Rating extends Component {

    constructor(props) {
        super(props);
        this.state = {
            point: 0,

            isRatingFail: false,
            messageRatingFail: '',

            isUpdateFail: false,
            messageUpdateFail: '',

            isLoadFail: false,
            messageLoadFail: ''
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
                    if(response.data.successCode === 'LOAD_RATING_SUCCESS'){
                        this.setState({
                            point: response.data.datas
                        })
                    }
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.data.message === 'PRODUCT_NOT_FOUND') {
                        this.setState({messageLoadFail: 'Product not found.'});
                    }
                    else if (err.response.data.message === 'PRODUCT_IS_DISABLED') {
                        this.setState({messageLoadFail: 'Product is disabled.'});
                    }
                    else if (err.response.data.message === 'ACCOUNT_NOT_FOUND') {
                        this.setState({messageLoadFail: 'Account not found.'});
                    }
                    else if (err.response.data.message === 'ACCOUNT_IS_DISABLED') {
                        this.setState({messageLoadFail: 'Account is disabled.'});
                    }
                    else {
                        this.setState({messageLoadFail: 'Error to get point.'});
                    }
                }
                else {
                    this.setState({messageLoadFail: 'Fail to get point.'});
                }
                this.setState({isLoadFail: true});
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
                if(response.data.successCode === 'ADD_RATING_SUCCESS'){
                    this.props.onClose();
                }
            }
        })
        .catch(err => {
            if (err.response) {
                switch (err.response.data.message) {
                    case 'PRODUCT_NOT_FOUND':
                        this.setState({messageRatingFail: 'Product not found.'});
                        break;
                    case 'PRODUCT_IS_DISABLED':
                        this.setState({messageRatingFail: 'Product is disabled.'});
                        break;
                    case 'ACCOUNT_NOT_FOUND':
                        this.setState({messageRatingFail: 'Account not found.'});
                        break;
                    case 'ACCOUNT_IS_DISABLED':
                        this.setState({messageRatingFail: 'Account is disabled.'});
                        break;
                    case 'POINT_NOT_CORRECT':
                        this.setState({messageRatingFail: 'Point - Max:10, Min:1.'});
                        break;
                    case 'RATING_ALREADY':
                        this.setState({messageRatingFail: 'This product already rated - please update your rate.'});
                        break;
                    default: 
                        this.setState({messageRatingFail: 'Error to rate this product.'});
                }
            }
            else {
                this.setState({messageRatingFail: 'Fail to rate this product.'});
            }
            this.setState({isRatingFail: true})
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
                if(response.data.successCode === 'UPDATE_RATING_SUCCESS'){
                    this.props.onClose();
                }
            }
        })
        .catch(err => {
            if (err.response) {
                switch (err.response.data.message) {
                    case 'PRODUCT_NOT_FOUND':
                        this.setState({messageUpdateFail: 'Product not found.'});
                        break;
                    case 'PRODUCT_IS_DISABLED':
                        this.setState({messageUpdateFail: 'Product is disabled.'});
                        break;
                    case 'ACCOUNT_NOT_FOUND':
                        this.setState({messageUpdateFail: 'Account not found.'});
                        break;
                    case 'ACCOUNT_IS_DISABLED':
                        this.setState({messageUpdateFail: 'Account is disabled.'});
                        break;
                    case 'POINT_NOT_CORRECT':
                        this.setState({messageUpdateFail: 'Point - Max:10, Min:1.'});
                        break;
                    case 'RATING_NOT_FOUND':
                        this.setState({messageUpdateFail: 'Not yet rating this product - can not update.'});
                        break;
                    default: 
                        this.setState({messageUpdateFail: 'Error to update rating this product.'});
                }
            }
            else {
                this.setState({messageUpdateFail: 'Fail to update rating this product.'});
            }
            this.setState({isUpdateFail: true});
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
                            {
                                this.state.isLoadFail &&
                                <Alert color="danger">
                                    {this.state.messageLoadFail}
                                </Alert>
                            }
                            <Form onSubmit={(e) => this.handleRating(e)}>
                                <Row xs="4" className="mb-4">
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
                                <Row xs="2">
                                    {
                                        this.state.isRatingFail &&
                                        <Alert color="danger">
                                            {this.state.messageRatingFail}
                                        </Alert>
                                    }
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
                            {
                                this.state.isLoadFail &&
                                <Alert color="danger">
                                    {this.state.messageLoadFail}
                                </Alert>
                            }
                            <Form onSubmit={(e) => this.handleUpdateRating(e)}>
                                <Row xs="4" className="mb-4">
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
                                <Row xs="2">
                                    {
                                        this.state.isUpdateFail &&
                                        <Alert color="danger">
                                            {this.state.messageUpdateFail}
                                        </Alert>
                                    }
                                </Row>
                            </Form>
                        </Container>
                    </div>
                }
            </div>
        )
    }
}
