import axios from 'axios';
import React, { Component } from 'react';
import {
    Container, Row, Col, Button,
    Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText,
    Modal, ModalHeader, ModalBody, ModalFooter, Form, Input
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

            modalDelete: false,
            cartId: '',
            productName: '',

            modalUpdate: false,
            productItem: {},
            quantity: 0
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
                if (response.status === 200) {
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

    toggleDelete() {
        this.setState({
            modalDelete: !this.state.modalDelete,
            cartId: '',
            productName: ''
        })
    }

    toggleUpdate() {
        this.setState({
            modalUpdate: !this.state.modalUpdate,
            productItem: {},
            quantity: 0
        })
    }

    toggleDeleteButton(cartIdValue, productNameValue) {
        this.setState({
            modalDelete: !this.state.modalDelete,
            cartId: cartIdValue,
            productName: productNameValue
        })
    }

    toggleUpdateButton(cartIdValue) {
        axios.get(`http://localhost:8080/customer/cart/${cartIdValue}`,
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            }
        )
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        modalUpdate: !this.state.modalUpdate,
                        productItem: response.data.product,
                        quantity: response.data.quantity
                    })
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.data.message === 'CART_NOT_FOUND') {
                        alert("Item not found in cart!");
                    }
                    else {
                        alert("Error to load item in cart!");
                    }
                }
                else {
                    alert("Fail to load item in cart!");
                }
            })
    }

    handleDelete() {
        axios.delete('http://localhost:8080/customer/cart',
            {
                data: {
                    id: `${this.state.cartId}`,
                    username: `${localStorage.getItem('name')}`
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            }
        )
            .then(response => {
                if (response.status === 200) {
                    alert(response.data);
                    this.toggleDelete();
                    this.loadCart();
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.data.message === 'CART_NOT_FOUND') {
                        alert("Item not found in cart!");
                    }
                    else if (err.response.data.message === 'ACCOUNT_NOT_FOUND') {
                        alert("Account not found");
                    }
                    else if (err.response.data.message === 'ACCOUNT_IS_DISABLED') {
                        alert("Account is disabled");
                    }
                    else {
                        alert("Error to delete");
                    }
                }
                else {
                    alert("Fail to delete!")
                }
            })
    }

    handleDeleteAll() {

        if (window.confirm("Sure to delete all items in cart ?") === false) return;

        axios.delete('http://localhost:8080/customer/cart/all',
            {
                data: {
                    username: `${localStorage.getItem('name')}`
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            }
        )
            .then(response => {
                if (response.status === 200) {
                    alert(response.data);
                    this.loadCart();
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
                    else if (err.response.data.message === 'NO_ITEM_IN_CART') {
                        alert("No item in cart");
                    }
                    else {
                        alert("Error to delete all");
                    }
                }
                else {
                    alert("Fail to delete all!");
                }
            })
    }

    handleChange(e, key) {
        this.setState({ [key]: e.target.value });
    }

    handleUpdate(e) {
        e.preventDefault();
        axios.put('http://localhost:8080/customer/cart/update', 
            {
                username: `${localStorage.getItem('name')}`,
                product: {
                    id: `${this.state.productItem.id}`
                },
                quantity: `${e.target.quantity.value}`
            },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            }
        )
        .then(response => {
            if(response.status === 200){
                alert(response.data);
                this.toggleUpdate();
                this.loadCart();
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
                else if (err.response.data.message === 'PRODUCT_NOT_FOUND') {
                    alert("Product not found");
                }
                else if (err.response.data.message === 'PRODUCT_IS_DISABLED') {
                    alert("Product is disabled");
                }
                else if (err.response.data.message === 'CART_NOT_FOUND') {
                    alert("Item not found in cart");
                }
                else if (err.response.data.message === 'QUANTITY_LESS_THAN_ZERO') {
                    alert("Quantity must be > 0");
                }
                else if (err.response.data.message === 'QUANTITY_GREATER_THAN_AVAILABLE') {
                    alert("Quantity is greater than available");
                }
                else {
                    alert("Error to update quantity");
                }
            }
            else {
                alert("Fail to update quantity");
            }
        })
    }

    render() {
        return (
            <div>
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
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
                        <Col>
                            {
                                this.state.totalItems > 0 &&
                                <div>
                                    <Button color="danger"
                                        onClick={() => this.handleDeleteAll()}>
                                        Delete All
                                    </Button>
                                </div>
                            }
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

                                                <Button color="primary"
                                                    onClick={() => this.toggleUpdateButton(`${cart.id}`)}>
                                                    Update Quantity
                                                </Button>

                                                <Button color="danger"
                                                    onClick={() => this.toggleDeleteButton(`${cart.id}`, `${cart.product.name}`)}>
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
                <Modal isOpen={this.state.modalDelete} toggle={() => this.toggleDelete()}>
                    <ModalHeader toggle={() => this.toggleDelete()}>
                        Notice
                    </ModalHeader>
                    <ModalBody>
                        Sure to delete item: <b>{this.state.productName}</b> ?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={() => this.handleDelete()}>Delete</Button>
                        <Button color="primary" onClick={() => this.toggleDelete()}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Modal size="lg" isOpen={this.state.modalUpdate} toggle={() => this.toggleUpdate()}>
                    <ModalHeader toggle={() => this.toggleUpdate()}>
                        Update quantity in cart
                    </ModalHeader>
                    <ModalBody>
                        <p>
                            <span style={{ fontSize: '20px', marginRight: '15px' }}>
                                <b>Code:</b>
                            </span>
                            <span style={{ fontSize: '20px' }}>
                                {this.state.productItem.id}
                            </span>
                        </p>
                        <p>
                            <span style={{ fontSize: '20px', marginRight: '15px' }}>
                                <b>Name:</b>
                            </span>
                            <span style={{ fontSize: '20px' }}>
                                {this.state.productItem.name}
                            </span>
                        </p>
                        <p>
                            <span style={{ fontSize: '20px', marginRight: '15px' }}>
                                <b>Price:</b>
                            </span>
                            <span style={{ fontSize: '20px' }}>
                                {this.state.productItem.price}$
                            </span>
                        </p>
                        <p>
                            <span style={{ fontSize: '20px', marginRight: '15px' }}>
                                <b>Available:</b>
                            </span>
                            <span style={{ fontSize: '20px' }}>
                                {this.state.productItem.quantity}
                            </span>
                        </p>
                        <Container>
                            <Form onSubmit={(e) => this.handleUpdate(e)}>
                                <Row>
                                    <Col xs="3">
                                        <span style={{ fontSize: '20px', marginRight: '15px' }}>
                                            <b>Quantity:</b>
                                        </span>
                                    </Col>
                                    <Col xs="3">
                                        <Input type="number" name="quantity" id="quantity"
                                            value={this.state.quantity}
                                            onChange={(e) => this.handleChange(e, "quantity")} />
                                    </Col>
                                    <Col xs="3">
                                        <Button color="warning">
                                            Update
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Container>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.toggleUpdate()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
