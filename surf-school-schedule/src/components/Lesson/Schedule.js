import React from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';

import { Card, Table, ButtonGroup, Button, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTimes , faArrowLeft, faArrowRight, faCalendarPlus} from '@fortawesome/free-solid-svg-icons';
import SuccessToast from '../SuccessToast';
import Popover from '../Popover';
import InstructorDay from './InstructorDay';
import LessonForm from './LessonForm';

import './../../style/Style.css';

import { connect } from 'react-redux';
import { updateLesson, deleteLesson } from '../../services/index';



class Schedule extends React.Component {

    constructor(props) {
        super(props);
        let today = new Date();
        this.state = {
            date: today.getMonth() + 1 + '-' + today.getDate() + '-' + today.getFullYear(),
            dayName: today.toLocaleString('en-us', {weekday: 'long'}),
            instructor: 'khjghgxchgvjh',
            lessonHour: '',
            instructors: [],
            lessons: [],
            instructorDay: [],
            currentPage: 1,
            lessonsPerPage: 5,
            searchedLesson: '',
            sortToggle: false,
            showForm: false,
            lessonIndex: '',
            instrIndex: '',
            editedLesson: ''
        };
        // this.getFieldColor = this.getFieldColor.bind(this);

    }

    componentDidMount() {
        this.findAllInstructorsAndSchedules(this.state.date);
    }


    findAllInstructorsAndSchedules(date) {
        var instructors = [];

        axios.get("http://localhost:8080/instructor-api/list?page=0&size=999999999&sortBy=firstName&sortDir=desc")
            .then(response => response.data)
            .then((data) => {
                instructors = data.content;
                this.findAllInstructorDay(instructors, date);
            });

    }

    findAllInstructorDay(instructors, date) {
        let allInstrDayTable = [];
        let tabLength = instructors.length;
        for (let i = 0; i < tabLength; ++i) {
            let instructor = instructors[i]
            axios.get("http://localhost:8080/lesson-api/" + instructor.id + "/" + date)
                .then(response => {
                    if (response.data != null) {
                        let tempInstrDay = {
                            instructor: '',
                            lessonsThisDay: []
                        };

                        tempInstrDay.instructor = instructor;
                        //save when the lessons start 
                        let tab = response.data.content;
                        //save lessons at specific indexes in array - representing gour of the lesson

                        tab.forEach(function (element) {
                            //get hour and create index
                            let time = element.time;
                            time = time.split(":")[0];
                            //first lesson starts at 9 so minus 9 to get index in the array
                            let index = time - 9;

                            //if lesson is 1 hour long -add it to array once; if longer than 1 hour - duplicate it in array
                            for (let j = 0; j < element.howLong; ++j) {
                                tempInstrDay.lessonsThisDay[index + j] = element;
                            }
                        });
                        allInstrDayTable[i] = tempInstrDay;
                    }
                })
        }
        this.setState({
            instructorDay: allInstrDayTable
        });
        setTimeout(() => this.forceUpdate(), 500);
    }

    //change status of lessons that have their date in the past and were not given into not given
    checkIfLessonInThePast() {
        let today = new Date();

        for (let i = 0; i < this.state.lessons.length; ++i) {
            let temp = new Date(this.state.lessons[i].date);
            if (this.state.lessons[i].status === "To_Give" && temp < today) {
                console.log("asd");
                this.lessonStatusChange(this.state.lessons[i], 3)
            }
        }
    };


    changePage = event => {
        let target = parseInt(event.target.value);
        if (this.state.searchedLesson) {
            this.searchLesson(target)
        } else {
            this.findAllLessons(target);
        }
        this.setState({
            [event.target.name]: target
        });

    };

    prevPage = () => {
        let prevPage = this.state.currentPage - 1;
        if (this.state.currentPage > 1) {
            if (this.state.searchedLesson) {
                this.searchLesson(prevPage)
            } else {
                this.findAllLessons(prevPage);
            }
        }
    };

    nextPage = () => {
        let nextPage = this.state.currentPage + 1;
        if (this.state.currentPage < Math.ceil(this.state.totalElements / this.state.lessonsPerPage)) {
            if (this.state.searchedLesson) {
                this.searchLesson(nextPage)
            } else {
                this.findAllLessons(nextPage);
            }
        }
    };

    lessonStatusChange = (lesson, newStatus) => {
        if (!lesson)
            return;
        lesson.status = newStatus;

        this.props.updateLesson(lesson);
    };

    deleteLesson = (lesson, index) => {
        if (!lesson)
            return;
        let i = this.state.instructorDay[index].lessonsThisDay.indexOf(lesson);
        console.log(this.props);
        this.props.deleteLesson(lesson.id);

        console.log(this.props);

        let tempTab = this.state.instructorDay;
        for (let j = 0; j < lesson.howLong; ++j)
            tempTab[index].lessonsThisDay[i + j] = null;
        this.setState({
            instructorDay: tempTab
        });

    };


