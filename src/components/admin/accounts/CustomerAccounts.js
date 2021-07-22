import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Input, Container, Row, Col, Table } from 'reactstrap';


export default class CustomerAccounts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            accountList: [],
            pageList: [],
            searchValue: '',
            searchPageList: [],
            isSearch: false
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
            .catch(err => {
                alert("Fail to load data!");
            })
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
                alert("Fail to load data!");
            })
    }

    handleFind(e){
        e.preventDefault();
        this.setState({searchValue: e.target.searchvalue.value})
        axios.get(`http://localhost:8080/admin/account?value=${e.target.searchvalue.value}&page=1`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
        .then(response => {
            if(response.status === 200){
                this.setState({
                    accountList: response.data.accountDTOList,
                    isSearch: true
                }, () => {
                    if(this.state.accountList.length === 0){
                        alert("No results");
                    }
                })
                this.handleSearchPageList(response);
            }
        })
        .catch(err =>{
            if(err.response.data.message){
                if(err.response.data.message === "SEARCH_VALUE_IS_EMPTY"){
                    alert("Not yet input anything!")
                }
                else if(err.response.data.message === "PAGE_LESS_THAN_ONE"){
                    alert("Number of page must be from 1!");
                } 
            }
            else{
                alert("Fail to load data!")
            }
            this.setState({
                accountList: [],
                pageList: [],
                searchValue: '',
                searchPageList: [],
                isSearch: false
            })
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
                if(err.response.data.message){
                    if(err.response.data.message === "SEARCH_VALUE_IS_EMPTY"){
                        alert("Not yet input anything!")
                    }
                    else if(err.response.data.message === "PAGE_LESS_THAN_ONE"){
                        alert("Number of page must be from 1!");
                    } 
                }
                else{
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

    render() {
        return (
            <div>
                <h2 style={{ textAlign: 'center' }}>
                    Customer Accounts
                    <br/>
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
                <br/>
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
                                        <Button color="primary">Update</Button>
                                    </td>
                                    <td>
                                        <Button color="danger">Delete</Button>
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
            </div>
        )
    }
}
