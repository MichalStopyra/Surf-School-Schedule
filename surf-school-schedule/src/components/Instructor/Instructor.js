import React from 'react';
import { Form, Card, Col, Button } from 'react-bootstrap';
import { faSave, faUndo, faArrowLeft, faEdit, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SuccessToast from '../SuccessToast';

class Instructor extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initialState;
        this.state.show = false;
        this.state.method = 'post';
        this.instructorChange = this.instructorChange.bind(this);
        this.submitInstructor = this.submitInstructor.bind(this);
    }

    initialState = {
        id: '', lastName: '', firstName: '', NrHoursWeek: 0, NrHoursFull: 0, WeekWage: 0
    }

    componentDidMount() {
        const idInstructor = +this.props.match.params.id;
        if (idInstructor) {
            this.findInstructorById(idInstructor);
        }
    };


    findInstructorById = (idInstructor) => {
        axios.get("http://localhost:8080/instructor-api/" + idInstructor)
            .then(response => {
                if (response.data != null) {
                    this.setState({
                        id: response.data.id,
                        lastName: response.data.lastName,
                        firstName: response.data.firstName,
                        NrHoursWeek: response.data.NrHoursWeek,
                        NrHoursFull: response.data.NrHoursFull,
                        WeekWage: response.data.WeekWage,
                    });
                    console.log(response.data.lastName);

                }
            }).catch((error) => {
                console.error("Error: " + error);
            });
    };

    returnToList = () => {
        return this.props.history.push("/instructors");
    };

    submitInstructor = event => {
        event.preventDefault();

        const instructor = {
            lastName: this.state.lastName,
            firstName: this.state.firstName,
            NrHoursWeek: this.state.NrHoursWeek,
            NrHoursFull: this.state.NrHoursFull,
            WeekWage: this.state.WeekWage,
        };

        console.log(instructor);
        axios.post("http://localhost:8080/instructor-api/list", instructor)
            .then(response => {
                if (response.data != null) {
                    this.setState({ "show": true, "method": "post" });
                    setTimeout(() => this.setState({ "show": false }), 3000);
                    setTimeout(() => this.returnToList(), 1000);
                } else {
                    this.setState({ "show": false });
                }
            });

    };

    updateInstructor = event => {
        event.preventDefault();

        const instructor = {
            id: this.state.id,
            lastName: this.state.lastName,
            firstName: this.state.firstName,
            NrHoursWeek: this.state.NrHoursWeek,
            NrHoursFull: this.state.NrHoursFull,
            WeekWage: this.state.WeekWage,
        }; 
        axios.put("http://localhost:8080/instructor-api/"+this.state.id, instructor)
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

    resetInstructor = () => {
        this.setState(() => this.initialState);
    };

    instructorChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {
        const { firstName, lastName} = this.state;
        return (
            <div>
                <div style={{ "display": this.state.show ? "block" : "none" }}>
                    <SuccessToast show={this.state.show} message={this.state.method === "put" ? "Instructor Updated Successfully" : "Instructor Saved Successfully."} type="success" />
                </div>

                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <FontAwesomeIcon icon={this.state.id ? faEdit : faPlusSquare} /> {this.state.id ? "Update Instructor" : "Add New Instructor"}
                    </Card.Header>
                    <Form onReset={this.resetInstructor} onSubmit={this.state.id ? this.updateInstructor : this.submitInstructor}>
                        <Card.Body>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridLastName">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control required
                                        autoComplete="off"
                                        type="test"
                                        name="lastName"
                                        value={lastName}
                                        onChange={this.instructorChange}
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
                                        onChange={this.instructorChange}
                                        placeholder=" Enter First Name"
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
export default Instructor;