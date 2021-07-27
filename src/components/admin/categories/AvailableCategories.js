import React, { Component } from 'react';
import axios from 'axios';
import {
    Button, Form, FormGroup, Input, Container, Row, Col, Table,
    Modal, ModalHeader, ModalBody, ModalFooter
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

            modalUpdate: false
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
                alert("Fail to load data!");
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
                        categoryList: response.data.categories
                    })
                }
            })
            .catch(() => {
                alert("Fail to change page!");
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
                        isSearch: true
                    }, () => {
                        if (this.state.categoryList.length === 0) {
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
        axios.get(`http://localhost:8080/admin/category/search?value=${this.state.searchValue}&page=${page}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        categoryList: response.data.categories
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
                }
                else {
                    alert("Fail to load data!")
                }
            })
    }

    refresh() {
        this.loadData();
        this.setState({
            searchValue: '',
            isSearch: false,
        })
    }

    toggle() {
        this.setState({ modal: !this.state.modal })
    }

    toggleUpdate() {
        this.setState({ modalUpdate: !this.state.modalUpdate })
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
                    alert(response.data);
                    this.toggle();
                    this.setState({ categoryId: '', categoryName: '' });
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
                        alert("Category not found");
                    }
                    else if (err.response.data.message === 'CATEGORY_IS_DISABLED') {
                        alert("Category is disabled");
                    }
                    else {
                        alert("Error");
                    }
                }
                else {
                    alert("Fail to delete!");
                }
            })
    }

    handleUpdate = () => {
        this.toggleUpdate();
        this.setState({ categoryId: '', categoryName: '' });
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
                                <FormGroup className="mb-2">
                                    <Input type="text" name="searchvalue" id="searchvalue"
                                        placeholder="Search by name" />
                                </FormGroup>
                            </Col>
                            <Col sm={{ size: 1, offset: 1 }}>
                                <Button color="primary">Find</Button>
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
