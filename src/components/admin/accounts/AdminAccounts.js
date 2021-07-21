import React, { Component } from 'react';
import { Table } from 'reactstrap';
import axios from 'axios';
import { Button } from 'reactstrap';


export default class AdminAccounts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accountList: [],
            pageList: []
        };
    }

    loadData() {
        axios.get('http://localhost:8080/admin/account/ad?page=1', {
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

    componentDidMount() {
        this.loadData();
    }

    handlePageList(response) {
        var list = [];
        for (let i = 0; i < response.data.totalPages; i++) {
            list.push(i + 1);
        }
        if(list.length > 1){
            this.setState({ pageList: list });
        }
    }

    changePage(page) {
        axios.get(`http://localhost:8080/admin/account/ad?page=${page}`, {
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

    render() {
        return (
            <div>
                <h2 style={{ textAlign: 'center' }}>
                    Admin Accounts
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
