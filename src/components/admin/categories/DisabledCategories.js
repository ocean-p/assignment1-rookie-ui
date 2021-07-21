import React, { Component } from 'react';
import { Table } from 'reactstrap';
import axios from 'axios';
import { Button } from 'reactstrap';


export default class DisabledCategories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categoryList: [],
            pageList: []
        };
    }

    loadData() {
        axios.get('http://localhost:8080/admin/category/deleted?page=1', {
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
        axios.get(`http://localhost:8080/admin/category/deleted?page=${page}`, {
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
                alert("Fail to load data!");
            })
    }


    render() {
        return (
            <div>
                <h2 style={{ textAlign: 'center' }}>
                    Disabled Categories
                </h2>
                <br/>
                <Table hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Create-Date</th>
                            <th>Update-Date</th>
                            <th>Option</th>
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
                                        <Button color="success">Restore</Button>
                                    </td>
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
