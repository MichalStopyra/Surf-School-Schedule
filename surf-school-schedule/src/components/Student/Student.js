import React from 'react';
import { Form, Card, Col, Button } from 'react-bootstrap';
import { faSave, faUndo, faArrowLeft, faEdit, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SuccessToast from '../SuccessToast';

class Student extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initialState;
        this.state.show = false;
        this.state.method = 'post';
        this.studentChange = this.studentChange.bind(this);
        this.submitStudent = this.submitStudent.bind(this);
    }

    initialState = {
        id: '', lastName: '', firstName: '', idCardNr: '', telNr: '', paymentStatus: 0, lessonHours: 0, unpaidLessons: 0, moneyOwing: 0, moneyInAdvance: ''
    }

    componentDidMount() {
        const idStudent = +this.props.match.params.id;
        if (idStudent) {
            this.findStudentById(idStudent);
        }
    };


    findStudentById = (idStudent) => {
        axios.get("http://localhost:8080/student-api/" + idStudent)
            .then(response => {
                if (response.data != null) {
                    this.setState({
                        id: response.data.id,
                        lastName: response.data.lastName,
                        firstName: response.data.firstName,
                        idCardNr: response.data.idCardNr,
                        telNr: response.data.telNr,
                        paymentStatus: response.data.paymentStatus,
                        lessonHours: response.data.lessonHours,
                        unpaidLessons: response.data.unpaidLessons,
                        moneyOwing: response.data.moneyOwing,
                        moneyInAdvance: response.data.moneyInAdvance
                    });
                    console.log(response.data.lastName);

                }
            }).catch((error) => {
                console.error("Error: " + error);
            });
    };

    returnToList = () => {
        return this.props.history.push("/students");
    };

    submitStudent = event => {
        event.preventDefault();

        const student = {
            lastName: this.state.lastName,
            firstName: this.state.firstName,
            idCardNr: this.state.idCardNr,
            telNr: this.state.telNr,
            paymentStatus: this.state.paymentStatus,
            lessonHours: this.state.lessonHours,
            unpaidLessons: this.state.unpaidLessons,
            moneyOwing: this.state.moneyOwing,
            moneyInAdvance: this.state.moneyInAdvance
        };

        axios.post("http://localhost:8080/student-api/list", student)
            .then(response => {
                if (response.data != null) {
                    this.setState({ "show": true, "method": "post" });
                    setTimeout(() => this.setState({ "show": false }), 3000);
                    setTimeout(() => this.returnToList(), 1000);
                } else {
                    this.setState({ "show": false });
                }
            });
        this.setState(this.initialState);

    };

    updateStudent = event => {
        event.preventDefault();

        const student = {
            id: this.state.id,
            lastName: this.state.lastName,
            firstName: this.state.firstName,
            idCardNr: this.state.idCardNr,
            telNr: this.state.telNr,
            paymentStatus: this.state.paymentStatus,
            lessonHours: this.state.lessonHours,
            unpaidLessons: this.state.unpaidLessons,
            moneyOwing: this.state.moneyOwing,
            moneyInAdvance: this.state.moneyInAdvance
        }; 
        axios.put("http://localhost:8080/student-api/"+this.state.id, student)
            .then(response => {
                if (response.data != null) {
                    this.setState({ "show": true, "method": "put" });
                    setTimeout(() => this.setState({ "show": false }), 3000);
                    setTimeout(() => this.returnToList(), 1000);
                } else {
                    this.setState({ "show": false });
                }
            });
        this.setState(this.initialState);
    }

    resetStudent = () => {
        this.setState(() => this.initialState);
    };

    studentChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {
        const { firstName, lastName, idCardNr, telNr, paymentStatus, lessonHours, unpaidLessons, moneyOwing, moneyInAdvance } = this.state;
        return (
            <div>
                <div style={{ "display": this.state.show ? "block" : "none" }}>
                    <SuccessToast show={this.state.show} message={this.state.method === "put" ? "Student Updated Successfully" : "Student Saved Successfully."} type="success" />
                </div>

                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <FontAwesomeIcon icon={this.state.id ? faEdit : faPlusSquare} /> {this.state.id ? "Update Student" : "Add New Student"}
                    </Card.Header>
                    <Form onReset={this.resetStudent} onSubmit={this.state.id ? this.updateStudent : this.submitStudent}>
                        <Card.Body>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridLastName">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control required
                                        autoComplete="off"
                                        type="test"
                                        name="lastName"
                                        value={lastName}
                                        onChange={this.studentChange}
                                        placeholder="Enter Last Name"
                                        className={"bg-dark text-white"} />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridFirstName">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control required
                                        autoComplete="off"
                                        type="test"
                                        name="firstName"
                                        value={firstName}
                                        onChange={this.studentChange}
                                        placeholder=" Enter First Name"
                                        className={"bg-dark text-white"} />
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>

                            <Form.Group as={Col} controlId="formGridIdCardNr">
                                    <Form.Label>ID Card Nr</Form.Label>
                                    <Form.Control required
                                        autoComplete="off"
                                        name="idCardNr"
                                        type="test"
                                        value={idCardNr}
                                        onChange={this.studentChange}
                                        placeholder="Enter ID Card Nr"
                                        className={"bg-dark text-white"} />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridPhoneNr">
                                    <Form.Label>Phone Nr</Form.Label>
                                    <Form.Control required
                                        autoComplete="off"
                                        name="telNr"
                                        type="test"
                                        value={telNr}
                                        onChange={this.studentChange}
                                        placeholder="Enter Phone Nr"
                                        className={"bg-dark text-white"} />
                                </Form.Group>
                            </Form.Row >

                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridMoneyInAdvance">
                                    <Form.Label>Payment In Advance</Form.Label>
                                    <Form.Control required
                                        autoComplete="off"
                                        name="moneyInAdvance"
                                        type="test"
                                        value={moneyInAdvance}
                                        onChange={this.studentChange}
                                        placeholder="$"
                                        className={"bg-dark text-white"} />
                                </Form.Group>
                            </Form.Row>
                        </Card.Body>

                        <Card.Footer>
                            <div>
                                <Button size="sm" variant="primary" type="submit">
                                    <FontAwesomeIcon icon={faSave} /> {this.state.id ? "Update" : "Submit"}
                                </Button>
                                {'      '}

                                <Button size="sm" variant="secondary" type="reset">
                                    <FontAwesomeIcon icon={faUndo} />  Reset
                    </Button>
                            </div>
                            {'      '}
                            <div>
                                <Button size="sm" variant="light" type="button" onClick={this.returnToList.bind()}>
                                    <FontAwesomeIcon icon={faArrowLeft} />  Return
                    </Button>
                            </div>
                        </Card.Footer>
                    </Form >


                </Card >
            </div>
        );
    }

}
export default Student;