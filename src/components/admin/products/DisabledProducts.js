import React, { Component } from 'react';
import {
    Card, Button, CardImg, CardTitle, CardText,
    CardSubtitle, CardBody, Container, Row, Col,
    Modal, ModalHeader, ModalBody, ModalFooter, Alert
} from 'reactstrap';
import axios from 'axios';

export default class DisabledProducts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productList: [],
            pageList: [],

            modal: false,
            productId: '',
            productName: '',

            isRestoreFail: false,
            messageRestoreFail: '',

            isLoadFail: false,
            messageLoadFail: '',
        };
    }

    loadData() {
        axios.get('http://localhost:8080/admin/product/deleted?page=1', {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        productList: response.data.productList
                    })
                    this.handlePageList(response);
                }
            })
            .catch(() => {
                this.setState({
                    isLoadFail: true,
                    messageLoadFail: 'Fail to load disabled products.'
                })
            })
    }

    componentDidMount() {
        this.loadData();
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
        axios.get(`http://localhost:8080/admin/product/deleted?page=${page}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        productList: response.data.productList,
                        isLoadFail: true,
                    })
                }
            })
            .catch(() => {
                this.setState({
                    isLoadFail: true,
                    messageLoadFail: 'Fail to change page.'
                })
            })
    }

    toggle() {
        this.setState({ 
            modal: !this.state.modal,
            productName: '',
            productId: '' ,
            isRestoreFail: false
        })
    }

    toggleButton(productIdValue, productNameValue) {
        this.setState({
            modal: !this.state.modal,
            productName: productNameValue,
            productId: productIdValue
        })
    }

    handleRestore() {
        axios.post(`http://localhost:8080/admin/product/restore/${this.state.productId}`,
            {},
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            }
        )
            .then(response => {
                if (response.status === 200) {
                    this.toggle();
                    this.loadData();
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.data.message === 'PRODUCT_NOT_FOUND') {
                        this.setState({messageRestoreFail: 'Product not found'});
                    }
                    else if (err.response.data.message === 'PRODUCT_ACTIVE') {
                        this.setState({messageRestoreFail: 'Product already active'});
                    }
                    else {
                        this.setState({messageRestoreFail: 'Error to restore product.'});
                    }
                }
                else {
                    this.setState({messageRestoreFail: 'Fail to restore product.'});
                }
                this.setState({isRestoreFail: true});
            })
    }

    render() {
        return (
            <div>
                <h2 style={{ textAlign: 'center' }}>
                    Disabled Products
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
                </Container>
                <br />
                <Container>
                    <Row xs="3" className="mb-3">
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
                        {this.state.productList.map((product, index) => {
                            return (
                                <Col key={index} className="mb-4">
                                    <Card>
                                        <CardImg top width="50%" src={product.image}
                                            alt={product.name} />
                                        <CardBody>
                                            <CardTitle tag="h5">{product.name} - {product.price}$</CardTitle>
                                            <CardSubtitle tag="h6" className="mb-2 text-muted">Code: {product.id} -- {product.averageRate}/10 star</CardSubtitle>
                                            <CardText>Quantity: {product.quantity}</CardText>
                                            <CardText>Description: {product.description}</CardText>
                                            <CardText>Update-Date: {product.updateDate}</CardText>
                                            <CardText>Create-Date: {product.createDate}</CardText>

                                            <Button color="success" onClick={() => this.toggleButton(`${product.id}`, `${product.name}`)}>
                                                Restore
                                            </Button>

                                        </CardBody>
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>
                    <Modal isOpen={this.state.modal} toggle={() => this.toggle()}>
                        <ModalHeader toggle={() => this.toggle()}>Notice</ModalHeader>
                        <ModalBody>
                            Sure to restore product: <b>{this.state.productName}</b> -
                            id: <b>{this.state.productId}</b> ?
                            {
                                this.state.isRestoreFail &&
                                <Alert color="danger">
                                    {this.state.messageRestoreFail}
                                </Alert>
                            }
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" onClick={() => this.handleRestore()}>Restore</Button>
                            <Button color="primary" onClick={() => this.toggle()}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                </Container>
            </div>
        )
    }
}
