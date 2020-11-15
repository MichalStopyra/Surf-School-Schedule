import React from 'react';
import { Form, Card, Col, Button } from 'react-bootstrap';
import { faSave, faUndo, faArrowLeft, faEdit, faPlusSquare, faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SuccessToast from '../SuccessToast';


import { connect } from 'react-redux';
import { saveInstructor, fetchInstructor, updateInstructor } from '../../services/index';

class Instructor extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initialState;
        this.state.show = false;
        this.state.showInvalidMessage = false;
        this.state.method = 'post';
        this.instructorChange = this.instructorChange.bind(this);
        this.submitInstructor = this.submitInstructor.bind(this);
    }

    initialState = {
        id: '', lastName: '', firstName: '', NrHoursWeek: 0, NrHoursFull: 0, WeekWage: 0, hourWage: ''
    }

    componentDidMount() {
        const idInstructor = +this.props.match.params.id;
        if (idInstructor) {
            this.findInstructorById(idInstructor);
        }
    };


    findInstructorById = (idInstructor) => {

        this.props.fetchInstructor(idInstructor);
        setTimeout(() => {

            let instructor = this.props.instructor.instructor;
            if (instructor != null) {
                this.setState({
                    id: instructor.id,
                    lastName: instructor.lastName,
                    firstName: instructor.firstName,
                    NrHoursWeek: instructor.NrHoursWeek,
                    NrHoursFull: instructor.NrHoursFull,
                    WeekWage: instructor.WeekWage,
                    hourWage: instructor.hourWage
                });
            }
        }, 1000);
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
            hourWage: this.state.hourWage
        };

        this.props.saveInstructor(instructor);
        setTimeout(() => {
            if (this.props.instructor) {
                this.setState({ "show": true, "method": "post" });
                setTimeout(() => this.setState({ "show": false }), 3000);
                setTimeout(() => this.returnToList(), 1000);
            } else {
                this.setState({ "showInvalidMessage": true, "method": "post" });
                setTimeout(() => this.setState({ "showInvalidMessage": false }), 3000);
            }
        }, 1000);
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
            hourWage: this.state.hourWage
        };

        this.props.updateInstructor(instructor);
        setTimeout(() => {

            if (!this.props.instructor.error) {
                this.setState({ "show": true, "method": "put" });
                setTimeout(() => this.setState({ "show": false }), 3000);
                setTimeout(() => this.returnToList(), 1000);
            } else {
                this.setState({ "showInvalidMessage": true, "method": "post" });
                setTimeout(() => this.setState({ "showInvalidMessage": false }), 3000);
            }
        }, 2000);
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
        const { firstName, lastName, hourWage } = this.state;
        const idInstructor = +this.props.match.params.id;
        return (
            <div>
                <div style={{ "display": this.state.show ? "block" : "none" }}>
                    <SuccessToast show={this.state.show} message={this.state.method === "put" ? "Instructor Updated Successfully" : "Instructor Saved Successfully."} type="success" />
                </div>
                <div style={{ "display": this.state.showInvalidMessage ? "block" : "none" }}>
                    <SuccessToast show={this.state.showInvalidMessage} message={"Invalid Data - might be in the data base already"} type="dangerNoSuccess" />
                </div>

                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <FontAwesomeIcon icon={idInstructor ? faEdit : faPlusSquare} /> {idInstructor ? "Update Instructor" : "Add New Instructor"}
                    </Card.Header>
                    <Form onReset={this.resetInstructor} onSubmit={idInstructor ? this.updateInstructor : this.submitInstructor}>
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

                            <Form.Group as={Col} controlId="formGridHourWage">
                                    <Form.Label>Hour's Wage</Form.Label>
                                    <Form.Control required
                                        autoComplete="off"
                                        type="test"
                                        name="hourWage"
                                        value={hourWage}
                                        onChange={this.instructorChange}
                                        placeholder=" Enter Week's Wage"
                                        className={"bg-dark text-white"} />
                            </Form.Group>

                        </Card.Body>

                        <Card.Footer>
                            <div>
                                <Button size="sm" variant="primary" type="submit">
                                    <FontAwesomeIcon icon={faSave} /> {idInstructor ? "Update" : "Submit"}
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

const mapStateToProps = state => {
    return {
        instructor: state.instructor
    };
};

const mapDispatchToProps = dispatch => {
    return {
        saveInstructor: (instructor) => dispatch(saveInstructor(instructor)),
        fetchInstructor: (instructorId) => dispatch(fetchInstructor(instructorId)),
        updateInstructor: (instructor) => dispatch(updateInstructor(instructor))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Instructor);
