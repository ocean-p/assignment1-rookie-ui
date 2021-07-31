import axios from 'axios';
import React, { Component } from 'react';
import {
    Container, Row, Col, Button,
    Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText,
    Modal, ModalHeader, ModalBody, ModalFooter, Form, Input, Alert
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

            modalDeleteAll: false,
            modalDelete: false,
            cartId: '',
            productName: '',

            modalUpdate: false,
            productItem: {},
            quantity: 0,

            isUpdateFail: false,
            messageUpdateFail: '',

            isDeleteFail: false,
            messageDeleteFail: '',

            isLoadFail: false,
            messageLoadFail: '',
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
                    if(response.data.successCode === 'LOAD_CART_SUCCESS'){
                        this.setState({
                            cartList: response.data.datas.cart,
                            totalItems: response.data.datas.totalItems,
                            totalPrice: response.data.datas.totalPrice,
                            totalQuantity: response.data.datas.totalQuantity
                        })
                        this.handlePageList(response);
                    }
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.data.message === 'ACCOUNT_NOT_FOUND') {
                        this.setState({messageLoadFail: 'Account not found.'});
                    }
                    else if (err.response.data.message === 'ACCOUNT_IS_DISABLED') {
                        this.setState({messageLoadFail: 'Account is disabled.'});
                    }
                    else {
                        this.setState({messageLoadFail: 'Error to load cart.'});
                    }
                }
                else {
                    this.setState({messageLoadFail: 'Fail to load cart.'});
                }
                this.setState({isLoadFail: true});
            })
    }

    handlePageList(response) {
        var list = [];
        for (let i = 0; i < response.data.datas.totalPages; i++) {
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
                    if(response.data.successCode === 'LOAD_CART_SUCCESS'){
                        this.setState({
                            cartList: response.data.datas.cart,
                            isLoadFail: false
                        })
                    }
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.data.message === 'ACCOUNT_NOT_FOUND') {
                        this.setState({messageLoadFail: 'Account not found.'});
                    }
                    else if (err.response.data.message === 'ACCOUNT_IS_DISABLED') {
                        this.setState({messageLoadFail: 'Account is disabled.'});
                    }
                    else {
                        this.setState({messageLoadFail: 'Error to load cart.'});
                    }
                }
                else {
                    this.setState({messageLoadFail: 'Fail to load cart.'});
                }
                this.setState({isLoadFail: true});
            })
    }

    toggleDelete() {
        this.setState({
            modalDelete: !this.state.modalDelete,
            cartId: '',
            productName: '',
            isDeleteFail: false
        })
    }

    toggleUpdate() {
        this.setState({
            modalUpdate: !this.state.modalUpdate,
            productItem: {},
            quantity: 0,
            isUpdateFail: false
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
                    if (response.data.successCode === 'LOAD_CART_SUCCESS'){
                        this.setState({
                            modalUpdate: !this.state.modalUpdate,
                            productItem: response.data.datas.product,
                            quantity: response.data.datas.quantity
                        })
                    }
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
                    if(response.data.successCode === 'DELETE_ITEM_SUCCESS'){
                        this.toggleDelete();
                        this.loadCart();
                    }
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.data.message === 'CART_NOT_FOUND') {
                        this.setState({messageDeleteFail: 'Item not found in cart.'});
                    }
                    else if (err.response.data.message === 'ACCOUNT_NOT_FOUND') {
                        this.setState({messageDeleteFail: 'Account not found.'});
                    }
                    else if (err.response.data.message === 'ACCOUNT_IS_DISABLED') {
                        this.setState({messageDeleteFail: 'Account is disabled.'});
                    }
                    else {
                        this.setState({messageDeleteFail: 'Error to delete item in cart'});
                    }
                }
                else {
                    this.setState({messageDeleteFail: 'Fail to delete item in cart'});
                }
                this.setState({isDeleteFail: true});
            })
    }

    toggleDeleteAll() {
        this.setState({
            modalDeleteAll: !this.state.modalDeleteAll,
            isDeleteFail: false
        })
    }

    handleDeleteAll() {
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
                    if(response.data.successCode === 'DELETE_ITEM_SUCCESS'){
                        this.toggleDeleteAll();
                        this.loadCart();
                    }
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.data.message === 'ACCOUNT_NOT_FOUND') {
                        this.setState({messageDeleteFail: 'Account not found.'});
                    }
                    else if (err.response.data.message === 'ACCOUNT_IS_DISABLED') {
                        this.setState({messageDeleteFail: 'Account is disabled.'});
                    }
                    else if (err.response.data.message === 'NO_ITEM_IN_CART') {
                        this.setState({messageDeleteFail: 'No item in cart.'});
                    }
                    else {
                        this.setState({messageDeleteFail: 'Error to delete all items.'});
                    }
                }
                else {
                    this.setState({messageDeleteFail: 'Fail to delete all items.'});
                }
                this.setState({isDeleteFail: true});
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
                if(response.data.successCode === 'UPDATE_QUANTITY_SUCCESS'){
                    this.toggleUpdate();
                    this.loadCart();
                }
            }
        })
        .catch(err => {
            if (err.response) {
                switch (err.response.data.message) {
                    case 'ACCOUNT_NOT_FOUND':
                        this.setState({messageUpdateFail: 'Account not found.'});
                        break;
                    case 'ACCOUNT_IS_DISABLED':
                        this.setState({messageUpdateFail: 'Account is disabled.'});
                        break;
                    case 'PRODUCT_NOT_FOUND':
                        this.setState({messageUpdateFail: 'Product not found.'});
                        break;
                    case 'PRODUCT_IS_DISABLED':
                        this.setState({messageUpdateFail: 'Product is disabled.'});
                        break;
                    case 'CART_NOT_FOUND':
                        this.setState({messageUpdateFail: 'Item not found in cart'});
                        break;
                    case 'QUANTITY_LESS_THAN_ZERO':
                        this.setState({messageUpdateFail: 'Quantity must be > 0'});
                        break;
                    case 'QUANTITY_GREATER_THAN_AVAILABLE':
                        this.setState({messageUpdateFail: 'Quantity is greater than available'});
                        break;
                    default: 
                        this.setState({messageUpdateFail: 'Error to update quantity.'});
                }
            }
            else {
                this.setState({messageUpdateFail: 'Fail to update quantity.'});
            }
            this.setState({isUpdateFail: true});
        })
    }

    render() {
        return (
            <div>
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
                    Your Cart
                </h2>

                <Container>
                    <Row>
                        <Col sm="12" md={{ size: 6, offset: 3 }}>
                            {
                                this.state.isLoadFail &&
                                <Alert color="danger">
                                    {this.state.messageLoadFail}
                                </Alert>
                            }
                        </Col>
                    </Row>
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
                                        onClick={() => this.toggleDeleteAll()}>
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
                        {
                            this.state.isDeleteFail &&
                            <Alert color="danger">
                                {this.state.messageDeleteFail}
                            </Alert>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={() => this.handleDelete()}>Delete</Button>
                        <Button color="primary" onClick={() => this.toggleDelete()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.modalDeleteAll}>
                    <ModalHeader>
                        Notice
                    </ModalHeader>
                    <ModalBody>
                        Sure to delete all items ?
                        {
                            this.state.isDeleteFail &&
                            <Alert color="danger">
                                {this.state.messageDeleteFail}
                            </Alert>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={() => this.handleDeleteAll()}>Delete All</Button>
                        <Button color="primary" onClick={() => this.toggleDeleteAll()}>Cancel</Button>
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
                                <Row className="mb-4">
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
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.toggleUpdate()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
