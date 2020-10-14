import React from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Table, ButtonGroup, Button, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardTeacher, faWallet, faEdit, faTrash, faUserPlus, faStepBackward, faFastBackward, faStepForward, faFastForward, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import SuccessToast from '../SuccessToast';

import './../../style/Style.css';


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
        this.findAllInstructors(this.state.currentPage);
    }

    findAllInstructors(currentPage) {
        currentPage -= 1;
        let sortDirection = this.state.sortToggle ? "asc" : "desc";
        axios.get("http://localhost:8080/instructor-api/list?page=" + currentPage + "&size=" + this.state.instructorsPerPage + "&sortBy=paymentStatus&sortDir=" + sortDirection)
            .then(response => response.data)
            .then((data) => {
                this.setState({
                    instructors: data.content,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                    currentPage: data.number + 1
                });
            });
    }

    deleteInstructor = (idInstructor) => {
        axios.delete("http://localhost:8080/instructor-api/list/" + idInstructor)
            .then(response => {
                if (response.data != null) {
                    this.setState({ "show": true });
                    setTimeout(() => this.setState({ "show": false }), 3000);
                    this.setState({
                        instructors: this.state.instructors.filter(instructor => instructor.id !== idInstructor)
                    });
                } else {
                    this.setState({ "show": false });
                }
            });
    }

    changePage = event => {
        let target = parseInt(event.target.value);
        if(this.state.searchedInstructor) {
            this.searchInstructor(target)
        } else {
            this.findAllInstructors(target);
        }
        this.setState({
            [event.target.name]: target
        });

    };

    firstPage = () => {
        let firstPage = 1;
        if (this.state.currentPage > firstPage) {
            if(this.state.searchedInstructor) {
                this.searchInstructor(firstPage)
            } else {
                this.findAllInstructors(firstPage);
            }        }
    };

    prevPage = () => {
        let prevPage = this.state.currentPage - 1;
        if (this.state.currentPage > 1) {
            if(this.state.searchedInstructor) {
                this.searchInstructor(prevPage)
            } else {
                this.findAllInstructors(prevPage);
            }        }
    };

    lastPage = () => {
        // let instructorsLength = this.props.instructorData.instructors.length;
        let instructorsLength = this.state.instructors.length;
        let lastPage = Math.ceil(this.state.totalElements / this.state.instructorsPerPage);
        if (this.state.currentPage < lastPage) {
            if(this.state.searchedInstructor) {
                this.searchInstructor(lastPage)
            } else {
                this.findAllInstructors(lastPage);
            }        }
    };

    nextPage = () => {
        let nextPage = this.state.currentPage + 1;
        if (this.state.currentPage < Math.ceil(this.state.totalElements / this.state.instructorsPerPage)) {
            if(this.state.searchedInstructor) {
                this.searchInstructor(nextPage)
            } else {
                this.findAllInstructors(nextPage);
            }          }
    };

    searchChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    cancelSearch = () => {
        this.setState({ "searchedInstructor" : ''})
    };

    sortData = () => {
        this.setState(state => ({
            sortToggle: !state.sortToggle
        }));

        this.findAllInstructors(this.state.currentPage);
    }

    searchInstructor = (currentPage) => {
        currentPage -= 1;
        axios.get("http://localhost:8080/instructor-api/search/"+this.state.searchedInstructor+"?page=" + currentPage + "&size=" + this.state.instructorsPerPage)
            .then(response => response.data)
            .then((data) => {
                this.setState({
                    instructors: data.content,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                    currentPage: data.number + 1
                });
            });
    }



    render() {
        const { instructors, currentPage, totalPages, searchedInstructor } = this.state;

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
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <div style={{ "float": "left" }}>
                            <FontAwesomeIcon icon={faChalkboardTeacher} />     Instructors List
                        </div>

                        <div style={{ "float": "right" }}>
                            <InputGroup size="sm">
                                <FormControl style={searchBoxCss} className={"bg-dark"} name="searchedInstructor" value={searchedInstructor} placeholder = "Search"
                                    onChange={this.searchChange} />
                                <InputGroup.Append>
                                    <Button size="sm" variant="outline-info" type="button" onClick = {this.searchInstructor}>
                                        <FontAwesomeIcon icon={faSearch} />
                                    </Button>
                                    <Button size="sm" variant="outline-danger" type="button" onClick = {this.cancelSearch}>
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
                                    <th onClick={this.sortData}>Last Name<div className={this.state.sortToggle ? "arrow arrow-down" : "arrow arrow-up"} /></th>
                                    <th>First Name</th>
                                    <th>Nr Hours Week</th>
                                    <th>Week's Wage</th>
                                    <th>Full Nr Hours</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>


                            <tbody>
                                {this.state.instructors.length === 0 ?
                                    <tr align="center">
                                        <td colSpan="10"> No Instructors in the Data Base</td>
                                    </tr> :

                                    this.state.instructors.map((instructor, index) => (
                                        <tr key={instructor.id}>
                                            <td>{instructor.lastName}</td>
                                            <td>{instructor.firstName}</td>
                                            <td>{instructor.nrHoursWeek}</td>
                                            <td>{instructor.nrHoursFull}</td>
                                            <td>{instructor.wageWeek}</td>
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

export default InstructorList;