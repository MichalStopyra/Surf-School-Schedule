import React from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import { Alert, Card, Table, ButtonGroup, Button, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardTeacher, faWallet, faEdit, faTrash, faUserPlus, faStepBackward, faFastBackward, faStepForward, faFastForward, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import SuccessToast from '../SuccessToast';

import './../../style/Style.css';


import { connect } from 'react-redux';
import { deleteInstructor, fetchAllInstructors, searchInstructors } from './../../services/index';

class InstructorList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            instructors: [],
            currentPage: 1,
            instructorsPerPage: 5,
            searchedInstructor: '',
            sortToggle: true
        };
    }


    componentDidMount() {
        this.props.fetchAllInstructors(this.props.instructor.currentPage, this.state.instructorsPerPage, this.props.instructor.sortDirection);
    }

    deleteInstructor = (idInstructor) => {

        this.props.deleteInstructor(idInstructor);

        setTimeout(() => {
            if (this.props.instructor != null) {
                this.setState({ "show": true });
                setTimeout(() => this.setState({ "show": false }), 1000);

            } else {
                this.setState({ "show": false });
            }
        }, 1000);
        this.props.fetchAllInstructors(this.props.instructor.currentPage, this.state.instructorsPerPage, this.props.instructor.sortDirection, false);

    };

    changePage = event => {
        let target = parseInt(event.target.value);
        if (this.props.instructor.searchedInstructor) {
            this.searchInstructor(target)
        } else {
            let sortDirection = this.state.sortToggle ? "asc" : "desc";
            this.props.fetchAllInstructors(target, this.state.instructorsPerPage, this.props.instructor.sortDirection, false);
        }
        this.setState({
            [event.target.name]: target
        });

    };

    firstPage = () => {
        let firstPage = 1;

        if (this.props.instructor.currentPage > firstPage) {
            this.props.instructor.currentPage = 1;
            if (this.props.instructor.searchedInstructor) {
                this.searchInstructor(this.props.instructor.currentPage)
            } else {
                let sortDirection = this.state.sortToggle ? "asc" : "desc";
                this.props.fetchAllInstructors(this.props.instructor.currentPage, this.state.instructorsPerPage, this.props.instructor.sortDirection);
            }
        }
    };

    prevPage = () => {
        if (this.props.instructor.currentPage > 1) {
            --this.props.instructor.currentPage;
            if (this.props.instructor.searchedInstructor) {
                this.searchInstructor(this.props.instructor.currentPage)
            } else {
                let sortDirection = this.state.sortToggle ? "asc" : "desc";
                this.props.fetchAllInstructors(this.props.instructor.currentPage, this.state.instructorsPerPage, this.props.instructor.sortDirection, false);
            }
        }
    };

    lastPage = () => {
        let instructorsLength = this.state.instructors.length;
        let lastPage = Math.ceil(this.props.totalElements / this.state.instructorsPerPage);
        if (this.props.instructor.currentPage < lastPage) {
            this.props.instructor.currentPage = lastPage;
            if (this.props.instructor.searchedInstructor) {
                this.searchInstructor(this.props.instructor.currentPage)
            } else {
                this.props.fetchAllInstructors(this.props.instructor.currentPage, this.state.instructorsPerPage, this.props.instructor.sortDirection);
            }
        }
    };

    nextPage = () => {
        if (this.state.currentPage < Math.ceil(this.props.totalElements / this.state.instructorsPerPage)) {
            ++this.props.instructor.currentPage;

            if (this.props.instructor.searchedInstructor) {
                this.searchInstructor(this.props.instructor.currentPage)
            } else {
                let sortDirection = this.state.sortToggle ? "asc" : "desc";
                this.props.fetchAllInstructors(this.props.instructor.currentPage, this.state.instructorsPerPage, this.props.instructor.sortDirection, false);
            }
        }
    };

    searchChange = event => {
        this.props.instructor.searchedInstructor = event.target.value;
        this.forceUpdate();
    };

    cancelSearch = () => {
        this.props.instructor.searchedInstructor = '';
        this.props.fetchAllInstructors(this.props.instructor.currentPage, this.state.instructorsPerPage, this.props.instructor.sortDirection, false);
        this.forceUpdate();
    };

    sortData = () => {
       // console.log(this.props.instructor.sortDirection);
        if (this.props.instructor.sortDirection === "asc")
            this.props.instructor.sortDirection = "desc";
        else
            this.props.instructor.sortDirection = "asc";
         //   console.log(this.props.instructor.sortDirection);

        this.props.fetchAllInstructors(this.props.instructor.currentPage, this.state.instructorsPerPage, this.props.instructor.sortDirection, false);

    }

    searchInstructor = (currentPage) => {
        if (this.props.instructor.searchedInstructor)
            this.props.searchInstructors(this.props.instructor.searchedInstructor, this.props.instructor.currentPage, this.props.instructor.instructorsPerPage);
    }

    render() {
        const searchedInstructor = this.props.instructor.searchedInstructor;
        const totalPages = this.props.instructor.totalPages;
        const totalElements = this.props.instructor.totalElements;
        const instructor = this.props.instructor;
        const instructors = this.props.instructors;
        const currentPage = this.props.instructor.currentPage;
        const sortDirection = this.props.instructor.sortDirection;
        
        const pageNumCss = {
            width: "45px",
            border: "1px solid #F8F8FF",
            color: "#F8F8FF",
            textAlign: "center",
            fontWeight: "bold"
        };

        const searchBoxCss = {
            width: "100px",
            border: "1px solid #17A2B8",
            color: "#17A2B8",
            textAlign: "center",
            fontWeight: "bold"
        };


        return (
            <div>

                <div style={{ "display": this.state.show ? "block" : "none" }}>
                    <SuccessToast show={this.state.show} message="Instructor Deleted Successfully." type="danger" />
                </div>

                {/* {instructorData.error ?
                <Alert variant="danger">
                    {instructorData.error}

                </Alert> : */}
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <div style={{ "float": "left" }}>
                            <FontAwesomeIcon icon={faChalkboardTeacher} />     Instructors List
                        </div>

                        <div style={{ "float": "right" }}>
                            <InputGroup size="sm">
                                <FormControl style={searchBoxCss} className={"bg-dark"} name="searchedInstructor" value={searchedInstructor} placeholder="Search"
                                    onChange={this.searchChange} />
                                <InputGroup.Append>
                                    <Button size="sm" variant="outline-info" type="button" onClick={this.searchInstructor}>
                                        <FontAwesomeIcon icon={faSearch} />
                                    </Button>
                                    <Button size="sm" variant="outline-danger" type="button" onClick={this.cancelSearch}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </div>


                    </Card.Header>
                    <Card.Body>
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th onClick={this.sortData}>Last Name<div className={sortDirection ==="asc" ? "arrow arrow-down" : "arrow arrow-up"} /></th>
                                    <th>First Name</th>
                                    <th>Hour's Wage [zl]</th>
                                    <th>Nr Hours Week</th>
                                    <th>Week's Wage</th>
                                    <th>Full Nr Hours</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>


                            <tbody>
                                {instructors.length === 0 ?
                                    <tr align="center">
                                        <td colSpan="10"> No Instructors in the Data Base</td>
                                    </tr> :

                                    instructors.map((instructor, index) => (
                                        <tr key={instructor.id}>
                                            <td>{instructor.lastName}</td>
                                            <td>{instructor.firstName}</td>
                                            <td>{instructor.hourWage}</td>
                                            <td>{instructor.nrHoursWeek}</td>
                                            <td>{instructor.wageWeek}</td>
                                            <td>{instructor.nrHoursFull}</td>
                                            <td>
                                                <ButtonGroup>
                                                    <Link to={"settleInstructor/" + instructor.id}> <Button size="sm" variant="outline-success"> <FontAwesomeIcon icon={faWallet} /> </Button> </Link>
                                                    <Link to={"editInstructor/" + instructor.id}> <Button size="sm" variant="outline-primary"> <FontAwesomeIcon icon={faEdit} /> </Button> </Link>
                                                    <Button size="sm" variant="outline-danger" onClick={this.deleteInstructor.bind(this, instructor.id)}> <FontAwesomeIcon icon={faTrash} /> </Button>
                                                </ButtonGroup>
                                            </td>

                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </Card.Body>
                    <Card.Footer>
                        <div style={{ "float": "left" }}>
                            <Link to={"add-instructor"} className="nav-link">
                                <ButtonGroup>
                                    <Button size="lg" variant="outline-light"> <FontAwesomeIcon icon={faUserPlus} /> </Button>
                                </ButtonGroup>
                            </Link>
                            Page {currentPage} of {totalPages}
                        </div>

                        <div style={{ "float": "right" }}>
                            <InputGroup size="sm">
                                <InputGroup.Prepend>
                                    <Button type="button" variant="outline-light" disabled={currentPage === 1 ? true : false}
                                        onClick={this.firstPage}>
                                        <FontAwesomeIcon icon={faFastBackward} /> First
                                            </Button>
                                    <Button type="button" variant="outline-light" disabled={currentPage === 1 ? true : false}
                                        onClick={this.prevPage}>
                                        <FontAwesomeIcon icon={faStepBackward} /> Prev
                                            </Button>
                                </InputGroup.Prepend>
                                <FormControl style={pageNumCss} className={"page-num bg-dark"} name="currentPage" value={currentPage}
                                    onChange={this.changePage} />
                                <InputGroup.Append>
                                    <Button type="button" variant="outline-light" disabled={currentPage === totalPages ? true : false}
                                        onClick={this.nextPage}>
                                        <FontAwesomeIcon icon={faStepForward} /> Next
                                            </Button>
                                    <Button type="button" variant="outline-light" disabled={currentPage === totalPages ? true : false}
                                        onClick={this.lastPage}>
                                        <FontAwesomeIcon icon={faFastForward} /> Last
                                            </Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </div>

                    </Card.Footer>
                </Card>

            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        instructor: state.instructor,
        instructors: state.instructor.instructors,
        totalPages: state.instructor.totalPages,
        totalElements: state.instructor.totalElements,
        currentPage: state.instructor.currentPage,
        searchedInstructor: state.instructor.searchedInstructor,
        sortDirection: state.instructor.sortDirection
    }
};


const mapDispatchToProps = dispatch => {
    return {
        fetchAllInstructors: (currentPage, size, sortDir, addSelect) => dispatch(fetchAllInstructors(currentPage, size, sortDir, addSelect)),
        deleteInstructor: (instructorId) => dispatch(deleteInstructor(instructorId)),
        searchInstructors: (searchedInstructor, currentPage, sizePage) => dispatch(searchInstructors(searchedInstructor, currentPage, sizePage))
    }

};


export default connect(mapStateToProps, mapDispatchToProps)(InstructorList);