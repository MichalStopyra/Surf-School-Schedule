import { faArrowLeft, faEdit, faPlusSquare, faSave, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React from 'react';
import { Button, Card, Col, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { fetchAllInstructors, fetchAllStudents, fetchLesson, saveLesson, updateLesson } from '../../services/index';
import SuccessToast from '../SuccessToast';


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
        const idLesson = +this.props.match.params.id;


        this.findAllStudents(!idLesson);
        this.findAllInstructors(!idLesson);

        if (idLesson) {
            this.findLessonById(idLesson);
        }

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
            dates: this.state.dates.concat(this.getDateArray(new Date(), this.addDays(new Date(), 14))),
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
        axios.get("https://surf-school-schedule.herokuapp.com/lesson-api/" + this.state.instructor.id + "/" + this.state.date)
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


    findAllStudents = (addSelect) => {
        if (addSelect) {
            let selectStudent = {
                id: -1, lastName: 'Select Student', firstName: '', idCardNr: '', telNr: '', paymentStatus: 0, lessonHours: 0, unpaidLessons: 0, moneyOwing: 0, moneyInAdvance: ''
            };
            this.props.fetchAllStudents(1, 999999999, "asc", selectStudent);
        }
        else
            this.props.fetchAllStudents(1, 999999999, "asc", null);
    }



    findAllInstructors = (addSelect) => {
        this.props.fetchAllInstructors(1, 999999999, "asc", addSelect);

    };


    findLessonById = (idLesson) => {
        axios.get("https://surf-school-schedule.herokuapp.com/lesson-api/" + idLesson)
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

    returnToList = () => {
        return this.props.history.push("/schedule");
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
        this.props.saveLesson(lesson);
        setTimeout(() => {
            if (!this.props.lesson.error) {
                this.setState({ "show": true, "method": "post" });
                setTimeout(() => this.setState({ "show": false }), 3000);
                setTimeout(() => this.returnToList(), 1000);
            } else {
                this.setState({ "showInvalidMessage": true, "method": "post" });
                setTimeout(() => this.setState({ "showInvalidMessage": false }), 3000);
            }
        }, 1000);
    };


    updateLesson = event => {
        event.preventDefault();
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

            if (!this.props.student.error) {
                this.setState({ "show": true, "method": "put" });
                setTimeout(() => this.setState({ "show": false }), 3000);
                setTimeout(() => this.returnToList(), 1000);
            } else {
                this.setState({ "showInvalidMessage": true, "method": "post" });
                setTimeout(() => this.setState({ "showInvalidMessage": false }), 3000);
            }
        }, 2000);
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

    lessonChangeInstructor = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
        this.state.instructor = event.target.value;
        if (typeof (this.state.instructor) === "string")
            this.state.instructor = JSON.parse(this.state.instructor);

        this.filterTimesArray();

    }

    render() {
        const { student, instructor, date, time, howLong, nrStudents } = this.state;
        const instructors = this.props.instructor.instructors;
        const students = this.props.student.students;

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

                                <Form.Group as={Col} controlId="formGridInstructor">
                                    <Form.Label>Instructor</Form.Label>
                                    <Form.Control required as="select"
                                        autoComplete="off"
                                        name="instructor"
                                        value={instructor}
                                        onChange={this.lessonChangeInstructor}
                                        className={"bg-dark text-white"} >
                                        {instructors.filter((item, index, self) =>
                                            index === self.findIndex((e) => (
                                                e.id === item.id)
                                            ))
                                            .map(instructor =>
                                                <option key={instructor.id} value={JSON.stringify(instructor)}>
                                                    {instructor.lastName + " " + instructor.firstName}

                                                </option>
                                            )}
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridDate">
                                    <Form.Label>Date [dd-mm-yyyy]</Form.Label>
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
const mapStateToProps = state => {
    return {
        lesson: state.lesson,
        instructor: state.instructor,
        student: state.student
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllStudents: (currentPage, size, sortDir, addSelect) => dispatch(fetchAllStudents(currentPage, size, sortDir, addSelect)),
        fetchAllInstructors: (currentPage, size, sortDir, addSelect) => dispatch(fetchAllInstructors(currentPage, size, sortDir, addSelect)),
        saveLesson: (lesson) => dispatch(saveLesson(lesson)),
        fetchLesson: (lessonId) => dispatch(fetchLesson(lessonId)),
        updateLesson: (lesson) => dispatch(updateLesson(lesson))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Lesson);