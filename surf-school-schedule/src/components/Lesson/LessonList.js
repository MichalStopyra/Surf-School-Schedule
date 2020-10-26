import React from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Table, ButtonGroup, Button, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faWallet, faEdit, faTrash, faUserPlus, faStepBackward, faFastBackward, faStepForward, faFastForward, faSearch, faTimes, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import SuccessToast from '../SuccessToast';

import { connect } from 'react-redux';
import { deleteLesson, fetchAllLessons, searchLessons } from './../../services/index';

import './../../style/Style.css';


class LessonList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            lessons: [],
            currentPage: 1,
            lessonsPerPage: 5,
            searchedLesson: '',
            sortToggle: false
        };
    }

    componentDidMount() {
        this.props.fetchAllLessons(this.props.lesson.currentPage, this.state.lessonsPerPage, this.props.lesson.sortDirection);
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

    deleteLesson = (idLesson) => {

        this.props.deleteLesson(idLesson);

        setTimeout(() => {
            if (this.props.lesson != null) {
                this.setState({ "show": true });
                setTimeout(() => this.setState({ "show": false }), 1000);

            } else {
                this.setState({ "show": false });
            }
        }, 1000);
        this.props.fetchAllLessons(this.props.lesson.currentPage, this.state.lessonsPerPage, this.props.lesson.sortDirection);

    };

    changePage = event => {
        let target = parseInt(event.target.value);
        if (this.props.lesson.searchedLesson) {
            this.searchLesson(target)
        } else {
            let sortDirection = this.state.sortToggle ? "asc" : "desc";
            this.props.fetchAllLessons(target, this.state.lessonsPerPage, this.props.lesson.sortDirection);
        }
        this.setState({
            [event.target.name]: target
        });

    };

    firstPage = () => {
        let firstPage = 1;

        if (this.props.lesson.currentPage > firstPage) {
            this.props.lesson.currentPage = 1;
            if (this.props.lesson.searchedLesson) {
                this.searchLesson(this.props.lesson.currentPage)
            } else {
                let sortDirection = this.state.sortToggle ? "asc" : "desc";
                this.props.fetchAllLessons(this.props.lesson.currentPage, this.state.lessonsPerPage, this.props.lesson.sortDirection);
            }
        }
    };

    prevPage = () => {
        if (this.props.lesson.currentPage > 1) {
            --this.props.lesson.currentPage;
            if (this.props.lesson.searchedLesson) {
                this.searchLesson(this.props.lesson.currentPage)
            } else {
                let sortDirection = this.state.sortToggle ? "asc" : "desc";
                this.props.fetchAllLessons(this.props.lesson.currentPage, this.state.lessonsPerPage, this.props.lesson.sortDirection);
            }
        }
    };

    lastPage = () => {
        let lessonsLength = this.state.lessons.length;
        let lastPage = Math.ceil(this.props.totalElements / this.state.lessonsPerPage);
        if (this.props.lesson.currentPage < lastPage) {
            this.props.lesson.currentPage = lastPage;
            if (this.props.lesson.searchedLesson) {
                this.searchLesson(this.props.lesson.currentPage)
            } else {
                this.props.fetchAllLessons(this.props.lesson.currentPage, this.state.lessonsPerPage, this.props.lesson.sortDirection);
            }
        }
    };

    nextPage = () => {
        if (this.state.currentPage < Math.ceil(this.props.totalElements / this.state.lessonsPerPage)) {
            ++this.props.lesson.currentPage;

            if (this.props.lesson.searchedLesson) {
                this.searchLesson(this.props.lesson.currentPage)
            } else {
                let sortDirection = this.state.sortToggle ? "asc" : "desc";
                this.props.fetchAllLessons(this.props.lesson.currentPage, this.state.lessonsPerPage, this.props.lesson.sortDirection);
            }
        }
    };

    searchChange = event => {
        this.props.lesson.searchedLesson = event.target.value;
        this.forceUpdate();
    };

    cancelSearch = () => {
        this.props.lesson.searchedLesson = '';
        this.props.fetchAllLessons(this.props.lesson.currentPage, this.state.lessonsPerPage, this.props.lesson.sortDirection);
        this.forceUpdate();
    };

    sortData = () => {
        // console.log(this.props.lesson.sortDirection);
        if (this.props.lesson.sortDirection === "asc")
            this.props.lesson.sortDirection = "desc";
        else
            this.props.lesson.sortDirection = "asc";
        //   console.log(this.props.lesson.sortDirection);

        this.props.fetchAllLessons(this.props.lesson.currentPage, this.state.lessonsPerPage, this.props.lesson.sortDirection);

    }

    searchLesson = (currentPage) => {
        if (this.props.lesson.searchedLesson)
            this.props.searchLessons(this.props.lesson.searchedLesson, this.props.lesson.currentPage, this.props.lesson.lessonsPerPage);
    }


    lessonStatusChange = (lesson, newStatus) => {
        lesson.status = newStatus;
        axios.put("http://localhost:8080/lesson-api/" + lesson.id, lesson)
            .then(response => {
                if (response.data != null) {
                    // this.setState({ "show": true, "method": "put" });
                    // setTimeout(() => this.setState({ "show": false }), 3000);
                    // setTimeout(() => this.returnToList(), 1000);
                    console.log("success");
                } else {
                    console.log(":(");
                    // this.setState({ "show": false });
                }
            });
        console.log(this);
        this.findAllLessons(this.state.currentPage);
        this.findAllLessons(this.state.currentPage);

    }



    render() {
        const searchedLesson = this.props.lesson.searchedLesson;
        const totalPages = this.props.lesson.totalPages;
        const totalElements = this.props.lesson.totalElements;
        const lesson = this.props.lesson;
        const lessons = this.props.lessons;
        const currentPage = this.props.lesson.currentPage;
        const sortDirection = this.props.lesson.sortDirection;

        const pageNumCss = {
            width: "45px",
            border: "1px solid #F8F8FF",
            color: "#F8F8FF",
            textAlign: "center",
            fontWeight: "bold"
        };

        const searchBoxCss = {
            width: "100px",
            border: "1px solid #17A2B8",
            color: "#17A2B8",
            textAlign: "center",
            fontWeight: "bold"
        };


        return (
            <div>
                <div style={{ "display": this.state.show ? "block" : "none" }}>
                    <SuccessToast show={this.state.show} message="Lesson Deleted Successfully." type="danger" />
                </div>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <div style={{ "float": "left" }}>
                            <FontAwesomeIcon icon={faUsers} />     Lessons List
                        </div>

                        <div style={{ "float": "right" }}>
                            <InputGroup size="sm">
                                <FormControl style={searchBoxCss} className={"bg-dark"} name="searchedLesson" value={searchedLesson} placeholder="Search"
                                    onChange={this.searchChange} />
                                <InputGroup.Append>
                                    <Button size="sm" variant="outline-info" type="button" onClick={this.searchLesson}>
                                        <FontAwesomeIcon icon={faSearch} />
                                    </Button>
                                    <Button size="sm" variant="outline-danger" type="button" onClick={this.cancelSearch}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </div>

                    </Card.Header>
                    <Card.Body>
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th>Instructor</th>
                                    <th>Student</th>
                                    <th onClick={this.sortData}> Date <div className={this.state.sortToggle ? "arrow arrow-down" : "arrow arrow-up"} /> </th>
                                    <th>Time</th>
                                    <th>How Long [h]</th>
                                    <th>Nr of Students</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>


                            <tbody>
                                {lessons.length === 0 ?
                                    <tr align="center">
                                        <td colSpan="10"> No Lessons in the Data Base</td>
                                    </tr> :

                                    lessons.map(lesson => (
                                        <tr key={lesson.id}>
                                            <td>{lesson.instructor.firstName + " " + lesson.instructor.lastName}</td>
                                            <td>{lesson.student.firstName + " " + lesson.student.lastName}</td>
                                            <td>{lesson.date}</td>
                                            <td>{lesson.time}</td>
                                            <td>{lesson.howLong}</td>
                                            <td>{lesson.nrStudents}</td>
                                            <td>{lesson.status}</td>
                                            <td>
                                                <ButtonGroup>
                                                    <Button size="sm" variant="outline-success" onClick={this.lessonStatusChange.bind(this, lesson, 2)}> <FontAwesomeIcon icon={faCheckSquare} /> </Button>
                                                    <Link to={"editLesson/" + lesson.id}> <Button size="sm" variant="outline-primary"> <FontAwesomeIcon icon={faEdit} /> </Button> </Link>
                                                    <Button size="sm" variant="outline-danger" onClick={this.deleteLesson.bind(this, lesson.id)}> <FontAwesomeIcon icon={faTrash} /> </Button>
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
                            <Link to={"add-lesson"} className="nav-link">
                                <ButtonGroup>
                                    <Button size="lg" variant="outline-light"> <FontAwesomeIcon icon={faUserPlus} /> </Button>
                                </ButtonGroup>
                            </Link>
                            Page {currentPage} of {totalPages === 0 ? 1 : totalPages}
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

const mapStateToProps = state => {
    return {
        lesson: state.lesson,
        lessons: state.lesson.lessons,
        totalPages: state.lesson.totalPages,
        totalElements: state.lesson.totalElements,
        currentPage: state.lesson.currentPage,
        searchedLesson: state.lesson.searchedLesson,
        sortDirection: state.lesson.sortDirection
    }
};


const mapDispatchToProps = dispatch => {
    return {
        fetchAllLessons: (currentPage, size, sortDir) => dispatch(fetchAllLessons(currentPage, size, sortDir)),
        deleteLesson: (lessonId) => dispatch(deleteLesson(lessonId)),
        searchLessons: (searchedLesson, currentPage, sizePage) => dispatch(searchLessons(searchedLesson, currentPage, sizePage))
    }

};


export default connect(mapStateToProps, mapDispatchToProps)(LessonList);