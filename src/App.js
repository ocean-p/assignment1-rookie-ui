import React, { Component } from 'react';
import Login from './components/Login';
import CustomerHome from './components/customer/CustomerHome';
import AdminHome from './components/admin/AdminHome';
import SignUp from './components/SignUp';
import { Button, Container, Row, Col } from 'reactstrap';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLogin: localStorage.getItem('accessToken') != null,
      role: localStorage.getItem('role') === 'ROLE_ADMIN' ? 'ADMIN' : 'CUSTOMER',
      openSignUpForm: false
    };
  }

  componentDidMount() {
    this.handle();
  }

  handle = () => {
    this.setState({
      isLogin: localStorage.getItem('accessToken') != null,
      role: localStorage.getItem('role') === 'ROLE_ADMIN' ? 'ADMIN' : 'CUSTOMER'
    });
  }

  handleOpenSignUp = () => {
    this.setState({ openSignUpForm: true });
  }

  handleCloseSignUp = () => {
    this.setState({ openSignUpForm: false })
  }

  render() {
    return (

      <div className="App">
        {this.state.isLogin === false && this.state.openSignUpForm === false && <Login onLogin={this.handle} />}
        {this.state.isLogin === true && this.state.role === 'CUSTOMER' && <CustomerHome onLogout={this.handle} />}
        {this.state.isLogin === true && this.state.role === 'ADMIN' && <AdminHome onLogout={this.handle} />}
        {this.state.isLogin === false && this.state.openSignUpForm === true && <SignUp onClose={this.handleCloseSignUp} />}
        {this.state.isLogin === false
          && this.state.openSignUpForm === false
          && <Container>
            <Row>
              <Col sm="12" md={{ size: 6, offset: 3 }}>
                <div style={{color: 'grey'}}>-------------------</div>
              </Col>
            </Row>
            <Row>
              <Col sm="12" md={{ size: 6, offset: 3 }}>
                <Button color="warning" onClick={this.handleOpenSignUp}>Sign Up</Button>
              </Col>
            </Row>
          </Container>
        }

      </div>
    );
  }
}

export default App;
