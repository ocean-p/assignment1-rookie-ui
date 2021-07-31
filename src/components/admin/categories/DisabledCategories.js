import React, { Component } from 'react';
import axios from 'axios';
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter,
    Container, Row, Col, Alert
} from 'reactstrap';


export default class DisabledCategories extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categoryList: [],
            pageList: [],

            modal: false,
            categoryName: '',
            categoryId: '',

            isRestoreFail: false,
            messageRestoreFail: '',

            isLoadFail: false,
            messageLoadFail: '',
        };
    }

    loadData() {
        axios.get('http://localhost:8080/admin/category/deleted?page=1', {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response.status === 200) {
                    if(response.data.successCode === 'LOAD_CATEGORY_SUCCESS'){
                        this.setState({
                            categoryList: response.data.datas.categories
                        })
                        this.handlePageList(response);
                    }
                }
            })
            .catch(() => {
                this.setState({
                    isLoadFail: true,
                    messageLoadFail: 'Fail to load disabled categories.'
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
        if (list.length > 1) {
            this.setState({ pageList: list });
        }
    }

    changePage(page) {
        axios.get(`http://localhost:8080/admin/category/deleted?page=${page}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response.status === 200) {
                    if(response.data.successCode === 'LOAD_CATEGORY_SUCCESS'){
                        this.setState({
                            categoryList: response.data.datas.categories, 
                            isLoadFail: false
                        })
                    }
                }
            })
            .catch(() => {
                this.setState({
                    isLoadFail: true,
                    messageLoadFail: 'Fail to change page.'
                })
            })
    }

    toggle() {
        this.setState({ 
            modal: !this.state.modal,
            categoryName: '',
            categoryId: '',
            isRestoreFail: false
        })
    }

    toggleButton(categoryIdValue, categoryNameValue) {
        this.setState({
            modal: !this.state.modal,
            categoryName: categoryNameValue,
            categoryId: categoryIdValue
        })
    }

    handleRestore() {
        axios.post(`http://localhost:8080/admin/category/restore/${this.state.categoryId}`,
            {},
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            }
        ).then(response => {
            if (response.status === 200) {
                if(response.data.successCode === 'RESTORE_CATEGORY_SUCCESS'){
                    this.toggle();
                    this.loadData();
                }
            }
        })
            .catch(err => {
                if (err.response) {
                    if (err.response.data.message === 'CATEGORY_NOT_FOUND') {
                        this.setState({messageRestoreFail: 'Category not found.'});
                    }
                    else if (err.response.data.message === 'CATEGORY_ACTIVE') {
                        this.setState({messageRestoreFail: 'Category already active.'});
                    }
                    else {
                        this.setState({messageRestoreFail: 'Error to restore category.'});
                    }
                }
                else {
                    this.setState({messageRestoreFail: 'Fail to restore category.'});
                }
                this.setState({isRestoreFail: true});
            })
    }

    render() {
        return (
            <div>
                <h2 style={{ textAlign: 'center' }}>
                    Disabled Categories
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
                                        <Button color="success" onClick={() => this.toggleButton(`${category.id}`, `${category.name}`)}>
                                            Restore
                                        </Button>
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
                <Modal isOpen={this.state.modal} toggle={() => this.toggle()}>
                    <ModalHeader toggle={() => this.toggle()}>Notice</ModalHeader>
                    <ModalBody>
                        Sure to restore Category: <b>{this.state.categoryName}</b> -
                        id: <b>{this.state.categoryId}</b> ?
                        {
                            this.state.isRestoreFail &&
                            <Alert color="danger">
                                {this.state.messageRestoreFail}
                            </Alert>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={() => this.handleRestore()}>Restore</Button>
                        <Button color="primary" onClick={() => this.toggle()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