    //if close form => change showForm to hide it and update lesson list
    //if open form => get instructor and hour to pre-fill the form
    changeShowForm = (instructor, instrIndex, lessonIndex, newLessonWasAdded, lesson, isUpdated) => {
        if (this.state.showForm) {
            this.setState({
                "showForm": !this.state.showForm,
                editedLesson: null

            });
            //if time of the lesson was changed - update schedule fields
            if (isUpdated) {
                let tempTab = this.state.instructorDay;
                for (let j = 0; j < 3; ++j) {
                    if (lesson.howLong > j)
                        tempTab[instrIndex].lessonsThisDay[lessonIndex + j] = lesson;
                    else
                        tempTab[instrIndex].lessonsThisDay[lessonIndex + j] = null;
                }
                this.setState({
                    instructorDay: tempTab
                });

                //this.findAllInstructorsAndSchedules(this.state.date);
                return;
            }
            if (newLessonWasAdded) {
                //added lesson doesn't have id so i need to get it from data base
                axios.get("http://localhost:8080/lesson-api/" + lesson.instructor.id + "/" + lesson.date + "?page=0&size=1&sortBy=id&sortDir=desc")
                    .then(response => {
                        lesson.id = response.data.content[0].id;
                    })
                    .catch(error => {
                        console.error("error: " + error)
                    });

                let tempTab = this.state.instructorDay;
                for (let j = 0; j < lesson.howLong; ++j)
                    tempTab[instrIndex].lessonsThisDay[lessonIndex + j] = lesson;
                this.setState({
                    instructorDay: tempTab
                });
                //this.findAllInstructorsAndSchedules(this.state.date);
            }
            return;
        }
        else {
            this.setState({
                "showForm": !this.state.showForm,
                "instructor": instructor,
                "lessonHour": lessonIndex + 9 + ":00",
                "lessonIndex": lessonIndex,
                "instrIndex": instrIndex
            });
        }
    }


    editLesson = (editedLesson, instrIndex, lessonIndex) => {
        this.setState({
            "editedLesson": editedLesson,
            "showForm": true,
            "instructor": editedLesson.instructor,
            "lessonHour": editedLesson.time,
            "lessonIndex": lessonIndex,
            "instrIndex": instrIndex
        });


    }

    changeDate = (addedDays) => { 
        let targetDay = new Date(this.state.date);
        targetDay.setDate(targetDay.getDate() + addedDays);

        this.setState({
            date: targetDay.getMonth() + 1 + '-' + targetDay.getDate() + '-' + targetDay.getFullYear(),
            dayName: targetDay.toLocaleString('en-us', {weekday: 'long'})
        });
        setTimeout(() =>         this.findAllInstructorsAndSchedules(this.state.date)
        , 10);

    }

    render() {
        const { instructorDay, instructors } = this.state;
        return (
            <div>
                <LessonForm instructor={this.state.instructor} lessonHour={this.state.lessonHour} date={this.state.date}
                    instrIndex={this.state.instrIndex} lessonIndex={this.state.lessonIndex}
                    editedLesson={this.state.editedLesson}
                    showForm={this.state.showForm} handleClose={(instructor, instrIndex, lessonIndex, refresh, lesson, isUdpated) =>
                        this.changeShowForm(instructor, instrIndex, lessonIndex, refresh, lesson, isUdpated)} ></LessonForm>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <div id="container" style={{"clear":"both", "display": "flex", "justifyContent":"space-between"}}>
                        <div style={{ "textAlign": "center"}} >
                        <Button variant="outline-light" onClick={(addedDays)=>this.changeDate(-1)} > <FontAwesomeIcon icon={faArrowLeft} /> </Button>{'  '}
                            <FontAwesomeIcon icon={faCalendarAlt} />   {this.state.dayName} {this.state.date}{' '}
                            <Button variant="outline-light" onClick={(addedDays)=>this.changeDate(1)}  > <FontAwesomeIcon icon={faArrowRight} /> </Button>
                        </div>
                        <div style={{ "textAlign": "right"}}>
                        <Link to={"add-lesson"} className="nav-link">
                                <ButtonGroup>
                                    <Button size="lg" variant="outline-light"> <FontAwesomeIcon icon={faCalendarPlus} /> </Button>
                                </ButtonGroup>
                            </Link>
                        </div>
                        </div>

                    </Card.Header>
                    <Card.Body>
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th>Instructor</th>
                                    <th>9:00</th>
                                    <th>10:00</th>
                                    <th>11:00</th>
                                    <th>12:00</th>
                                    <th>13:00</th>
                                    <th>14:00</th>
                                    <th>15:00</th>
                                    <th>16:00</th>
                                    <th>17:00</th>
                                    <th>18:00</th>
                                    <th>19:00</th>
                                    <th>20:00</th>

                                </tr>
                            </thead>

                            <tbody>

                                <InstructorDay instructorDay={instructorDay}
                                    lessonStatusChange={(lesson, newStatus) => this.lessonStatusChange(lesson, newStatus)}
                                    deleteLesson={(lesson, index) => this.deleteLesson(lesson, index)}
                                    changeShowForm={(instructor, instrIndex, lessonIndex, refresh, lesson, updated) => this.changeShowForm(instructor, instrIndex, lessonIndex, refresh, lesson, updated)}
                                    editLesson={(editedLesson, instrIndex, lessonIndex) => this.editLesson(editedLesson, instrIndex, lessonIndex)} />
                            </tbody>


                        </Table>
                    </Card.Body>
                    <Card.Footer>



                    </Card.Footer>
                </Card>
            </div>

        );
    }


}

const mapStateToProps = state => {
    return {
        //savedStudentObject: state.student,
        //      studentObject: state.student,
        //  updatedStudent: state.student.student
        lesson: state.lesson,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateLesson: (lesson) => dispatch(updateLesson(lesson)),
        deleteLesson: (lesson) => dispatch(deleteLesson(lesson))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);