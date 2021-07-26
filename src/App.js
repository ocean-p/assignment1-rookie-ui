import React, { Component } from 'react';
import Login from './components/Login';
import CustomerHome from './components/customer/CustomerHome';
import AdminHome from './components/admin/AdminHome';
import SignUp from './components/SignUp';
import { Button } from 'reactstrap';


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

        {this.state.isLogin === true && this.state.role === 'CUSTOMER' && <CustomerHome onLogout={this.handle} />}
        {this.state.isLogin === true && this.state.role === 'ADMIN' && <AdminHome onLogout={this.handle} />}
        {this.state.isLogin === false && this.state.openSignUpForm === true && <SignUp onClose={this.handleCloseSignUp} />}
        {this.state.isLogin === false && this.state.openSignUpForm === false &&
          <div>
            <Login onLogin={this.handle} />
            <br/>
            <div style={{marginLeft: '30%'}}>
              <Button color="warning" onClick={this.handleOpenSignUp}>Sign Up</Button>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default App;
