import React, { Component } from 'react';
import axios from 'axios';
import {
    Button, Form, FormGroup, Input, Container, Row, Col, Table,
    Modal, ModalHeader, ModalBody, ModalFooter, Alert
} from 'reactstrap';
import UpdateCategoryForm from './UpdateCategoryForm';

export default class AvailableCategories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categoryList: [],
            pageList: [],
            searchValue: '',
            searchPageList: [],
            isSearch: false,

            modal: false,
            categoryName: '',
            categoryId: '',

            modalUpdate: false,

            isDeleteFail: false,
            messageDeleteFail: '',

            isLoadFail: false,
            messageLoadFail: '',
        };
    }

    loadData() {
        axios.get('http://localhost:8080/admin/category?page=1', {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        categoryList: response.data.categories
                    })
                    this.handlePageList(response);
                }
            })
            .catch(() => {
                this.setState({
                    isLoadFail: true,
                    messageLoadFail: 'Fail to load available categories.'
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
        axios.get(`http://localhost:8080/admin/category?page=${page}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        categoryList: response.data.categories,
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
        axios.get(`http://localhost:8080/admin/category/search?value=${e.target.searchvalue.value}&page=1`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        categoryList: response.data.categories,
                        isSearch: true,
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
                        this.setState({messageLoadFail: 'Error to search category.'});
                    }
                }
                else {
                    this.setState({messageLoadFail: 'Fail to search category.'});
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
        axios.get(`http://localhost:8080/admin/category/search?value=${this.state.searchValue}&page=${page}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        categoryList: response.data.categories,
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
                        this.setState({messageLoadFail: 'Error to change search page.'});
                    }
                }
                else {
                    this.setState({messageLoadFail: 'Fail to change search page.'});
                }
                this.setState({isLoadFail: true});
            })
    }

    refresh() {
        this.setState({
            searchValue: '',
            isSearch: false,
            isLoadFail: false
        })
        this.loadData();
    }

    toggle() {
        this.setState({ 
            modal: !this.state.modal,
            categoryName: '',
            categoryId: '',
            isDeleteFail: false 
        })
    }

    toggleUpdate() {
        this.setState({ 
            modalUpdate: !this.state.modalUpdate,
            categoryName: '',
            categoryId: '' 
        })
    }

    toggleButton(categoryIdValue, categoryNameValue) {
        this.setState({
            modal: !this.state.modal,
            categoryName: categoryNameValue,
            categoryId: categoryIdValue
        })
    }

    toggleButtonUpdate(categoryIdValue, categoryNameValue) {
        this.setState({
            modalUpdate: !this.state.modalUpdate,
            categoryName: categoryNameValue,
            categoryId: categoryIdValue
        })
    }

    handleDelete() {
        axios.delete(`http://localhost:8080/admin/category/${this.state.categoryId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response.status === 200) {
                    this.toggle();
                    if (this.state.isSearch === true) {
                        this.changeSearchPage(1);
                    }
                    else {
                        this.loadData();
                    }
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.data.message === 'CATEGORY_NOT_FOUND') {
                        this.setState({messageDeleteFail: 'Category not found.'});
                    }
                    else if (err.response.data.message === 'CATEGORY_IS_DISABLED') {
                        this.setState({messageDeleteFail: 'Category is disabled.'});
                    }
                    else {
                        this.setState({messageDeleteFail: 'Error to delete category.'});
                    }
                }
                else {
                    this.setState({messageDeleteFail: 'Fail to delete category.'});
                }
                this.setState({isDeleteFail: true});
            })
    }

    handleUpdate = () => {
        this.toggleUpdate();
        if (this.state.isSearch === true) {
            this.changeSearchPage(1);
        }
        else {
            this.loadData();
        }
    }

    render() {
        return (
            <div>
                <h2 style={{ textAlign: 'center' }}>
                    Available Categories
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
                <br />
                {this.state.isSearch === true && this.state.searchValue !== '' &&
                    <p style={{ textAlign: 'center', color: 'grey', fontSize: '20px' }}>
                        Search results: {this.state.searchValue}
                    </p>
                }
                {
                    this.state.categoryList.length < 1 &&
                    <p style={{ textAlign: 'center'}}>
                        No results
                    </p>
                }
                <Table hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Create-Date</th>
                            <th>Update-Date</th>
                            <th colSpan="2">Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.categoryList.map((category, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{category.name}</td>
                                    <td>{category.description}</td>
                                    <td>{category.createDate}</td>
                                    <td>{category.updateDate}</td>
                                    <td>
                                        <Button color="primary"
                                            onClick={() => this.toggleButtonUpdate(`${category.id}`, `${category.name}`)}>
                                            Update
                                        </Button>
                                    </td>
                                    <td>
                                        <Button color="danger"
                                            onClick={() => this.toggleButton(`${category.id}`, `${category.name}`)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                {this.state.isSearch === false &&
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
                <Modal isOpen={this.state.modal} toggle={() => this.toggle()}>
                    <ModalHeader toggle={() => this.toggle()}>Notice</ModalHeader>
                    <ModalBody>
                        Sure to delete Category: <b>{this.state.categoryName}</b> -
                        id: <b>{this.state.categoryId}</b> ?
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
                        Update category: <b>{this.state.categoryName}</b> - id: <b>{this.state.categoryId}</b>
                    </ModalHeader>
                    <ModalBody>
                        <UpdateCategoryForm id={this.state.categoryId} onUpdate={this.handleUpdate}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.toggleUpdate()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
