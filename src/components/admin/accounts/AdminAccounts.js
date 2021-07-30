import React, { Component } from 'react';
import { Table } from 'reactstrap';
import axios from 'axios';
import { Button, Container, Row, Col, Alert } from 'reactstrap';


export default class AdminAccounts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accountList: [],
            pageList: [],

            isLoadFail: false,
            messageLoadFail: '',
        };
    }

    loadData() {
        axios.get('http://localhost:8080/admin/account/ad?page=1', {
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
                    messageLoadFail: 'Fail to load admin accounts.'
                })
            })
    }

    componentDidMount() {
        this.loadData();
    }

    handlePageList(response) {
        var list = [];
        for (let i = 0; i < response.data.datas.totalPages; i++) {
            list.push(i + 1);
        }
        if(list.length > 1){
            this.setState({ pageList: list });
        }
        else{
            this.setState({ pageList: [] });
        }
    }

    changePage(page) {
        axios.get(`http://localhost:8080/admin/account/ad?page=${page}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response.status === 200) {
                    if(response.data.successCode === 'LOAD_ACCOUNT_SUCCESS') {
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
                this.setState({isLoadFail: true});
            })
    }

    render() {
        return (
            <div>
                <h2 style={{ textAlign: 'center' }}>
                    Admin Accounts
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
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
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
