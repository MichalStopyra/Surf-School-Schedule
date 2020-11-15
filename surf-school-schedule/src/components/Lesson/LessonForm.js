import { faArrowLeft, faEdit, faPlusSquare, faSave, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React from 'react';
import { Button, Card, Col, Form, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { fetchAllInstructors, fetchAllStudents, fetchLesson, saveLesson, updateLesson } from '../../services/index';
import SuccessToast from '../SuccessToast';


class Lesson extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initialState;
        this.state.show = false;
        this.state.showInvalidMessage = false;
        this.state.showCantCreateLessonMessage = false;
        this.state.method = 'post';
        this.lessonChange = this.lessonChange.bind(this);
        this.submitLesson = this.submitLesson.bind(this);

    }

    initialState = {
        id: '', date: 'Select Date', time: 'Select Hour', nrStudents: 'Select Nr of Students', status: 0, howLong: 'Select How Long',
        students: [], instructors: [], dates: [], times: [], nrStudTable: [], howLongTable: [],
        instructor: {
            id: '', lastName: 'Select Instructor', firstName: '', NrHoursWeek: 0, NrHoursFull: 0, WeekWage: 0
        },
        student: {
            id: '', lastName: 'Select Student', firstName: '', idCardNr: '', telNr: '', paymentStatus: 0, lessonHours: 0, unpaidLessons: 0, moneyOwing: 0, moneyInAdvance: ''
        }
    }

    componentDidMount() {
        let selectStudent = {
            id: -1, lastName: 'Select Student', firstName: '', idCardNr: '', telNr: '', paymentStatus: 0, lessonHours: 0, unpaidLessons: 0, moneyOwing: 0, moneyInAdvance: ''
        };
        this.findAllStudents(selectStudent);
        this.setArrays();
    };


    arrayWithHours() {
        var arr = [], i;
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
        while (dt < end) {
            var dd = dt.getDate();
            var mm = dt.getMonth() + 1;
            var yyyy = dt.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            var fullDate = mm + '-' + dd + '-' + yyyy;
            arr.push(fullDate);
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
        if (this.state.id) {
            this.filterTimesArray();
        }
    }

    //leave only free hours - when instructor does not have other lessons
    //this doesn't check if student has other lessons
    filterTimesArray = () => {
        axios.get("http://localhost:8080/lesson-api/" + this.state.instructor.id + "/" + this.state.date)
            .then(response => {
                if (response.data != null) {
                    //save when the lessons start 
                    let timesTab = response.data.content;
                    timesTab = timesTab.map(t => t.time);

                    //save how long they take
                    let howLongTab = response.data.content;
                    howLongTab = howLongTab.map(h => h.howLong);

                    //if lesson is gonna e.g.  start at 12 and take 2h - delete not only 12 but also 1 pm 
                    for (let i = 0; i < howLongTab.length; ++i) {
                        if (howLongTab[i] > 1) {
                            var pieces = timesTab[i].split(':');

                            for (var j = 1; j < howLongTab[i]; ++j) {
                                ++pieces[0];
                                var tempHour = pieces[0] + ":00";
                                timesTab = timesTab.concat(tempHour)
                            }
                        }
                    }

                    this.state.times = [];
                    this.state.times.push('Select Hour');
                    this.state.times = this.state.times.concat(this.arrayWithHours());

                    this.setState({
                        times: this.state.times.filter(e => !timesTab.includes(e))
                    });


                }
            }).catch((error) => {
                console.error("Error: " + error);
            });

    }


    findAllStudents = (addedStudent) => {
        this.props.fetchAllStudents(1, 999999999, "asc", addedStudent);
    }



    findAllInstructors = (addSelect) => {
        this.props.fetchAllInstructors(1, 999999999, "asc", addSelect);

    };


    findLessonById = (idLesson) => {
        axios.get("http://localhost:8080/lesson-api/" + idLesson)
            .then(response => {
                if (response.data != null) {
                    this.props.student.students.unshift(response.data.student);
                    this.props.instructor.instructors.unshift(response.data.instructor);
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


    isValid = () => {
        if (this.state.student.lastName === 'Select Student' ||
            this.state.nrStudents === 'Select Nr of Students' ||
            this.state.howLong === 'Select How Long') {
            this.setState({ "showInvalidMessage": true, "method": "post" });
            setTimeout(() => this.setState({ "showInvalidMessage": false }), 3000);
            return false;
        }
        else
            return true;
    }

    submitLesson = () => {
        if (!this.isValid()) {
            return;
        }

        const lesson = {
            instructor: this.props.instructor,
            student: JSON.parse(this.state.student),
            date: this.props.date,
            time: this.props.lessonHour,
            howLong: this.state.howLong,
            nrStudents: this.state.nrStudents,
            status: this.state.status
        };

        this.props.saveLesson(lesson);
        setTimeout(() => {
            if (!this.props.lesson.error) {
                this.setState({
                    "show": true,
                    "method": "post"
                });
                setTimeout(() => this.setState({ "show": false }), 3000);
                this.resetForm();
                setTimeout(() => this.props.handleClose(null, this.props.instrIndex, this.props.lessonIndex, true, lesson), 1000);
            } else {
                this.setState({ "showCantCreateLessonMessage": true, "method": "post" });
                setTimeout(() => this.setState({ "showCantCreateLessonMessage": false }), 3000);
                this.props.lesson.error = '';
            }
        }, 1000);
    };


    updateLesson = () => {
        if (!this.isValid()) {
            return;
        }
        if (typeof (this.state.instructor) === "object")
            this.state.instructor = JSON.stringify(this.state.instructor);

        if (typeof (this.state.student) === "object")
            this.state.student = JSON.stringify(this.state.student);

        const lesson = {
            id: this.state.id,
            instructor: JSON.parse(this.state.instructor),
            student: JSON.parse(this.state.student),
            date: this.state.date,
            time: this.state.time,
            howLong: this.state.howLong,
            nrStudents: this.state.nrStudents,
            status: this.state.status
        };

        this.props.updateLesson(lesson);
        setTimeout(() => {

            if (!this.props.lesson.error) {
                this.setState({ "show": true, "method": "put" });
                setTimeout(() => this.setState({ "show": false }), 3000);
                this.resetForm();
                setTimeout(() => this.props.handleClose(null, this.props.instrIndex, this.props.lessonIndex, null, lesson, true), 1000);
            } else {
                this.setState({ "showCantCreateLessonMessage": true, "method": "put" });
                setTimeout(() => this.setState({ "showCantCreateLessonMessage": false }), 3000);
                this.props.lesson.error = '';
            }
        }, 2000);
    }

    resetForm = () => {
        let selectStudent = {
            id: -1, lastName: 'Select Student', firstName: '', idCardNr: '', telNr: '', paymentStatus: 0, lessonHours: 0, unpaidLessons: 0, moneyOwing: 0, moneyInAdvance: ''
        };
        this.findAllStudents(selectStudent);
        this.setState({
            "student": this.initialState.student,
            "howLong": this.initialState.howLong,
            "nrStudents": this.initialState.nrStudents
        });
    };

    lessonChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });

    };

    lessonChangeInstructor = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
        this.state.instructor = event.target.value;
        if (typeof (this.state.instructor) === "string")
            this.state.instructor = JSON.parse(this.state.instructor);

        this.filterTimesArray();

    }

    onShowHandle = () => {

        if (this.props.editedLesson) {
            this.setState({
                id: this.props.editedLesson.id,
                student: this.props.editedLesson.student,
                howLong: this.props.editedLesson.howLong,
                nrStudents: this.props.editedLesson.nrStudents,
                instructor: this.props.editedLesson.instructor,
                date: this.props.editedLesson.date,
                time: this.props.editedLesson.time,
                status: this.props.editedLesson.status,
            });
            this.findAllStudents(this.props.editedLesson.student);
            this.props.student.students[0] = this.props.editedLesson.student;

        }
    }

    resetAndCloseForm = () => {
        this.resetForm();
        this.props.handleClose(false);
    }

    render() {
        const { student, howLong, nrStudents } = this.state;
        const students = this.props.student.students;

        return (
            <>
                <Modal show={this.props.showForm}
                    onHide={() => this.resetAndCloseForm()}
                    onShow={() => this.onShowHandle()}
                >
                    <Modal.Header className={"border border-light bg-dark text-white"} closeButton>
                        <div style={{ "display": this.state.show ? "block" : "none" }}>
                            <SuccessToast show={this.state.show} message={this.state.method === "put" ? "Lesson Updated Successfully" : "Lesson Saved Successfully."} type="success" />
                        </div>
                        <div style={{ "display": this.state.showInvalidMessage ? "block" : "none" }}>
                            <SuccessToast show={this.state.showInvalidMessage} message={"Fill out the required fields."} type="dangerNoSuccess" />
                        </div>
                        <div style={{ "display": this.state.showCantCreateLessonMessage ? "block" : "none" }}>
                            <SuccessToast show={this.state.showCantCreateLessonMessage} message={"Can't create such lesson - conflict with other lesson"} type="dangerNoSuccess" />
                        </div>
                        <Modal.Title>
                            <FontAwesomeIcon icon={this.props.editedLesson ? faEdit : faPlusSquare} /> {this.props.editedLesson ? "Update Lesson" : "Add New Lesson"}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={"border border-light bg-dark text-white"}>
                        <Card className={"border border-dark bg-dark text-white"}>
                            <Form onReset={this.resetLesson} onSubmit={this.props.editedLesson ? this.updateLesson : this.submitLesson}>
                                <Card.Body>
                                    <h6>Instructor</h6>
                                    <h5>{this.props.instructor.firstName + " " + this.props.instructor.lastName}</h5>

                                    <h6>Date</h6>
                                    <h5>{this.props.date}</h5>

                                    <h6>Time</h6>
                                    <h5>{this.props.lessonHour}</h5>



                                    <Form.Group as={Col} controlId="formGridStudent">
                                        <Form.Label>Student</Form.Label>
                                        <Form.Control required as="select"
                                            name="student"
                                            value={student}
                                            onChange={this.lessonChange}
                                            className={"bg-dark text-white"} >
                                            {students.filter((item, index, self) =>
                                                index === self.findIndex((e) => (
                                                    e.id === item.id)
                                                ))
                                                .map(student =>
                                                    <option key={student.id} value={JSON.stringify(student)}>
                                                        {student.lastName + " " + student.firstName}
                                                    </option>
                                                )}
                                        </Form.Control>
                                    </Form.Group>



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


                            </Form >
                        </Card >
                    </Modal.Body>
                    <Modal.Footer className={"border border-light bg-light text-white"}>
                        <div>
                            <Button size="sm" variant="info" type="submit" onClick={this.props.editedLesson ? () => this.updateLesson() : () => this.submitLesson()}>
                                <FontAwesomeIcon icon={faSave} /> {this.props.editedLesson ? "Update" : "Submit"}
                            </Button>
                            {'      '}
                            {!this.props.editedLesson ?
                                <Button size="sm" variant="secondary" type="reset" onClick={() => this.resetForm()}>
                                    <FontAwesomeIcon icon={faUndo} />  Reset
                    </Button> : " "
                            }
                        </div>
                        {'      '}
                        <div>
                            <Button size="sm" variant="border border-dark bg-light" type="button" onClick={() => this.resetAndCloseForm()}>
                                <FontAwesomeIcon icon={faArrowLeft} />  Return
                    </Button>
                        </div>

                    </Modal.Footer>
                </Modal>
            </>
        );
    }

}
const mapStateToProps = state => {
    return {
        lesson: state.lesson,
        student: state.student
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllStudents: (currentPage, size, sortDir, addedStudent) => dispatch(fetchAllStudents(currentPage, size, sortDir, addedStudent)),
        fetchAllInstructors: (currentPage, size, sortDir, addSelect) => dispatch(fetchAllInstructors(currentPage, size, sortDir, addSelect)),
        saveLesson: (lesson) => dispatch(saveLesson(lesson)),
        fetchLesson: (lessonId) => dispatch(fetchLesson(lessonId)),
        updateLesson: (lesson) => dispatch(updateLesson(lesson))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Lesson);