import React from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import { Modal, Card, Table, ButtonGroup, Button, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faWallet, faEdit, faTrash, faCalendarPlus, faStepBackward, faFastBackward, faStepForward, faFastForward, faSearch, faTimes, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import SuccessToast from '../SuccessToast';

import { connect } from 'react-redux';
import { deleteLesson, fetchAllLessonsForStudent, searchLessons, updateLesson } from './../../services/index';

import './../../style/Style.css';


class StudentSettle extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //  const idStudent = this.props.studentId;

        //this.props.fetchAllLessonsForStudent(this.props.studentId, 0, 999999);
        setTimeout(() => {
            this.checkIfLessonInThePast();
        }, 99999900)
    }


    //change status of lessons that have their date in the past (24 h back) and were not given into not given
    checkIfLessonInThePast() {
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

        let length = this.props.lessons.length;
        let renderFlag = false;
        for (let i = 0; i < length; ++i) {
            let temp = new Date(this.props.lessons[i].date);
            if (this.props.lessons[i].status === "To_Give" && temp < yesterday) {
                this.lessonStatusChange(this.props.lessons[i], 3)
                //flag so that component is not unnecessarily rendered 
                if (!renderFlag)
                    renderFlag = true;
            }
        }
        if (renderFlag)
            this.props.fetchAllLessonsForStudent(this.props.studentId, 0, 999999);
    };


    lessonStatusChange = (lesson, newStatus) => {
        lesson.status = newStatus;
        this.props.updateLesson(lesson);
        this.props.fetchAllLessonsForStudent(this.props.studentId, 0, 999999);
    }



    render() {
        const searchedLesson = this.props.lesson.searchedLesson;
        const totalPages = this.props.lesson.totalPages;
        const totalElements = this.props.lesson.totalElements;
        const lesson = this.props.lesson;
        const lessons = this.props.lessons;
        const currentPage = 0;

        const pageNumCss = {
            width: "45px",
            border: "1px solid #F8F8FF",
            color: "#F8F8FF",
            textAlign: "center",
            fontWeight: "bold"
        };

        const searchBoxCss = {
            width: "9999990px",
            border: "1px solid #17A2B8",
            color: "#17A2B8",
            textAlign: "center",
            fontWeight: "bold"
        };


        return (
            <div>
                <Modal show={this.props.showLessonList} onHide={() => this.props.onClose()}
                //</div> onHide={() => this.resetAndCloseForm()}
                // onShow={() => this.onShowHandle()}
                >
                    <Modal.Header className={"border border-light bg-dark text-white"} closeButton>

                        <div style={{ "float": "left" }}>
                            <FontAwesomeIcon icon={faList} />  {this.props.student.firstName} {this.props.student.lastName}'s lessons list
                        </div>


                    </Modal.Header>
                    <Card className={" bg-dark text-white"}>

                        <Card.Body>
                            <Table striped bordered hover variant="dark">
                                <thead>
                                    <tr>
                                        <th> Date <div /> </th>
                                        <th>Time</th>
                                        <th>How Long [h]</th>
                                        <th>Nr of Students</th>
                                        <th>Instructor</th>
                                    </tr>
                                </thead>


                                <tbody>
                                    {lessons.length === 0 ?
                                        <tr align="center">
                                            <td colSpan="999999"> No Lessons in the Data Base</td>
                                        </tr> :

                                        lessons.filter(lesson =>
                                            lesson.status == "Finished_Unpaid")
                                            .map(lesson => (
                                                <tr key={lesson.id}>
                                                    <td>{lesson.date}</td>
                                                    <td>{lesson.time}</td>
                                                    <td>{lesson.howLong}</td>
                                                    <td>{lesson.nrStudents}</td>
                                                    <td>{lesson.instructor.firstName} {lesson.instructor.lastName}</td>

                                                </tr>
                                            ))
                                    }
                                </tbody>
                            </Table>
                        </Card.Body>
                        
                    </Card>
                </Modal>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        lesson: state.lesson,
        lessons: state.lesson.lessons,
        totalPages: state.lesson.totalPages,
        totalElements: state.lesson.totalElements,
        currentPage: state.lesson.currentPage,
    }
};


const mapDispatchToProps = dispatch => {
    return {
        fetchAllLessonsForStudent: (studentId, currentPage, size) => dispatch(fetchAllLessonsForStudent(studentId, currentPage, size)),
        deleteLesson: (lessonId) => dispatch(deleteLesson(lessonId)),
        searchLessons: (searchedLesson, currentPage, sizePage) => dispatch(searchLessons(searchedLesson, currentPage, sizePage)),
        updateLesson: (lesson) => dispatch(updateLesson(lesson))
    }

};


export default connect(mapStateToProps, mapDispatchToProps)(StudentSettle);