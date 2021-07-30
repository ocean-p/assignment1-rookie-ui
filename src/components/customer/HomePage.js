import axios from 'axios';
import React, { Component } from 'react';
import {
    Card, Button, CardImg, CardTitle,
    CardSubtitle, CardBody, Container, Row, Col,
    Form, Input, UncontrolledButtonDropdown,
    DropdownMenu, DropdownItem, DropdownToggle,
    Modal, ModalHeader, ModalBody, ModalFooter, Alert
} from 'reactstrap';
import ProductInfo from './ProductInfo';
import Rating from './Rating';

export default class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productList: [],
            pageList: [],

            categoryList: [],

            categoryName: '',
            categoryId: '',
            searchCategoryPageList: [],
            isCategory: false,

            searchValue: '',
            searchPageList: [],
            isSearch: false,

            modalMore: false,
            productId: '',
            productName: '',

            modalRating: false,

            modalAddToCart: false,
            isAddToCartFail: false,
            messageAddToCartFail: '',

            isLoadFail: false,
            messageLoadFail: ''
        };
    }

    componentDidMount() {
        this.loadProduct();
        this.loadCategory();
    }

    loadProduct() {
        axios.get('http://localhost:8080/customer/product?page=1',
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            }
        )
            .then(response => {
                if (response.status === 200) {
                    this.setState({ productList: response.data.productList });
                    this.handlePageList(response);
                }
            })
            .catch(() => {
                this.setState({
                    isLoadFail: true,
                    messageLoadFail: 'Fail to load products.'
                })
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
                this.setState({
                    isLoadFail: true,
                    messageLoadFail: 'Fail to load categories.'
                })
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
        axios.get(`http://localhost:8080/customer/product?page=${page}`,
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            }
        )
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        productList: response.data.productList,
                        isLoadFail: false
                    })
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.data.message === 'PAGE_LESS_THAN_ONE') {
                        this.setState({ messageLoadFail: 'Page must be from 1.' });
                    }
                    else {
                        this.setState({ messageLoadFail: 'Error to change page.' });
                    }
                }
                else {
                    this.setState({ messageLoadFail: 'Fail to change page.' });
                }
                this.setState({ isLoadFail: true });
            })
    }

    searchByCategory(id, name) {
        this.setState({ categoryId: id, categoryName: name });
        axios.get(`http://localhost:8080/customer/product/category?id=${id}&page=1`,
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            }
        )
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        productList: response.data.productList,
                        isCategory: true,
                        isSearch: false,
                        isLoadFail: false
                    })
                    this.handleSearchByCategoryPageList(response);
                }
            })
            .catch(err => {
                if (err.response != null) {
                    if (err.response.data.message === "CATEGORY_NOT_FOUND") {
                        this.setState({ messageLoadFail: 'Category not found' });
                    }
                    else if (err.response.data.message === "CATEGORY_IS_DISABLED") {
                        this.setState({ messageLoadFail: 'Category was deleted' });
                    }
                    else if (err.response.data.message === "PAGE_LESS_THAN_ONE") {
                        this.setState({ messageLoadFail: 'Number of page must be from 1' });
                    }
                    else {
                        this.setState({ messageLoadFail: 'Error to search by category.' });
                    }
                }
                else {
                    this.setState({ messageLoadFail: 'Fail to search by category.' });
                }
                this.setState({ isLoadFail: true });
            })
    }

    handleSearchByCategoryPageList(response) {
        var list = [];
        for (let i = 0; i < response.data.totalPages; i++) {
            list.push(i + 1);
        }
        if (list.length > 1) {
            this.setState({ searchCategoryPageList: list });
        }
        else {
            this.setState({ searchCategoryPageList: [] });
        }
    }

    changeSearchByCategoryPage(page) {
        axios.get(`http://localhost:8080/customer/product/category?id=${this.state.categoryId}&page=${page}`,
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            }
        )
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        productList: response.data.productList,
                        isLoadFail: false
                    })
                }
            })
            .catch(err => {
                if (err.response != null) {
                    if (err.response.data.message === "CATEGORY_NOT_FOUND") {
                        this.setState({ messageLoadFail: 'Category not found' });
                    }
                    else if (err.response.data.message === "CATEGORY_IS_DISABLED") {
                        this.setState({ messageLoadFail: 'Category was deleted' });
                    }
                    else if (err.response.data.message === "PAGE_LESS_THAN_ONE") {
                        this.setState({ messageLoadFail: 'Number of page must be from 1' });
                    }
                    else {
                        this.setState({ messageLoadFail: 'Error to change search page by category.' });
                    }
                }
                else {
                    this.setState({ messageLoadFail: 'Fail to change search page by category.' });
                }
                this.setState({ isLoadFail: true });
            })
    }

    handleSearch(e) {
        e.preventDefault();
        this.setState({ searchValue: e.target.searchvalue.value })
        axios.get(`http://localhost:8080/customer/product/search?name=${e.target.searchvalue.value}&page=1`,
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            }
        )
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        productList: response.data.productList,
                        isSearch: true,
                        isCategory: false,
                        isLoadFail: false
                    })
                    this.handleSearchPageList(response);
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.data.message === "SEARCH_VALUE_IS_EMPTY") {
                        this.setState({ messageLoadFail: 'Not yet input anything.' });
                    }
                    else if (err.response.data.message === "PAGE_LESS_THAN_ONE") {
                        this.setState({ messageLoadFail: 'Number of page must be from 1' });
                    }
                    else {
                        this.setState({ messageLoadFail: 'Error to search by name.' });
                    }
                }
                else {
                    this.setState({ messageLoadFail: 'Fail to search by name.' });
                }
                this.setState({ isLoadFail: true });
            })
    }

    handleSearchPageList(response) {
        var list = [];
        for (let i = 0; i < response.data.totalPages; i++) {
            list.push(i + 1);
        }
        if (list.length > 1) {
            this.setState({ searchPageList: list });
        }
        else {
            this.setState({ searchPageList: [] });
        }
    }

    changeSearchPage(page) {
        axios.get(
            `http://localhost:8080/customer/product/search?name=${this.state.searchValue}&page=${page}`,
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            }
        )
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        productList: response.data.productList,
                        isLoadFail: false
                    })
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.data.message === "SEARCH_VALUE_IS_EMPTY") {
                        this.setState({ messageLoadFail: 'Not yet input anything.' });
                    }
                    else if (err.response.data.message === "PAGE_LESS_THAN_ONE") {
                        this.setState({ messageLoadFail: 'Number of page must be from 1' });
                    }
                    else {
                        this.setState({ messageLoadFail: 'Error to change search page by name.' });
                    }
                }
                else {
                    this.setState({ messageLoadFail: 'Fail to change search page by name.' });
                }
                this.setState({ isLoadFail: true });
            })
    }

    toggleMore() {
        this.setState({
            modalMore: !this.state.modalMore,
            productId: '',
            productName: ''
        });
    }

    toggleMoreButton(productIdValue, productNameValue) {
        this.setState({
            modalMore: !this.state.modalMore,
            productId: productIdValue,
            productName: productNameValue
        })
    }

    toggleRating() {
        this.setState({
            modalRating: !this.state.modalRating,
            productId: '',
            productName: ''
        });
    }

    toggleRatingButton(productIdValue, productNameValue) {
        this.setState({
            modalRating: !this.state.modalRating,
            productId: productIdValue,
            productName: productNameValue
        })
    }

    toggleAddToCart() {
        this.setState({
            modalAddToCart: !this.state.modalAddToCart
        })
    }

    handleAddToCart(productId) {
        axios.post('http://localhost:8080/customer/cart/add',
            {
                username: `${localStorage.getItem('name')}`,
                product: {
                    id: `${productId}`
                }
            },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            }
        )
            .then(response => {
                if (response.status === 200) {
                    this.toggleAddToCart();
                    this.setState({ isAddToCartFail: false });
                }
            })
            .catch(err => {
                if (err.response) {
                    switch (err.response.data.message) {
                        case 'ACCOUNT_NOT_FOUND':
                            this.setState({ messageAddToCartFail: 'Account not found.' });
                            break;
                        case 'ACCOUNT_IS_DISABLED':
                            this.setState({ messageAddToCartFail: 'Account is disabled.' });
                            break;
                        case 'PRODUCT_NOT_FOUND':
                            this.setState({ messageAddToCartFail: 'Product not found.' });
                            break;
                        case 'PRODUCT_IS_DISABLED':
                            this.setState({ messageAddToCartFail: 'Product is disabled.' });
                            break;
                        case 'QUANTITY_GREATER_THAN_AVAILABLE':
                            this.setState({ messageAddToCartFail: 'Quantity is greater than available.' });
                            break;
                        default:
                            this.setState({ messageAddToCartFail: 'Error to add product to cart.' });
                    }
                }
                else {
                    this.setState({ messageAddToCartFail: 'Fail to add product to cart.' });
                }
                this.setState({ isAddToCartFail: true });
                this.toggleAddToCart();
            })
    }

    render() {
        return (
            <div>
                <h2 style={{ textAlign: 'center' }}>
                    Let's Shopping
                    <br />
                    <UncontrolledButtonDropdown>
                        <DropdownToggle caret>
                            Categories
                        </DropdownToggle>
                        <DropdownMenu>
                            {this.state.categoryList.map((category, index) => {
                                return (
                                    <DropdownItem key={index}
                                        onClick={() => this.searchByCategory(`${category.id}`, `${category.name}`)}>
                                        {category.name}
                                    </DropdownItem>
                                )
                            })}
                        </DropdownMenu>
                    </UncontrolledButtonDropdown>
                </h2>
                <br />
                <Container>
                    <Form className="mb-4" onSubmit={(e) => this.handleSearch(e)}>
                        <Row>
                            <Col xs="6">
                                <Input type="text" name="searchvalue" id="searchvalue"
                                    placeholder="Search by name" />
                            </Col>
                            <Col xs="6">
                                <Button color="primary">Search</Button>
                            </Col>
                        </Row>
                    </Form>
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
                {this.state.isCategory === true && this.state.categoryName !== '' &&
                    <p style={{ textAlign: 'center', color: 'grey', fontSize: '20px', marginTop: '40px' }}>
                        Search by category: {this.state.categoryName}
                    </p>
                }
                {this.state.isSearch === true && this.state.searchValue !== '' &&
                    <p style={{ textAlign: 'center', color: 'grey', fontSize: '20px', marginTop: '40px' }}>
                        Search results: {this.state.searchValue}
                    </p>
                }
                {
                    this.state.productList.length < 1 &&
                    <p style={{ textAlign: 'center'}}>
                        No results
                    </p>
                }
                <br />
                <Container>
                    <Row xs="4" className="mb-4">
                        <Col>
                            {this.state.isCategory === false && this.state.isSearch === false &&
                                this.state.pageList.map((page, index) => {
                                    return (
                                        <Button key={index} onClick={() => this.changePage(`${page}`)}>
                                            {page}
                                        </Button>
                                    )
                                })
                            }
                            {this.state.isCategory === true &&
                                this.state.searchCategoryPageList.map((page, index) => {
                                    return (
                                        <Button key={index} onClick={() => this.changeSearchByCategoryPage(`${page}`)}>
                                            {page}
                                        </Button>
                                    )
                                })
                            }
                            {this.state.isSearch === true &&
                                this.state.searchPageList.map((page, index) => {
                                    return (
                                        <Button key={index} onClick={() => this.changeSearchPage(`${page}`)}>
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
                                    <Button color="success"
                                        onClick={() => this.handleAddToCart(`${product.id}`)}>
                                        Add to cart
                                    </Button>
                                    <Card>
                                        <CardImg top width="50%" src={product.image}
                                            alt={product.name} />
                                        <CardBody>
                                            <CardTitle tag="h5">{product.name} / {product.price}$</CardTitle>
                                            <CardSubtitle tag="h6" className="mb-2 text-muted">Code: {product.id}</CardSubtitle>

                                            <Button color="info"
                                                onClick={() => this.toggleMoreButton(`${product.id}`, `${product.name}`)}>
                                                More
                                            </Button>

                                            <Button color="warning"
                                                onClick={() => this.toggleRatingButton(`${product.id}`, `${product.name}`)}>
                                                Rating
                                            </Button>
                                        </CardBody>
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>
                </Container>
                <Modal size="lg" isOpen={this.state.modalMore} toggle={() => this.toggleMore()}>
                    <ModalHeader toggle={() => this.toggleMore()}>
                        Product Info - Code: {this.state.productId}
                    </ModalHeader>
                    <ModalBody>
                        <ProductInfo id={this.state.productId} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={() => this.toggleMore()}>Close</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.modalRating} toggle={() => this.toggleRating()}>
                    <ModalHeader toggle={() => this.toggleRating()}>
                        Rating product: {this.state.productName} - code: {this.state.productId}
                    </ModalHeader>
                    <ModalBody>
                        <Rating id={this.state.productId} onClose={() => this.toggleRating()} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={() => this.toggleRating()}>Close</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.modalAddToCart}>
                    <ModalHeader>
                        Notice
                    </ModalHeader>
                    <ModalBody>
                        {
                            this.state.isAddToCartFail === true &&
                            <p style={{ color: 'red' }}>
                                {this.state.messageAddToCartFail}
                            </p>
                        }
                        {
                            this.state.isAddToCartFail === false &&
                            <p style={{ color: 'green' }}>
                                Success to add product to cart.
                            </p>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={() => this.toggleAddToCart()}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
