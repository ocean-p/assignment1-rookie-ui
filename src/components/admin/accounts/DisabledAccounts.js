import React, { Component } from 'react';
import axios from 'axios';
import { Button, Table, Modal, 
    ModalHeader, ModalBody, ModalFooter, Alert,
    Container, Row, Col
} from 'reactstrap';

export default class DisabledAccounts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accountList: [],
            pageList: [],

            modal: false,
            username: '',

            isLoadFail: false,
            messageLoadFail: '',

            isHandleFail: false,
            messageHandleFail: '',
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
                    if(response.data.successCode === 'LOAD_ACCOUNT_SUCCESS'){
                        this.setState({
                            accountList: response.data.datas.accountDTOList
                        })
                        this.handlePageList(response);
                    }
                }
            })
            .catch(() => {
                this.setState({
                    isLoadFail: true,
                    messageLoadFail: 'Fail to load disabled accounts.'
                })
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
        else{
            this.setState({ pageList: [] });
        }
    }

    changePage(page) {
        axios.get(`http://localhost:8080/admin/account/deleted?page=${page}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response.status === 200) {
                    if(response.data.successCode === 'LOAD_ACCOUNT_SUCCESS'){
                        this.setState({
                            accountList: response.data.datas.accountDTOList,
                            isLoadFail: false
                        })
                    }
                }
            })
            .catch(err => {
                if(err.response){
                    if(err.response.data.message === 'PAGE_LESS_THAN_ONE'){
                        this.setState({messageLoadFail: 'Page must be from 1.'});
                    }
                    else{
                        this.setState({messageLoadFail: 'Error to change page.'});
                    }
                }
                else{
                    this.setState({messageLoadFail: 'Fail to change page.'});
                }
                this.setState({ isLoadFail: true });
            })
    }

    toggle() {
        this.setState({ 
            modal: !this.state.modal,
            username: '',
            isHandleFail: false 
        })
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
                if (response.status === 200) {
                    if(response.data.successCode === 'RESTORE_ACCOUNT_SUCCESS'){
                        this.toggle();
                        this.loadData();
                    }
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.data.message === 'ACCOUNT_NOT_FOUND') {
                        this.setState({messageHandleFail: 'Account not found.'});
                    }
                    else if (err.response.data.message === 'ACCOUNT_NOT_BELONG_TO_CUSTOMER') {
                        this.setState({messageHandleFail: 'Account not belong to customer.'});
                    }
                    else if (err.response.data.message === 'ACCOUNT_ACTIVE') {
                        this.setState({messageHandleFail: 'Account already active.'});
                    }
                    else {
                        this.setState({messageHandleFail: 'Error to restore account.'});
                    }
                }
                else {
                    this.setState({messageHandleFail: 'Fail to restore account.'});
                }
                this.setState({ isHandleFail: true });
            })
    }

    render() {
        return (
            <div>
                <h2 style={{ textAlign: 'center' }}>
                    Disabled Accounts
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
                        {
                            this.state.isHandleFail &&
                            <Alert color="danger">
                                {this.state.messageHandleFail}
                            </Alert>
                        }
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
