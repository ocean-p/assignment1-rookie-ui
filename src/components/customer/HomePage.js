import axios from 'axios';
import React, { Component } from 'react';
import {
    Card, Button, CardImg, CardTitle, CardText,
    CardSubtitle, CardBody, Container, Row, Col,
    Form, FormGroup, Input, UncontrolledButtonDropdown,
    DropdownMenu, DropdownItem, DropdownToggle,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';

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
                alert("Fail to load product!");
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
                    this.setState({ productList: response.data.productList })
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.data.message === 'PAGE_LESS_THAN_ONE') {
                        alert("Page must be from 1.");
                    }
                    else {
                        alert("Error - try again.");
                    }
                }
                else {
                    alert("Fail to change Page!");
                }
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
                        isSearch: false
                    }, () => {
                        if (this.state.productList.length === 0) {
                            alert("No results");
                        }
                    })
                    this.handleSearchByCategoryPageList(response);
                }
            })
            .catch(err => {
                if (err.response != null) {
                    if (err.response.data.message === "CATEGORY_NOT_FOUND") {
                        alert("Category not found");
                    }
                    else if (err.response.data.message === "CATEGORY_IS_DISABLED") {
                        alert("Category was deleted");
                    }
                    else if (err.response.data.message === "PAGE_LESS_THAN_ONE") {
                        alert("Number of page must be from 1!");
                    }
                    else {
                        alert("Error - try again");
                    }
                }
                else {
                    alert("Fail to find!")
                }
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
                    this.setState({ productList: response.data.productList })
                }
            })
            .catch(err => {
                if (err.response != null) {
                    if (err.response.data.message === "CATEGORY_NOT_FOUND") {
                        alert("Category not found");
                    }
                    else if (err.response.data.message === "CATEGORY_IS_DISABLED") {
                        alert("Category was deleted");
                    }
                    else if (err.response.data.message === "PAGE_LESS_THAN_ONE") {
                        alert("Number of page must be from 1!");
                    }
                    else {
                        alert("Error - try again");
                    }
                }
                else {
                    alert("Fail to find!")
                }
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
                    isCategory: false
                }, () => {
                    if (this.state.productList.length === 0) {
                        alert("No results");
                    }
                })
                this.handleSearchPageList(response);
            }
        })
        .catch(err => {
            if (err.response) {
                if (err.response.data.message === "SEARCH_VALUE_IS_EMPTY") {
                    alert("Not yet input anything!")
                }
                else if (err.response.data.message === "PAGE_LESS_THAN_ONE") {
                    alert("Number of page must be from 1!");
                }
                else{
                    alert("Error - try again!")
                }
            }
            else {
                alert("Fail to search!")
            }
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
                    productList: response.data.productList
                })
            }
        })
        .catch(err => {
            if (err.response) {
                if (err.response.data.message === "SEARCH_VALUE_IS_EMPTY") {
                    alert("Not yet input anything!")
                }
                else if (err.response.data.message === "PAGE_LESS_THAN_ONE") {
                    alert("Number of page must be from 1!");
                }
                else{
                    alert("Error - try again!")
                }
            }
            else {
                alert("Fail to search!")
            }
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
                <br/>
                <Container>
                    <Form onSubmit={(e) => this.handleSearch(e)}>
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
                                    <Card>
                                        <CardImg top width="30%" src="https://slyclothing.vn/wp-content/uploads/2021/01/jacket-winter_3.jpg"
                                            alt={product.name} />
                                        <CardBody>
                                            <CardTitle tag="h5">{product.name} / {product.price}$</CardTitle>
                                            <CardSubtitle tag="h6" className="mb-2 text-muted">Code: {product.id}</CardSubtitle>

                                            <Button color="info">
                                                More
                                            </Button>

                                            <Button color="warning">
                                                Rating
                                            </Button>
                                        </CardBody>
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>
                </Container>
            </div>
        )
    }
}
