import React from 'react';

import { Link } from 'react-router-dom';
import { Alert, Card, Table, ButtonGroup, Button, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faWallet, faEdit, faTrash, faUserPlus, faStepBackward, faFastBackward, faStepForward, faFastForward, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import SuccessToast from '../SuccessToast';

import './../../style/Style.css';


import { connect } from 'react-redux';
import { deleteStudent, fetchAllStudents, searchStudents } from './../../services/index';

class StudentList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            students: [],
            currentPage: 1,
            studentsPerPage: 5,
            searchedStudent: '',
            sortToggle: true
        };
    }


    componentDidMount() {
        this.props.fetchAllStudents(this.props.student.currentPage, this.state.studentsPerPage, this.props.student.sortDirection);
    }

    deleteStudent = (idStudent) => {

        this.props.deleteStudent(idStudent);

        setTimeout(() => {
            if (this.props.student != null) {
                this.setState({ "show": true });
                setTimeout(() => this.setState({ "show": false }), 1000);

            } else {
                this.setState({ "show": false });
            }
        }, 1000);
        this.props.fetchAllStudents(this.props.student.currentPage, this.state.studentsPerPage, this.props.student.sortDirection);

    };

    changePage = event => {
        let target = parseInt(event.target.value);
        if (this.props.student.searchedStudent) {
            this.searchStudent(target)
        } else {
            let sortDirection = this.state.sortToggle ? "asc" : "desc";
            this.props.fetchAllStudents(target, this.state.studentsPerPage, this.props.student.sortDirection);
        }
        this.setState({
            [event.target.name]: target
        });

    };

    firstPage = () => {
        let firstPage = 1;

        if (this.props.student.currentPage > firstPage) {
            this.props.student.currentPage = 1;
            if (this.props.student.searchedStudent) {
                this.searchStudent(this.props.student.currentPage)
            } else {
                let sortDirection = this.state.sortToggle ? "asc" : "desc";
                this.props.fetchAllStudents(this.props.student.currentPage, this.state.studentsPerPage, this.props.student.sortDirection);
            }
        }
    };

    prevPage = () => {
        if (this.props.student.currentPage > 1) {
            --this.props.student.currentPage;
            if (this.props.student.searchedStudent) {
                this.searchStudent(this.props.student.currentPage)
            } else {
                let sortDirection = this.state.sortToggle ? "asc" : "desc";
                this.props.fetchAllStudents(this.props.student.currentPage, this.state.studentsPerPage, this.props.student.sortDirection);
            }
        }
    };

    lastPage = () => {
        let studentsLength = this.state.students.length;
        let lastPage = Math.ceil(this.props.totalElements / this.state.studentsPerPage);
        if (this.props.student.currentPage < lastPage) {
            this.props.student.currentPage = lastPage;
            if (this.props.student.searchedStudent) {
                this.searchStudent(this.props.student.currentPage)
            } else {
                this.props.fetchAllStudents(this.props.student.currentPage, this.state.studentsPerPage, this.props.student.sortDirection);
            }
        }
    };

    nextPage = () => {
        if (this.state.currentPage < Math.ceil(this.props.totalElements / this.state.studentsPerPage)) {
            ++this.props.student.currentPage;

            if (this.props.student.searchedStudent) {
                this.searchStudent(this.props.student.currentPage)
            } else {
                let sortDirection = this.state.sortToggle ? "asc" : "desc";
                this.props.fetchAllStudents(this.props.student.currentPage, this.state.studentsPerPage, this.props.student.sortDirection);
            }
        }
    };

    searchChange = event => {
        this.props.student.searchedStudent = event.target.value;
        this.forceUpdate();
    };

    cancelSearch = () => {
        this.props.student.searchedStudent = '';
        this.props.fetchAllStudents(this.props.student.currentPage, this.state.studentsPerPage, this.props.student.sortDirection);
        this.forceUpdate();
    };

    sortData = () => {
       // console.log(this.props.student.sortDirection);
        if (this.props.student.sortDirection === "asc")
            this.props.student.sortDirection = "desc";
        else
            this.props.student.sortDirection = "asc";
         //   console.log(this.props.student.sortDirection);

        this.props.fetchAllStudents(this.props.student.currentPage, this.state.studentsPerPage, this.props.student.sortDirection);

    }

    searchStudent = (currentPage) => {
        if (this.props.student.searchedStudent)
            this.props.searchStudents(this.props.student.searchedStudent, this.props.student.currentPage, this.props.student.studentsPerPage);
    }

    render() {
        const searchedStudent = this.props.student.searchedStudent;
        const totalPages = this.props.student.totalPages;
        const totalElements = this.props.student.totalElements;
        const student = this.props.student;
        const students = this.props.students;
        const currentPage = this.props.student.currentPage;
        const sortDirection = this.props.student.sortDirection;

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
                                    <th onClick={this.sortData}>Payment Status<div className={sortDirection === "asc" ? "arrow arrow-down" : "arrow arrow-up"} /> </th>
                                    <th>Lesson Hrs</th>
                                    <th>Unpaid Lessons</th>
                                    <th>Money Owing [zl]</th>
                                    <th>Payment in Advance [zl]</th>
                                    <th>Actions</th>

                                </tr>
                            </thead>


                            <tbody>
                                {students.length === 0 ?
                                    <tr align="center">
                                        <td colSpan="10"> No Students in the Data Base</td>
                                    </tr> :

                                    students.map((student, index) => (
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

const mapStateToProps = state => {
    return {
        student: state.student,
        students: state.student.students,
        totalPages: state.student.totalPages,
        totalElements: state.student.totalElements,
        currentPage: state.student.currentPage,
        searchedStudent: state.student.searchedStudent,
        sortDirection: state.student.sortDirection
    }
};


const mapDispatchToProps = dispatch => {
    return {
        fetchAllStudents: (currentPage, size, sortDir) => dispatch(fetchAllStudents(currentPage, size, sortDir)),
        deleteStudent: (studentId) => dispatch(deleteStudent(studentId)),
        searchStudents: (searchedStudent, currentPage, sizePage) => dispatch(searchStudents(searchedStudent, currentPage, sizePage))
    }

};


export default connect(mapStateToProps, mapDispatchToProps)(StudentList);