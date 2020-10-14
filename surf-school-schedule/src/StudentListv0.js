import React from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Table, ButtonGroup, Button, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faWallet, faEdit, faTrash, faUserPlus, faStepBackward, faFastBackward, faStepForward, faFastForward } from '@fortawesome/free-solid-svg-icons';
import SuccessToast from '../SuccessToast';

class StudentList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            students: [],
            currentPage: 1,
            studentsPerPage: 5,
            searchedStudent: ''
        };
    }

    componentDidMount() {
        axios.get("http://localhost:8080/student-api/list")
            .then(response => response.data)
            .then(data => {
                this.setState({ students: data });
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
        this.setState({
            [event.target.name]: parseInt(event.target.value)
        });
        if (isNaN(this.state.currentPage)) {
            this.setState({ "currentpage": 1 });
        }
    };

    firstPage = () => {
        if (this.state.currentPage > 1) {
            this.setState({
                currentPage: 1
            });
        }
    };

    prevPage = () => {
        if (this.state.currentPage > 1) {
            this.setState({
                currentPage: this.state.currentPage - 1
            });
        }
    };

    lastPage = () => {
        // let studentsLength = this.props.studentData.students.length;
        let studentsLength = this.state.students.length;
        if (this.state.currentPage < Math.ceil(studentsLength / this.state.studentsPerPage)) {
            this.setState({
                currentPage: Math.ceil(studentsLength / this.state.studentsPerPage)
            });
        }
    };

    nextPage = () => {
        if (this.state.currentPage < Math.ceil(this.state.students.length / this.state.studentsPerPage)) {
            this.setState({
                currentPage: this.state.currentPage + 1
            });
        }
    };

    searchStudent = event => {
      //if (this.state.searchedStudent !== '') {
            this.setState({
                [event.target.name]: parseInt(event.target.value),
                //students: this.state.students.filter(student => (student.lastName.includes(this.state.searchedStudent) || student.firstName.includes(this.state.searchedStudent)))
            });
        //}
    }


    render() {
        const { currentPage, studentsPerPage, searchedStudent } = this.state;
        const lastIndex = currentPage * studentsPerPage;
        const firstIndex = lastIndex - studentsPerPage;

        const studentData = this.props.studentData;
        //const students = studentData.students;
        const currentStudents = this.state.students.slice(firstIndex, lastIndex);
        const totalPages = Math.ceil(this.state.students.length / studentsPerPage);

        const pageNumCss = {
            width: "45px",
            border: "1px solid #F8F8FF",
            color: "#F8F8FF",
            textAlign: "center",
            fontWeight: "bold"
        };

        const searchBoxCss = {
            width: "100px",
            border: "1px solid #F8F8FF",
            color: "#F8F8FF",
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
                                <FormControl style={searchBoxCss} className={"search-box bg-dark"} name="searchBox" value={searchedStudent}
                                    onChange={this.searchStudent} />
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
                                    <th>Payment Status</th>
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

                                    currentStudents.map((student, index) => (
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