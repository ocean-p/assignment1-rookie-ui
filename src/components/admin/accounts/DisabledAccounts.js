import React, { Component } from 'react';
import axios from 'axios';
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, Container, Row, Col } from 'reactstrap';

export default class DisabledAccounts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accountList: [],
            pageList: [],

            modal: false,
            username: ''
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        axios.get('http://localhost:8080/admin/account/deleted?page=1', {
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
            .catch(err => {
                alert("Fail to load data!");
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
    }

    changePage(page) {
        axios.get(`http://localhost:8080/admin/account/deleted?page=${page}`, {
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
                alert("Fail to load data!");
            })
    }

    toggle() {
        this.setState({ modal: !this.state.modal })
    }

    toggleButton(usernameValue) {
        this.setState({
            modal: !this.state.modal,
            username: usernameValue
        })
    }

    handleRestore() {
        axios.post(`http://localhost:8080/admin/account/restore/${this.state.username}`,
            {},
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }

            })
            .then(response => {
                console.log(response);
                if (response.status === 200) {
                    alert(response.data);

                    this.toggle();
                    this.loadData();
                    this.setState({ username: '' });
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.data.message === 'ACCOUNT_NOT_FOUND') {
                        alert("Account not found");
                    }
                    else if (err.response.data.message === 'ACCOUNT_NOT_BELONG_TO_CUSTOMER') {
                        alert("Account not belong to customer");
                    }
                    else if (err.response.data.message === 'ACCOUNT_ACTIVE') {
                        alert("Account already active");
                    }
                    else {
                        alert("Error");
                        console.log(err);
                    }
                }
                else {
                    alert("Fail to restore!");
                }
            })
    }

    render() {
        return (
            <div>
                <h2 style={{ textAlign: 'center' }}>
                    Disabled Accounts
                </h2>
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
                            <th>Option</th>
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
                                        <Button color="success" onClick={() => this.toggleButton(`${account.username}`)}>
                                            Restore
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
                        Are you sure to restore account: <b>{this.state.username}</b> ?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={() => this.handleRestore()}>Restore</Button>
                        <Button color="primary" onClick={() => this.toggle()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                {
                    this.state.pageList.map((page, index) => {
                        return (
                            <Button key={index} onClick={() => this.changePage(`${page}`)}>
                                {page}
                            </Button>
                        )
                    })
                }
            </div>
        )
    }
}
