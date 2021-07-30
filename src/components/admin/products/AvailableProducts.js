import React, { Component } from 'react';
import {
    Card, Button, CardImg, CardTitle, CardText,
    CardSubtitle, CardBody, Container, Row, Col,
    Form, FormGroup, Input, UncontrolledButtonDropdown,
    DropdownMenu, DropdownItem, DropdownToggle,
    Modal, ModalHeader, ModalBody, ModalFooter, Alert
} from 'reactstrap';
import axios from 'axios';
import UpdateProductForm from './UpdateProductForm'

export default class AvailableProducts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productList: [],
            categoryList: [],
            pageList: [],

            searchValue: '',
            searchPageList: [],
            isSearch: false,

            categoryName: '',
            categoryId: '',
            searchCategoryPageList: [],
            isCategory: false,

            modal: false,
            productId: '',
            productName: '',

            modalUpdate: false,

            isDeleteFail: false,
            messageDeleteFail: '',

            isLoadFail: false,
            messageLoadFail: '',
        };
    }

    loadData() {
        axios.get('http://localhost:8080/admin/product?page=1', {
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
                    messageLoadFail: 'Fail to load available products.'
                })
            })
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
            .catch(() => {
                this.setState({
                    isLoadFail: true,
                    messageLoadFail: 'Fail to load categories.'
                })
            })
    }

    componentDidMount() {
        this.loadData();
        this.loadCategory();
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
        axios.get(`http://localhost:8080/admin/product?page=${page}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        productList: response.data.productList,
                        isLoadFail: false
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


    handleFind(e) {
        e.preventDefault();
        this.setState({ searchValue: e.target.searchvalue.value })
        axios.get(`http://localhost:8080/admin/product/search?value=${e.target.searchvalue.value}&page=1`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
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
                        this.setState({messageLoadFail: 'Not yet input anything.'});
                    }
                    else if (err.response.data.message === "PAGE_LESS_THAN_ONE") {
                        this.setState({messageLoadFail: 'Number of page must be from 1.'});
                    }
                    else{
                        this.setState({messageLoadFail: 'Error to search products by name.'});
                    }
                }
                else {
                    this.setState({messageLoadFail: 'Fail to search products by name.'});
                }
                this.setState({isLoadFail: true});
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
            `http://localhost:8080/admin/product/search?value=${this.state.searchValue}&page=${page}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
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
                        this.setState({messageLoadFail: 'Not yet input anything.'});
                    }
                    else if (err.response.data.message === "PAGE_LESS_THAN_ONE") {
                        this.setState({messageLoadFail: 'Number of page must be from 1.'});
                    }
                    else{
                        this.setState({messageLoadFail: 'Error to change search page by name.'});
                    }
                }
                else {
                    this.setState({messageLoadFail: 'Fail to change search page by name.'})
                }
                this.setState({isLoadFail: true});
            })
    }

    refresh() {
        this.setState({
            searchValue: '',
            searchPageList: [],
            isSearch: false,

            categoryName: '',
            categoryId: '',
            searchCategoryPageList: [],
            isCategory: false,

            isLoadFail: false
        })
        this.loadData();
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

    searchByCategory(id, name) {
        this.setState({ categoryName: name, categoryId: id });
        axios.get(`http://localhost:8080/admin/product/category?id=${id}&page=1`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
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
                        this.setState({messageLoadFail: 'Category not found.'});
                    }
                    else if (err.response.data.message === "CATEGORY_IS_DISABLED") {
                        this.setState({messageLoadFail: 'Category was deleted.'});
                    }
                    else if (err.response.data.message === "PAGE_LESS_THAN_ONE") {
                        this.setState({messageLoadFail: 'Number of page must be from 1.'});
                    }
                    else{
                        this.setState({messageLoadFail: 'Error to search products by category.'});
                    }
                }
                else {
                    this.setState({messageLoadFail: 'Fail to search products by category.'});
                }
                this.setState({isLoadFail: true});
            })
    }

    changeSearchByCategoryPage(page) {
        axios.get(`http://localhost:8080/admin/product/category?id=${this.state.categoryId}&page=${page}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
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
                        this.setState({messageLoadFail: 'Category not found.'});
                    }
                    else if (err.response.data.message === "CATEGORY_IS_DISABLED") {
                        this.setState({messageLoadFail: 'Category was deleted.'});
                    }
                    else if (err.response.data.message === "PAGE_LESS_THAN_ONE") {
                        this.setState({messageLoadFail: 'Number of page must be from 1.'});
                    }
                    else{
                        this.setState({messageLoadFail: 'Error to change search page by category.'});
                    }
                }
                else {
                    this.setState({messageLoadFail: 'Fail to change search page by category.'});
                }
                this.setState({isLoadFail: true});
            })
    }

    toggle() {
        this.setState({ 
            modal: !this.state.modal,
            productName: '',
            productId: '',
            isDeleteFail: false 
        })
    }

    toggleUpdate() {
        this.setState({ 
            modalUpdate: !this.state.modalUpdate,
            productName: '',
            productId: ''
        })
    }

    toggleButton(productIdValue, productNameValue) {
        this.setState({
            modal: !this.state.modal,
            productName: productNameValue,
            productId: productIdValue
        })
    }

    toggleButtonUpdate(productIdValue, productNameValue) {
        this.setState({
            modalUpdate: !this.state.modalUpdate,
            productName: productNameValue,
            productId: productIdValue
        })
    }

    handleDelete() {
        axios.delete(`http://localhost:8080/admin/product/${this.state.productId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response.status === 200) {
                    this.toggle();
                    if (this.state.isSearch === true) {
                        this.changeSearchPage(1);
                    }
                    else if (this.state.isCategory === true) {
                        this.changeSearchByCategoryPage(1);
                    }
                    else {
                        this.loadData();
                    }
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.data.message === 'PRODUCT_NOT_FOUND') {
                        this.setState({messageDeleteFail: 'Product not found.'});
                    }
                    else if (err.response.data.message === 'PRODUCT_IS_DISABLED') {
                        this.setState({messageDeleteFail: 'Product is disabled.'});
                    }
                    else {
                        this.setState({messageDeleteFail: 'Error to delete product.'});
                    }
                }
                else {
                    this.setState({messageDeleteFail: 'Fail to delete product.'});
                }
                this.setState({ isDeleteFail: true });
            })
    }

    handleUpdate = () => {
        this.toggleUpdate();
        if (this.state.isSearch === true) {
            this.changeSearchPage(1);
        }
        else if (this.state.isCategory === true) {
            this.changeSearchByCategoryPage(1);
        }
        else {
            this.loadData();
        }
    }

    render() {
        return (
            <div>
                <h2 style={{ textAlign: 'center' }}>
                    Available Products
                    <br />
                    <Button color="warning" onClick={() => this.refresh()}>Refresh</Button>
                </h2>
                <br />
                <Form inline onSubmit={e => this.handleFind(e)}>
                    <Container>
                        <Row>
                            <Col sm="12" md={{ size: 6, offset: 3 }}>
                                <FormGroup className="mb-4">
                                    <Input type="text" name="searchvalue" id="searchvalue"
                                        placeholder="Search by name" />
                                </FormGroup>
                            </Col>
                            <Col sm={{ size: 1, offset: 1 }}>
                                <Button color="primary">Find</Button>
                            </Col>
                        </Row>
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
                </Form>
                <Container>
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
                </Container>
                <br />
                {this.state.isSearch === true && this.state.searchValue !== '' &&
                    <p style={{ textAlign: 'center', color: 'grey', fontSize: '20px' }}>
                        Search results: {this.state.searchValue}
                    </p>
                }
                {this.state.isCategory === true && this.state.categoryName !== '' &&
                    <p style={{ textAlign: 'center', color: 'grey', fontSize: '20px' }}>
                        Search by category: {this.state.categoryName}
                    </p>
                }
                {
                    this.state.productList.length < 1 &&
                    <p style={{ textAlign: 'center'}}>
                        No results
                    </p>
                }
                <Container>
                    <Row xs="3" className="mb-3">
                        <Col>
                            {this.state.isSearch === false && this.state.isCategory === false &&
                                this.state.pageList.map((page, index) => {
                                    return (
                                        <Button key={index} onClick={() => this.changePage(`${page}`)}>
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
                            {this.state.isCategory === true &&
                                this.state.searchCategoryPageList.map((page, index) => {
                                    return (
                                        <Button key={index} onClick={() => this.changeSearchByCategoryPage(`${page}`)}>
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
                                        <CardImg top width="30%" src={product.image}
                                            alt={product.name} />
                                        <CardBody>
                                            <CardTitle tag="h5">{product.name} / {product.price}$</CardTitle>
                                            <CardSubtitle tag="h6" className="mb-2 text-muted">Code: {product.id} -- {product.averageRate}/10 star</CardSubtitle>
                                            <CardText>Quantity: {product.quantity}</CardText>
                                            <CardText>Description: {product.description}</CardText>
                                            <CardText>Update-Date: {product.updateDate}</CardText>
                                            <CardText>Create-Date: {product.createDate}</CardText>
                                            
                                            <Button color="primary" 
                                                onClick={() => this.toggleButtonUpdate(`${product.id}`, `${product.name}`)}>
                                                Update
                                            </Button>

                                            <Button color="danger" 
                                                onClick={() => this.toggleButton(`${product.id}`, `${product.name}`)}>
                                                Delete
                                            </Button>

                                        </CardBody>
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>
                </Container>
                <Modal isOpen={this.state.modal} toggle={() => this.toggle()}>
                    <ModalHeader toggle={() => this.toggle()}>Notice</ModalHeader>
                    <ModalBody>
                        Sure to delete product: <b>{this.state.productName}</b> -
                        id: <b>{this.state.productId}</b> ?
                        {
                            this.state.isDeleteFail &&
                            <Alert color="danger">
                                {this.state.messageDeleteFail}
                            </Alert>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={() => this.handleDelete()}>Delete</Button>
                        <Button color="primary" onClick={() => this.toggle()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <Modal size="lg" isOpen={this.state.modalUpdate} toggle={() => this.toggleUpdate()}>
                    <ModalHeader toggle={() => this.toggleUpdate()}>
                        Update product: <b>{this.state.productName}</b> -
                             id: <b>{this.state.productId}</b> 
                    </ModalHeader>
                    <ModalBody>
                        <UpdateProductForm id={this.state.productId} onUpdate={this.handleUpdate}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.toggleUpdate()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
