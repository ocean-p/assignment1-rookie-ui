import React, { Component } from 'react';
import axios from 'axios';
import {
    Button, Form, FormGroup, Input, Container, Row, Col, Table,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import UpdateAccountForm from './UpdateAccountForm';


export default class CustomerAccounts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accountList: [],
            pageList: [],
            searchValue: '',
            searchPageList: [],
            isSearch: false,

            modal: false,
            username: '',

            modalUpdate: false
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        axios.get('http://localhost:8080/admin/account/customer?page=1', {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        accountList: response.data.accountDTOList
                    })
                    this.handlePageList(response);
                }
            })
            .catch(() => {
                alert("Fail to load customer accounts !");
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
        axios.get(`http://localhost:8080/admin/account/customer?page=${page}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        accountList: response.data.accountDTOList
                    })
                }
            })
            .catch(err => {
                if(err.response){
                    if(err.response.data.message === 'PAGE_LESS_THAN_ONE'){
                        alert("Page must be from 1 !");
                    }
                    else{
                        alert("Error to change page !");
                    }
                }
                else {
                    alert("Fail to change page !");
                }
            })
    }

    handleFind(e) {
        e.preventDefault();
        this.setState({ searchValue: e.target.searchvalue.value })
        axios.get(`http://localhost:8080/admin/account?value=${e.target.searchvalue.value}&page=1`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        accountList: response.data.accountDTOList,
                        isSearch: true
                    }, () => {
                        if (this.state.accountList.length === 0) {
                            alert("No results.");
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
        axios.get(`http://localhost:8080/admin/account?value=${this.state.searchValue}&page=${page}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        accountList: response.data.accountDTOList
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
                    alert("Fail to change page!");
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

    toggleButton(usernameValue) {
        this.setState({
            modal: !this.state.modal,
            username: usernameValue
        })
    }

    toggleButtonUpdate(usernameValue) {
        this.setState({
            modalUpdate: !this.state.modalUpdate,
            username: usernameValue
        })
    }

    handleDelete() {
        axios.delete(`http://localhost:8080/admin/account/${this.state.username}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response.status === 200) {
                    alert(response.data);
                    this.toggle();
                    this.setState({ username: '' })
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
                    if (err.response.data.message === 'ACCOUNT_NOT_FOUND') {
                        alert("Account not found !");
                    }
                    else if (err.response.data.message === 'ACCOUNT_NOT_BELONG_TO_CUSTOMER') {
                        alert("Account not belong to customer !");
                    }
                    else if (err.response.data.message === 'ACCOUNT_IS_DISABLED') {
                        alert("Account is disabled !");
                    }
                    else {
                        alert("Error to delete account !");
                    }
                }
                else {
                    alert("Fail to delete account !");
                }
            })
    }

    handleUpdate = () => {
        this.toggleUpdate();
        this.setState({ username: '' })
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
                    Customer Accounts
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
                                        placeholder="Search by username" />
                                </FormGroup>
                            </Col>
                            <Col sm={{ size: 1, offset: 1 }}>
                                <Button color="primary">Find</Button>
                            </Col>
                        </Row>
                    </Container>
                </Form>
                {this.state.isSearch === true && this.state.searchValue !== '' &&
                    <p style={{ textAlign: 'center', color: 'grey', fontSize: '20px' }}>
                        Search results: {this.state.searchValue}
                    </p>
                }
                <br />
                <Table hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Username</th>
                            <th>Fullname</th>
                            <th>Phone</th>
                            <th>Create-Date</th>
                            <th>Update-Date</th>
                            <th colSpan="2">Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.accountList.map((account, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{account.username}</td>
                                    <td>{account.fullName}</td>
                                    <td>{account.phone}</td>
                                    <td>{account.createDate}</td>
                                    <td>{account.updateDate}</td>
                                    <td>
                                        <Button color="primary" onClick={() => this.toggleButtonUpdate(`${account.username}`)}>
                                            Update
                                        </Button>
                                    </td>
                                    <td>
                                        <Button color="danger" onClick={() => this.toggleButton(`${account.username}`)}>
                                            Delete
                                        </Button>

                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                <Modal isOpen={this.state.modal} toggle={() => this.toggle()}>
                    <ModalHeader toggle={() => this.toggle()}>Notice</ModalHeader>
                    <ModalBody>
                        Are you sure to delete account: <b>{this.state.username}</b> ?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={() => this.handleDelete()}>Delete</Button>
                        <Button color="primary" onClick={() => this.toggle()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <Modal size="lg" isOpen={this.state.modalUpdate} toggle={() => this.toggleUpdate()}>
                    <ModalHeader toggle={() => this.toggleUpdate()}>Update account: <b>{this.state.username}</b></ModalHeader>
                    <ModalBody>
                        <UpdateAccountForm username={this.state.username} onUpdate={this.handleUpdate}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.toggleUpdate()}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
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
            </div>
        )
    }
}
