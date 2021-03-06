import React from 'react';

import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NavigationBar() {
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="">Surf School Schedule</Navbar.Brand>
            <Nav className="mr-auto">
                <Link to={""} className="nav-link">Home</Link>
                <Link to={"/students"} className="nav-link">Students</Link>
                <Link to={"/instructors"} className="nav-link">Instructors</Link>
                <Link to={"/schedule"} className="nav-link">Schedule</Link>
                <Link to={"/lessons"} className="nav-link">Lessons List</Link>
                <Link to={"/priceTableList"} className="nav-link">PriceTable</Link>


            </Nav>

        </Navbar>
    );
}