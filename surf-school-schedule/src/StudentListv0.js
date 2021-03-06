import React from 'react';

import axios from 'axios';
import { Card, Table, ButtonGroup, Button, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
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
            instructors: [],
            lessons: [],
            instructorDay: [],
            currentPage: 1,
            lessonsPerPage: 5,
            searchedLesson: '',
            sortToggle: false,
            showForm: true
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
        instructors.forEach(function (instructor) {
            axios.get("http://localhost:8080/lesson-api/" + instructor.id + "/" + date)
                .then(response => {
                    if (response.data != null) {

                        let tempInstrDay = {
                            instructor: '',
                            lessonsThisDay: []
                        };

                        tempInstrDay.instructor = instructor.firstName + " " + instructor.lastName;
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
                        allInstrDayTable.push(tempInstrDay);
                    }
                })
        });
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

        console.log(lesson);
        this.props.updateLesson(lesson);
    };

    deleteLesson = (lesson) => {
        if (!lesson)
        return;
        console.log(lesson);
        this.props.deleteLesson(lesson.id);
        this.findAllInstructorsAndSchedules(this.state.date);

        // setTimeout(() => {
        //     if (this.props.lesson != null) {
        //         this.setState({ "show": true });
        //         setTimeout(() => this.setState({ "show": false }), 1000);

        //     } else {
        //         this.setState({ "show": false });
        //     }
        // }, 1000);
        //this.props.fetchAllLessons(this.props.lesson.currentPage, this.state.lessonsPerPage, this.props.lesson.sortDirection);

    };

    changeShowForm = () => {
        this.setState({ "showForm": !this.state.showForm } );
    }

    render() {
        const { instructorDay, instructors } = this.state;

        return (
            <div>
                <LessonForm showForm = {this.state.showForm} handleClose={() => this.changeShowForm()}></LessonForm>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <div style={{ "float": "left" }}>
                            <FontAwesomeIcon icon={faCalendarAlt} />  {this.state.date}
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
                                        deleteLesson={(lesson) => this.deleteLesson(lesson)} 
                                        changeShowForm ={() => this.changeShowForm()}/>
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