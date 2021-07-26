import axios from 'axios';
import React, { Component } from 'react';
import { Container, Row, Col, Button, 
    Card, CardImg, CardBody, CardTitle, CardSubtitle ,CardText
} from 'reactstrap';

export default class Cart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cartList: [],
            pageList: [],

            totalItems: 0,
            totalPrice: 0,
            totalQuantity: 0,
        };
    }

    componentDidMount() {
        this.loadCart();
    }

    loadCart() {
        axios.post('http://localhost:8080/customer/cart?page=1',
            {
                username: `${localStorage.getItem('name')}`
            },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            }
        )
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        cartList: response.data.cart,
                        totalItems: response.data.totalItems,
                        totalPrice: response.data.totalPrice,
                        totalQuantity: response.data.totalQuantity
                    })
                    this.handlePageList(response);
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.data.message === 'ACCOUNT_NOT_FOUND') {
                        alert("Account not found");
                    }
                    else if (err.response.data.message === 'ACCOUNT_IS_DISABLED') {
                        alert("Account is disabled");
                    }
                    else {
                        alert("Error - try again");
                    }
                }
                else {
                    alert("Fail to load cart!");
                }
            })
    }

    handlePageList(response) {
        var list = [];
        for (let i = 0; i < response.data.totalPages; i++) {
            list.push(i + 1);
        }
        if (list.length > 1) {
            this.setState({ pageList: list });
        }
        else {
            this.setState({ pageList: [] });
        }
    }

    changePage(page) {
        axios.post(`http://localhost:8080/customer/cart?page=${page}`, 
            {
                username: `${localStorage.getItem('name')}`
            },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            }
        )
        .then(response => {
            if(response.status === 200){
                this.setState({
                    cartList: response.data.cart
                })
            }
        })
        .catch(err => {
            if (err.response) {
                if (err.response.data.message === 'ACCOUNT_NOT_FOUND') {
                    alert("Account not found");
                }
                else if (err.response.data.message === 'ACCOUNT_IS_DISABLED') {
                    alert("Account is disabled");
                }
                else {
                    alert("Error - try again");
                }
            }
            else {
                alert("Fail to load cart!");
            }
        })
    }

    render() {
        return (
            <div>
                <h2 style={{ textAlign: 'center', marginBottom: '30px'}}>
                    Your Cart
                </h2>
                
                <Container>
                    <Row xs="4" className="mb-4">
                        <Col>
                            <h4>Total Items: {this.state.totalItems}</h4>
                        </Col>
                        <Col>
                            <h4>Total Quantity: {this.state.totalQuantity}</h4>
                        </Col>
                        <Col>
                            <h4>Total Price: {this.state.totalPrice}$</h4>
                        </Col>
                    </Row>
                    <Row xs="4" className="mb-2">
                        <Col>
                            {
                                this.state.pageList.map((page, index) => {
                                    return (
                                        <Button key={index} onClick={() => this.changePage(`${page}`)}>
                                            {page}
                                        </Button>
                                    )
                                })
                            }
                        </Col>
                    </Row>
                    <Row xs="4">
                        {
                            this.state.cartList.map((cart, index) => {
                                return (
                                    <Col key={index} className="mb-4">
                                        <Card>
                                            <CardImg top width="50%" src={cart.product.image}
                                                alt={cart.product.name} />
                                            <CardBody>
                                                <CardTitle tag="h5">{cart.product.name} / {cart.product.price}$</CardTitle>
                                                <CardSubtitle tag="h6" className="mb-2 text-muted">Code: {cart.product.id}</CardSubtitle>
                                                <CardText><b>Quantity:</b> {cart.quantity}</CardText>
                                                <CardText><b>Total:</b> {cart.quantity * cart.product.price}$</CardText>
                                                <Button color="danger">
                                                    Delete
                                                </Button>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </Container>
            </div>
        )
    }
}
