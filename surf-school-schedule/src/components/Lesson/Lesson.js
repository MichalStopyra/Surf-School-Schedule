import React from 'react';
import { Form, Card, Col, Button } from 'react-bootstrap';
import { faSave, faUndo, faArrowLeft, faEdit, faPlusSquare, faLanguage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SuccessToast from '../SuccessToast';
import Instructor from '../Instructor/Instructor';

class Lesson extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initialState;
        this.state.show = false;
        this.state.showInvalidMessage = false;

        this.state.method = 'post';
        this.lessonChange = this.lessonChange.bind(this);
        this.submitLesson = this.submitLesson.bind(this);

    }

    initialState = {
        id: '', date: 'Select Date', time: 'Select Time', nrStudents: 'Select Nr of Students', status: 0, howLong: 'Select How Long',
        students: [], instructors: [], dates: [], times: [], nrStudTable: [], howLongTable: [],
        instructor: {
            id: '', lastName: 'Select Instructor', firstName: '', NrHoursWeek: 0, NrHoursFull: 0, WeekWage: 0
        },
        student: {
            id: '', lastName: 'Select Student', firstName: '', idCardNr: '', telNr: '', paymentStatus: 0, lessonHours: 0, unpaidLessons: 0, moneyOwing: 0, moneyInAdvance: ''
        }
    }

    componentDidMount() {
        const idLesson = +this.props.match.params.id;
        if (idLesson) {
            this.findLessonById(idLesson);
            this.state.students.push(this.state.student);
            this.state.instructors.push(this.state.instructor);
            this.state.dates.push(this.state.date);
            this.state.times.push(this.state.time);
            this.state.howLongTable.push(this.state.howLong);
            this.state.nrStudTable.push(this.state.nrStudents);
        }
        this.findAllStudents();
        this.findAllInstructors();
        this.setArrays();

        if (idLesson) {
            this.setState({
                students: [new Set (this.state.students)]
            });
        }
    };

    arrayWithHours() {
        var arr = [], i, j;
        for (i = 9; i < 21; i++) {
            arr.push(i + ":00");
        }
        return arr;
    };

    addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    getDateArray(start, end) {
        var arr = new Array();
        var dt = new Date(start);
        while (dt <= end) {
            arr.push((new Date(dt)).toLocaleDateString("en-US"));
            dt.setDate(dt.getDate() + 1);
        }
        return arr;
    }

    getNrStudArray() {
        var arr = new Array();
        for (var i = 1; i < 6; ++i) {
            arr.push(i);
        }
        return arr;
    }

    getHowLongArray() {
        var arr = new Array();
        for (var i = 1; i < 4; ++i) {
            arr.push(i);
        }
        return arr;
    }

    setArrays() {
        this.state.dates.push('Select Date');
        this.state.times.push('Select Hour');
        this.state.howLongTable.push('Select How Long');
        this.state.nrStudTable.push('Select Nr of Students');
        this.setState({
            dates: this.state.dates.concat(this.getDateArray(new Date(), this.addDays(new Date(), 7))),
            times: this.state.times.concat(this.arrayWithHours()),
            howLongTable: this.state.howLongTable.concat(this.getHowLongArray()),
            nrStudTable: this.state.nrStudTable.concat(this.getNrStudArray())
        });
    }

    findAllStudents = () => {
        axios.get("http://localhost:8080/student-api/list?page=0&size=999999999&sortBy=paymentStatus&sortDir=desc")
            .then(response => response.data)
            .then((data) => {
                if (!this.state.students.length)
                    this.state.students.push(this.state.student);
                this.setState({
                    students: this.state.students.concat(data.content)
                });
            });
    };



    findAllInstructors = () => {
        axios.get("http://localhost:8080/instructor-api/list?page=0&size=999999999&sortBy=paymentStatus&sortDir=desc")
            .then(response => response.data)
            .then((data) => {
                if (!this.state.instructors.length)
                    this.state.instructors.push(this.state.instructor);
                this.setState({
                    instructors: this.state.instructors.concat(data.content)
                });
            });

    };


    findLessonById = (idLesson) => {
        axios.get("http://localhost:8080/lesson-api/" + idLesson)
            .then(response => {
                if (response.data != null) {
                    this.setState({
                        id: response.data.id,
                        instructor: response.data.instructor,
                        student: response.data.student,
                        date: response.data.date,
                        time: response.data.time,
                        howLong: response.data.howLong,
                        nrStudents: response.data.nrStudents,
                        status: response.data.status,
                    });

                }
            }).catch((error) => {
                console.error("Error: " + error);
            });
    };

    returnToList = () => {
        return this.props.history.push("/lessons");
    };

    isValid = () => {
        if (this.state.student.lastName === 'Select Student' ||
            this.state.instructor.lastName === 'Select Instructor' ||
            this.state.date === 'Select Date' ||
            this.state.time === 'Select Hour' ||
            this.state.nrStudents === 'Select Nr of Students' ||
            this.state.howLong === 'Select How Long') {
            this.setState({ "showInvalidMessage": true, "method": "post" });
            setTimeout(() => this.setState({ "showInvalidMessage": false }), 3000);
            return false;
        }
        else
            return true;
    }

    submitLesson = event => {
        event.preventDefault();
        if (!this.isValid()) {
            return;
        }

        const lesson = {
            instructor: JSON.parse(this.state.instructor),
            student: JSON.parse(this.state.student),
            date: this.state.date,
            time: this.state.time,
            howLong: this.state.howLong,
            nrStudents: this.state.nrStudents,
            status: this.state.status
        };

        axios.post("http://localhost:8080/lesson-api/list", lesson)
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

    updateLesson = event => {
        event.preventDefault();
        if (!this.isValid()) {
            return;
        }
        const lesson = {
            id: this.state.id,
            instructor: this.state.instructor,
            student: this.state.student,
            date: this.state.date,
            time: this.state.time,
            howLong: this.state.howLong,
            nrStudents: this.state.nrStudents,
            status: this.state.status
        };
        axios.put("http://localhost:8080/lesson-api/" + this.state.id, lesson)
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

    resetLesson = () => {
        this.setState(() => this.initialState);
        this.findAllInstructors();
        this.findAllStudents();
        this.setArrays();
    };

    lessonChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {
        const { student, instructor, date, time, howLong, nrStudents } = this.state;
        return (
            <div>
                <div style={{ "display": this.state.show ? "block" : "none" }}>
                    <SuccessToast show={this.state.show} message={this.state.method === "put" ? "Lesson Updated Successfully" : "Lesson Saved Successfully."} type="success" />
                </div>
                <div style={{ "display": this.state.showInvalidMessage ? "block" : "none" }}>
                    <SuccessToast show={this.state.showInvalidMessage} message={"Fill out the required fields."} type="dangerNoSuccess" />
                </div>

                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <FontAwesomeIcon icon={this.state.id ? faEdit : faPlusSquare} /> {this.state.id ? "Update Lesson" : "Add New Lesson"}
                    </Card.Header>
                    <Form onReset={this.resetLesson} onSubmit={this.state.id ? this.updateLesson : this.submitLesson}>
                        <Card.Body>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridStudent">
                                    <Form.Label>Student</Form.Label>
                                    <Form.Control required as="select"
                                        name="student"
                                        value={student}
                                        onChange={this.lessonChange}
                                        className={"bg-dark text-white"} >
                                        {this.state.students.map(student =>
                                            <option key={student.id} value={JSON.stringify(student)}>
                                                {student.lastName + " " + student.firstName}
                                            </option>
                                        )}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridInstructor">
                                    <Form.Label>Instructor</Form.Label>
                                    <Form.Control required as="select"
                                        autoComplete="off"
                                        name="instructor"
                                        value={instructor}
                                        onChange={this.lessonChange}
                                        className={"bg-dark text-white"} >
                                        {this.state.instructors.map(instructor =>
                                            <option key={instructor.id} value={JSON.stringify(instructor)}>
                                                {instructor.lastName + " " + instructor.firstName}

                                            </option>
                                        )}
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridDate">
                                    <Form.Label>Date [mm/dd/yyyy]</Form.Label>
                                    <Form.Control required as="select"
                                        autoComplete="off"
                                        name="date"
                                        value={date}
                                        onChange={this.lessonChange}
                                        className={"bg-dark text-white"}
                                        placeholder="Select Date">
                                        {this.state.dates.map(date =>
                                            <option key={date} value={date}>
                                                {date}
                                            </option>
                                        )}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridTime">
                                    <Form.Label>Time</Form.Label>
                                    <Form.Control required as="select"
                                        autoComplete="off"
                                        name="time"
                                        value={time}
                                        onChange={this.lessonChange}
                                        className={"bg-dark text-white"} >
                                        {this.state.times.map(time =>
                                            <option key={time} value={time}>
                                                {time}
                                            </option>
                                        )}
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridHowLong">
                                    <Form.Label>How Long [h]</Form.Label>
                                    <Form.Control required as="select"
                                        autoComplete="off"
                                        name="howLong"
                                        value={howLong}
                                        onChange={this.lessonChange}
                                        className={"bg-dark text-white"}>
                                        {this.state.howLongTable.map(howLong =>
                                            <option key={howLong} value={howLong}>
                                                {howLong}
                                            </option>
                                        )}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridNrStudents">
                                    <Form.Label>Nr Of Students</Form.Label>
                                    <Form.Control required as="select"
                                        autoComplete="off"
                                        name="nrStudents"
                                        value={nrStudents}
                                        onChange={this.lessonChange}
                                        className={"bg-dark text-white"} >
                                        {this.state.nrStudTable.map(nrStudents =>
                                            <option key={nrStudents} value={nrStudents}>
                                                {nrStudents}
                                            </option>
                                        )}
                                    </Form.Control>
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
export default Lesson;