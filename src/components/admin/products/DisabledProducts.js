import React, { Component } from 'react';
import {
    Card, Button, CardImg, CardTitle, CardText,
    CardSubtitle, CardBody, Container, Row, Col
} from 'reactstrap';
import axios from 'axios';

export default class DisabledProducts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productList: [],
            pageList: []
        };
    }

    loadData() {
        axios.get('http://localhost:8080/admin/product/deleted?page=1', {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        productList: response.data.productList
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
        if (list.length > 1) {
            this.setState({ pageList: list });
        }
    }

    changePage(page) {
        axios.get(`http://localhost:8080/admin/product/deleted?page=${page}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        productList: response.data.productList
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
                    Disabled Products
                </h2>
                <br />
                <Container>
                    <Row xs="3" className="mb-3">
                        <Col>
                            {
                                this.state.pageList.map((page, index) => {
                                    return (
                                        <Button key={index} onClick={() => this.changePage(`${page}`)}>
                                            {page}
                                        </Button>
                                    )
                                })
                            }
                        </Col>
                    </Row>
                    <Row xs="4">
                        {this.state.productList.map((product, index) => {
                            return (
                                <Col key={index} className="mb-4">
                                    <Card>
                                        <CardImg top width="50%" src="https://slyclothing.vn/wp-content/uploads/2021/01/jacket-winter_3.jpg" 
                                            alt="Card image cap" />
                                        <CardBody>
                                            <CardTitle tag="h5">{product.name} - {product.price}$</CardTitle>
                                            <CardSubtitle tag="h6" className="mb-2 text-muted">{product.averageRate}/10 star</CardSubtitle> 
                                            <CardText>Quantity: {product.quantity}</CardText>
                                            <CardText>Description: {product.description}</CardText>
                                            <CardText>Update-Date: {product.updateDate}</CardText>
                                            <CardText>Create-Date: {product.createDate}</CardText>
                                            <Button color="success">Restore</Button>
                                        </CardBody>
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>
                </Container>
            </div>
        )
    }
}
