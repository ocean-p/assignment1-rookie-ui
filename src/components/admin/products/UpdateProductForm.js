import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, Label, Input, Alert } from 'reactstrap';
import axios from 'axios';

export default class UpdateProductForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            price: 0,
            quantity: 0,
            description: '',
            imageUrl: '',
            imageUrl2:'',
            imageUrl3:'',
            imageUrl4:'',
            categoryId: 1,
            categoryList: [],

            imageSelected: '',
            imageSelected2: '',
            imageSelected3: '',
            imageSelected4: '',

            isUpdateFail: false,
            messageUpdateFail: '',

            isLoadFail: false,
            messageLoadFail: '',
        };
    }

    componentDidMount() {
        this.loadCategory();
        this.loadData();
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
                    isLoadFail: true,
                    messageLoadFail: 'Fail to load category.'
                })
            })
    }

    loadData() {
        axios.get(`http://localhost:8080/admin/product/${this.props.id}`,
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            }
        )
            .then(response => {
                if (response.status === 200) {
                    if(response.data.successCode === 'LOAD_PRODUCT_SUCCESS'){
                        this.setState({
                            name: response.data.datas.name,
                            price: response.data.datas.price,
                            quantity: response.data.datas.quantity,
                            imageUrl: response.data.datas.image,
                            description: response.data.datas.description,
                            categoryId: response.data.datas.categoryId,
                            imageUrl2: response.data.datas.image2,
                            imageUrl3: response.data.datas.image3,
                            imageUrl4: response.data.datas.image4,
                        })
                    }
                }
            })
            .catch(err => {
                if (err.response) {
                    if (err.response.data.message === 'PRODUCT_NOT_FOUND') {
                        this.setState({messageLoadFail: 'Product not found.'});
                    }
                    else if (err.response.data.message === 'PRODUCT_IS_DISABLED') {
                        this.setState({messageLoadFail: 'Product is disabled.'});
                    }
                    else {
                        this.setState({messageLoadFail: 'Error to load product.'});
                    }
                }
                else {
                    this.setState({messageLoadFail: 'Fail to load product.'});
                }
                this.setState({isLoadFail: true});
            })
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
                        imageUrl: response.data.url,
                        isUpdateFail: false
                    })
                }
            })
            .catch(() => {
                this.setState({
                    isUpdateFail: true,
                    messageUpdateFail: 'Fail to upload image.'
                })
            })
        }
        else{
            this.setState({
                isUpdateFail: true,
                messageUpdateFail: 'Please choose image and upload.'
            })
        }
    }

    uploadImage2() {
        if(this.state.imageSelected2){
            const formData = new FormData();
            formData.append("file", this.state.imageSelected2);
            formData.append("upload_preset", "jk6qdqlp");

            axios.post('https://api.cloudinary.com/v1_1/daboy6hii/image/upload', formData)
            .then((response) => {
                if(response.status === 200) {
                    this.setState({
                        imageUrl2: response.data.url,
                        isUpdateFail: false
                    })
                }
            })
            .catch(() => {
                this.setState({
                    isUpdateFail: true,
                    messageUpdateFail: 'Fail to upload image.'
                })
            })
        }
        else{
            this.setState({
                isUpdateFail: true,
                messageUpdateFail: 'Please choose image and upload.'
            })
        }
    }

    uploadImage3() {
        if(this.state.imageSelected3){
            const formData = new FormData();
            formData.append("file", this.state.imageSelected3);
            formData.append("upload_preset", "jk6qdqlp");

            axios.post('https://api.cloudinary.com/v1_1/daboy6hii/image/upload', formData)
            .then((response) => {
                if(response.status === 200) {
                    this.setState({
                        imageUrl3: response.data.url,
                        isUpdateFail: false
                    })
                }
            })
            .catch(() => {
                this.setState({
                    isUpdateFail: true,
                    messageUpdateFail: 'Fail to upload image.'
                })
            })
        }
        else{
            this.setState({
                isUpdateFail: true,
                messageUpdateFail: 'Please choose image and upload.'
            })
        }
    }

    uploadImage4() {
        if(this.state.imageSelected4){
            const formData = new FormData();
            formData.append("file", this.state.imageSelected4);
            formData.append("upload_preset", "jk6qdqlp");

            axios.post('https://api.cloudinary.com/v1_1/daboy6hii/image/upload', formData)
            .then((response) => {
                if(response.status === 200) {
                    this.setState({
                        imageUrl4: response.data.url,
                        isUpdateFail: false
                    })
                }
            })
            .catch(() => {
                this.setState({
                    isUpdateFail: true,
                    messageUpdateFail: 'Fail to upload image.'
                })
            })
        }
        else{
            this.setState({
                isUpdateFail: true,
                messageUpdateFail: 'Please choose image and upload.'
            })
        }
    }

    handleUpdate(e) {
        e.preventDefault();
        axios.put(`http://localhost:8080/admin/product/${this.props.id}`,
            {
                name: e.target.name.value,
                price: e.target.price.value,
                quantity: e.target.quantity.value,
                description: e.target.description.value,
                image: `${this.state.imageUrl}`,
                image2: `${this.state.imageUrl2}`,
                image3: `${this.state.imageUrl3}`,
                image4: `${this.state.imageUrl4}`,
                categoryId: e.target.category.value
            },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            }
        )
            .then(response => {
                if (response.status === 200) {
                    if(response.data.successCode === 'UPDATE_PRODUCT_SUCCESS'){
                        this.props.onUpdate();
                    }
                }
            })
            .catch(err => {
                if (err.response) {
                    switch (err.response.data.message) {
                        case 'PRODUCT_NOT_FOUND':
                            this.setState({messageUpdateFail: 'Product not found.'});
                            break;
                        case 'PRODUCT_IS_DISABLED':
                            this.setState({messageUpdateFail: 'Product is disabled.'});
                            break;
                        case 'CATEGORY_NOT_FOUND':
                            this.setState({messageUpdateFail: 'Category not found.'});
                            break;
                        case 'CATEGORY_IS_DISABLED':
                            this.setState({messageUpdateFail: 'Category is disabled.'});
                            break;
                        case 'NAME_IS_EMPTY':
                            this.setState({messageUpdateFail: 'Name is empty.'});
                            break;
                        case 'IMAGEURL_IS_EMPTY':
                            this.setState({messageUpdateFail: 'Image url is empty.'});
                            break;
                        case 'DESCRIPTION_IS_EMPTY':
                            this.setState({messageUpdateFail: 'Description is empty.'});
                            break;
                        case 'PRICE_LESS_THAN_ZERO':
                            this.setState({messageUpdateFail: 'Price must be > 0.'});
                            break;
                        case 'QUANTITY_LESS_THAN_ZERO':
                            this.setState({messageUpdateFail: 'Quantity must be > 0.'});
                            break;
                        default: 
                            this.setState({messageUpdateFail: 'Error to update product.'});     
                    }
                }
                else {
                    this.setState({messageUpdateFail: 'Fail to update product.'});  
                }
                this.setState({isUpdateFail: true});
            })
    }

    handleChange(e, key) {
        this.setState({ [key]: e.target.value });
    }

    render() {
        return (
            <div>
                <Form onSubmit={(e) => this.handleUpdate(e)}>
                    <Container>
                        <Row xs="2">
                            {
                                this.state.isLoadFail &&
                                <Alert color="danger">
                                    {this.state.messageLoadFail}
                                </Alert>
                            }
                        </Row>
                        <Row xs="3" className="mb-4">
                            <Col>
                                <Label for="name">Name</Label>
                            </Col>
                            <Col>
                                <Input type="text" name="name" id="name"
                                    value={this.state.name}
                                    onChange={(e) => this.handleChange(e, "name")} />
                            </Col>
                        </Row>
                        <Row xs="3" className="mb-4">
                            <Col>
                                <Label for="price">Price</Label>
                            </Col>
                            <Col>
                                <Input type="text" name="price" id="price"
                                    value={this.state.price}
                                    onChange={(e) => this.handleChange(e, "price")} />
                            </Col>
                        </Row>
                        <Row xs="3" className="mb-4">
                            <Col>
                                <Label for="quantity">Quantity</Label>
                            </Col>
                            <Col>
                                <Input type="number" name="quantity" id="quantity"
                                    value={this.state.quantity}
                                    onChange={(e) => this.handleChange(e, "quantity")} />
                            </Col>
                        </Row>
                        <Row xs="3" className="mb-4">
                            <Col>
                                <Label for="description">Description</Label>
                            </Col>
                            <Col>
                                <Input type="text" name="description" id="description"
                                    value={this.state.description}
                                    onChange={(e) => this.handleChange(e, "description")} />
                            </Col>
                        </Row>
                        <Row xs="3" className="mb-4">
                            <Col>
                                <Label for="category">Category</Label>
                            </Col>
                            <Col>
                                <select style={{ height: '40px', width: '100px' }} id="category" name="category">
                                    {this.state.categoryList.map((category, index) => {
                                        return (
                                            <option key={index} value={category.id}
                                                selected={this.state.categoryId === category.id}>
                                                {category.name}
                                            </option>
                                        )
                                    })}
                                </select>
                            </Col>
                        </Row>
                        <Row xs="3" className="mb-2">
                            <Col>
                                <Label for="image">Image URL 1 (main)</Label>
                            </Col>
                            <Col>
                                <Input type="text"
                                    value={this.state.imageUrl} readOnly />
                            </Col>
                            <Col>
                                <Button onClick={() => this.uploadImage()}>Upload</Button>
                            </Col>
                        </Row>
                        <Row xs="3" className="mb-4">
                            <Col>
                            </Col>
                            <Col>
                                <Input type="file" 
                                onChange={(e) => this.setState({imageSelected: e.target.files[0]})}/>
                            </Col>
                        </Row>
                        <Row xs="3" className="mb-2">
                            <Col>
                                <Label for="image">Image URL 2</Label>
                            </Col>
                            <Col>
                                <Input type="text"
                                    value={this.state.imageUrl2} readOnly />
                            </Col>
                            <Col>
                                <Button onClick={() => this.uploadImage2()}>Upload</Button>
                            </Col>
                        </Row>
                        <Row xs="3" className="mb-4">
                            <Col>
                            </Col>
                            <Col>
                                <Input type="file" 
                                onChange={(e) => this.setState({imageSelected2: e.target.files[0]})}/>
                            </Col>
                        </Row>
                        <Row xs="3" className="mb-2">
                            <Col>
                                <Label for="image">Image URL 3</Label>
                            </Col>
                            <Col>
                                <Input type="text"
                                    value={this.state.imageUrl3} readOnly />
                            </Col>
                            <Col>
                                <Button onClick={() => this.uploadImage3()}>Upload</Button>
                            </Col>
                        </Row>
                        <Row xs="3" className="mb-4">
                            <Col>
                            </Col>
                            <Col>
                                <Input type="file" 
                                onChange={(e) => this.setState({imageSelected3: e.target.files[0]})}/>
                            </Col>
                        </Row>
                        <Row xs="3" className="mb-2">
                            <Col>
                                <Label for="image">Image URL 4</Label>
                            </Col>
                            <Col>
                                <Input type="text"
                                    value={this.state.imageUrl4} readOnly />
                            </Col>
                            <Col>
                                <Button onClick={() => this.uploadImage4()}>Upload</Button>
                            </Col>
                        </Row>
                        <Row xs="3" className="mb-4">
                            <Col>
                            </Col>
                            <Col>
                                <Input type="file" 
                                onChange={(e) => this.setState({imageSelected4: e.target.files[0]})}/>
                            </Col>
                        </Row>
                        <Row xs="2">
                            {
                                this.state.isUpdateFail &&
                                <Alert color="danger">
                                    {this.state.messageUpdateFail}
                                </Alert>
                            }
                        </Row>
                        <Button color="warning">Update</Button>
                        <Row xs="2">
                            <img src={this.state.imageUrl} alt="Image1"/>
                            <img src={this.state.imageUrl2} alt="Image2"/>
                            <img src={this.state.imageUrl3} alt="Image3"/>
                            <img src={this.state.imageUrl4} alt="Image4"/>
                        </Row>
                    </Container>
                </Form>
            </div>
        )
    }
}
