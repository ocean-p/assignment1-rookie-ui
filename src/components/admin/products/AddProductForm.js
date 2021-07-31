import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, Label, Input, FormGroup, Alert} from 'reactstrap';
import axios from 'axios';

export default class AddProductForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categoryList: [],

            imageSelected: '',
            imageUrl: '',

            isFail: false,
            messageFail: '',

            isSuccess: false,
        };
    }

    componentDidMount() {
        this.loadCategory();
    }

    uploadImage() {
        if(this.state.imageSelected){
            const formData = new FormData();
            formData.append("file", this.state.imageSelected);
            formData.append("upload_preset", "jk6qdqlp");

            axios.post('https://api.cloudinary.com/v1_1/daboy6hii/image/upload', formData)
            .then((response) => {
                if(response.status === 200) {
                    this.setState({
                        imageUrl: response.data.url
                    })
                }
            })
            .catch(() => {
                this.setState({
                    isFail: true,
                    messageFail: 'Fail to upload image.',
                    isSuccess: false
                })
            })
        }
        else{
            this.setState({
                isFail: true,
                messageFail: 'Please select a image before upload.',
                isSuccess: false
            })
        }
    }

    loadCategory() {
        axios.get('http://localhost:8080/admin/category/list', {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
            .then(response => {
                if (response.status === 200) {
                    if(response.data.successCode === 'LOAD_CATEGORY_SUCCESS'){
                        this.setState({ categoryList: response.data.datas })
                    }
                }
            })
            .catch(() => {
                this.setState({
                    isFail: true,
                    messageFail: 'Fail to load category.',
                    isSuccess: false
                })
            })
    }

    handleAdd(e) {
        e.preventDefault();
        axios.post('http://localhost:8080/admin/product', 
            {
                name: e.target.name.value,
                price: e.target.price.value,
                quantity: e.target.quantity.value,
                description: e.target.description.value,
                image: `${this.state.imageUrl}`,
                categoryId: e.target.category.value
            },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } 
            }
        )
        .then(response => {
            if(response.status === 200){
                if(response.data.successCode === 'ADD_PRODUCT_SUCCESS'){
                    this.setState({
                        isSuccess: true,
                        isFail: false
                    })
                }
            }
        })
        .catch(err => {
            if(err.response){
                switch (err.response.data.message) {
                    case 'CATEGORY_NOT_FOUND':
                        this.setState({ messageFail: 'Category not found.'});
                        break;
                    case 'CATEGORY_IS_DISABLED':
                        this.setState({ messageFail: 'Category is disabled.'});
                        break;
                    case 'NAME_IS_EMPTY':
                        this.setState({ messageFail: 'Name is empty.'});
                        break;
                    case 'IMAGEURL_IS_EMPTY':
                        this.setState({ messageFail: 'Image URL is empty.'});
                        break;
                    case 'PRICE_LESS_THAN_ZERO':
                        this.setState({ messageFail: 'Price must be > 0.'});
                        break;
                    case 'QUANTITY_LESS_THAN_ZERO':
                        this.setState({ messageFail: 'Quantity must be > 0.'});
                        break;
                    default:
                        this.setState({ messageFail: 'Error to add product.'})
                }
            }
            else{
                this.setState({ messageFail: 'Fail to add category.'})
            }
            this.setState({
                isFail: true,
                isSuccess: false
            })
        })
    }

    render() {
        return (
            <div>
                <h2 style={{marginLeft: '50px', marginTop: '20px'}}>
                    Add Product Form
                </h2>
                <br/>
                <Form onSubmit={(e) => this.handleAdd(e)}>
                    <Container>
                        <Row xs="2">
                            <Col>
                                <FormGroup className="mb-4">
                                    <Label for="name" className="mr-sm-2"><b>Name</b></Label>
                                    <Input type="text" name="name" id="name" />
                                    <p>
                                        <i>*Not empty.</i>
                                    </p>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row xs="2">
                            <Col>
                                <FormGroup className="mb-4">
                                    <Label for="price" className="mr-sm-2"><b>Price</b></Label>
                                    <Input type="text" name="price" id="price" />
                                    <p>
                                        <i>*Price must be greater 0.</i>
                                    </p>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row xs="2">
                            <Col>
                                <FormGroup className="mb-4">
                                    <Label for="quantity" className="mr-sm-2"><b>Quantity</b></Label>
                                    <Input type="number" name="quantity" id="quantity" />
                                    <p>
                                        <i>*Quantity must be greater 0.</i>
                                    </p>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row xs="2">
                            <Col>
                                <FormGroup className="mb-4">
                                    <Label for="description" className="mr-sm-2"><b>Description</b></Label>
                                    <Input type="text" name="description" id="description" />
                                    <p>
                                        <i>*Can be blank.</i>
                                    </p>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row xs="2" className="mb-4">
                            <Col>
                                <FormGroup>
                                    <Label for="image" className="mr-sm-2"><b>Image URL</b></Label>
                                    <Input type="text" name="image" id="image" 
                                           value={this.state.imageUrl} placeholder="Choose a file and upload" readOnly/>
                                </FormGroup>
                                <Input type="file" className="mb-2" accept="image/*"
                                    onChange={(e) => this.setState({imageSelected: e.target.files[0]})}/>
                                <Button onClick={() => this.uploadImage()}>Upload</Button>
                            </Col>
                        </Row>
                        <Row xs="4" className="mb-4">
                            <Col>
                                <Label for="category"><b>Category</b></Label>
                            </Col>
                            <Col>
                                <select style={{height: '40px', width: '100px'}} id="category" name="category">
                                    {this.state.categoryList.map((category, index) => {
                                        return(
                                            <option key={index} value={category.id}>
                                                {category.name}
                                            </option>
                                        )
                                    })}
                                </select>
                            </Col>
                        </Row>
                        <Row xs="2">
                            <Col>
                                {
                                    this.state.isFail && 
                                    <Alert color="danger">
                                        {this.state.messageFail}
                                    </Alert>
                                }
                                {
                                    this.state.isSuccess && 
                                    <Alert color="success">
                                        Success to add product.
                                    </Alert>
                                }
                            </Col>
                        </Row>
                        <Button color="primary" className="mb-4">Add Product</Button>
                    </Container>
                </Form>
            </div>
        )
    }
}
