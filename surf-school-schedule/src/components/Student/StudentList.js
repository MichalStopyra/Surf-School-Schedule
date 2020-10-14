import React from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Table, ButtonGroup, Button, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faWallet, faEdit, faTrash, faUserPlus, faStepBackward, faFastBackward, faStepForward, faFastForward, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import SuccessToast from '../SuccessToast';

import './../../style/Style.css';


class StudentList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            students: [],
            currentPage: 1,
            studentsPerPage: 5,
            searchedStudent: '',
            sortToggle: false
        };
    }

    componentDidMount() {
        this.findAllStudents(this.state.currentPage);
    }

    findAllStudents(currentPage) {
        currentPage -= 1;
        let sortDirection = this.state.sortToggle ? "asc" : "desc";
        axios.get("http://localhost:8080/student-api/list?page=" + currentPage + "&size=" + this.state.studentsPerPage + "&sortBy=paymentStatus&sortDir=" + sortDirection)
            .then(response => response.data)
            .then((data) => {
                this.setState({
                    students: data.content,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                    currentPage: data.number + 1
                });
            });
    }

    deleteStudent = (idStudent) => {
        axios.delete("http://localhost:8080/student-api/list/" + idStudent)
            .then(response => {
                if (response.data != null) {
                    this.setState({ "show": true });
                    setTimeout(() => this.setState({ "show": false }), 3000);
                    this.setState({
                        students: this.state.students.filter(student => student.id !== idStudent)
                    });
                } else {
                    this.setState({ "show": false });
                }
            });
    }

    changePage = event => {
        let target = parseInt(event.target.value);
        if(this.state.searchedStudent) {
            this.searchStudent(target)
        } else {
            this.findAllStudents(target);
        }
        this.setState({
            [event.target.name]: target
        });

    };

    firstPage = () => {
        let firstPage = 1;
        if (this.state.currentPage > firstPage) {
            if(this.state.searchedStudent) {
                this.searchStudent(firstPage)
            } else {
                this.findAllStudents(firstPage);
            }        }
    };

    prevPage = () => {
        let prevPage = this.state.currentPage - 1;
        if (this.state.currentPage > 1) {
            if(this.state.searchedStudent) {
                this.searchStudent(prevPage)
            } else {
                this.findAllStudents(prevPage);
            }        }
    };

    lastPage = () => {
        // let studentsLength = this.props.studentData.students.length;
        let studentsLength = this.state.students.length;
        let lastPage = Math.ceil(this.state.totalElements / this.state.studentsPerPage);
        if (this.state.currentPage < lastPage) {
            if(this.state.searchedStudent) {
                this.searchStudent(lastPage)
            } else {
                this.findAllStudents(lastPage);
            }        }
    };

    nextPage = () => {
        let nextPage = this.state.currentPage + 1;
        if (this.state.currentPage < Math.ceil(this.state.totalElements / this.state.studentsPerPage)) {
            if(this.state.searchedStudent) {
                this.searchStudent(nextPage)
            } else {
                this.findAllStudents(nextPage);
            }          }
    };

    searchChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    cancelSearch = () => {
        this.setState({ "searchedStudent" : ''})
    };

    sortData = () => {
        this.setState(state => ({
            sortToggle: !state.sortToggle
        }));

        this.findAllStudents(this.state.currentPage);
    }

    searchStudent = (currentPage) => {
        currentPage -= 1;
        axios.get("http://localhost:8080/student-api/search/"+this.state.searchedStudent+"?page=" + currentPage + "&size=" + this.state.studentsPerPage)
            .then(response => response.data)
            .then((data) => {
                this.setState({
                    students: data.content,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                    currentPage: data.number + 1
                });
            });
    }



    render() {
        const { students, currentPage, totalPages, searchedStudent } = this.state;
     

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
                    <SuccessToast show={this.state.show} message="Student Deleted Successfully." type="danger" />
                </div>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <div style={{ "float": "left" }}>
                            <FontAwesomeIcon icon={faUsers} />     Students List
                        </div>

                        <div style={{ "float": "right" }}>
                            <InputGroup size="sm">
                                <FormControl style={searchBoxCss} className={"bg-dark"} name="searchedStudent" value={searchedStudent} placeholder = "Search"
                                    onChange={this.searchChange} />
                                <InputGroup.Append>
                                    <Button size="sm" variant="outline-info" type="button" onClick = {this.searchStudent}>
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
                                    <th>Last Name</th>
                                    <th>First Name</th>
                                    <th>ID Card</th>
                                    <th>Phone Nr</th>
                                    <th onClick={this.sortData}>Payment Status<div className={this.state.sortToggle ? "arrow arrow-down" : "arrow arrow-up"} /> </th>
                                    <th>Lesson Hrs</th>
                                    <th>Unpaid Lessons</th>
                                    <th>Money Owing [zl]</th>
                                    <th>Payment in Advance [zl]</th>
                                    <th>Actions</th>

                                </tr>
                            </thead>


                            <tbody>
                                {this.state.students.length === 0 ?
                                    <tr align="center">
                                        <td colSpan="10"> No Students in the Data Base</td>
                                    </tr> :

                                    this.state.students.map((student, index) => (
                                        <tr key={student.id}>
                                            <td>{student.lastName}</td>
                                            <td>{student.firstName}</td>
                                            <td>{student.idCardNr}</td>
                                            <td>{student.telNr}</td>
                                            <td>{student.paymentStatus}</td>
                                            <td>{student.lessonHours}</td>
                                            <td>{student.unpaidLessons}</td>
                                            <td>{student.moneyOwing}</td>
                                            <td>{student.moneyInAdvance}</td>
                                            <td>
                                                <ButtonGroup>
                                                    <Link to={"settleStudent/" + student.id}> <Button size="sm" variant="outline-success"> <FontAwesomeIcon icon={faWallet} /> </Button> </Link>
                                                    <Link to={"editStudent/" + student.id}> <Button size="sm" variant="outline-primary"> <FontAwesomeIcon icon={faEdit} /> </Button> </Link>
                                                    <Button size="sm" variant="outline-danger" onClick={this.deleteStudent.bind(this, student.id)}> <FontAwesomeIcon icon={faTrash} /> </Button>
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
                            <Link to={"add-student"} className="nav-link">
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

export default StudentList;