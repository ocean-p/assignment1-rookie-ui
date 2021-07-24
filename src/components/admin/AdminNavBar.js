import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';

export default class AdminNavBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            username: localStorage.getItem('name')
        };
    }

    toggle = () => {
        this.setState({ isOpen: !this.state.isOpen })
    }

    render() {
        return (
            <div>
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="/">Welcome admin, {this.state.username}</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                    Accounts
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem>
                                        <NavLink href="/accounts/customer">Customer Accounts</NavLink>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <NavLink href="/accounts/admin">Admin Accounts</NavLink>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <NavLink href="/accounts/disabled">Disabled Accounts</NavLink>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <NavLink href="/accounts/add">Add Account</NavLink>
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                    Categories
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem>
                                        <NavLink href="/categories">Available Categories</NavLink>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <NavLink href="/categories/disabled">Disabled Categories</NavLink>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <NavLink href="/categories/add">Add Category</NavLink>
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                    Products
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem>
                                        <NavLink href="/products">Available Products</NavLink>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <NavLink href="/products/disabled">Disabled Products</NavLink>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <NavLink href="/products/add">Add Product</NavLink>
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        )
    }
}
