import React from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Table, ButtonGroup, Button, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faWallet, faEdit, faTrash, faUserPlus, faStepBackward, faFastBackward, faStepForward, faFastForward, faSearch, faTimes, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import SuccessToast from '../SuccessToast';

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
        this.findAllLessons(this.state.currentPage);
    }

    findAllLessons(currentPage) {
        currentPage -= 1;
        let sortDirection = this.state.sortToggle ? "asc" : "desc";
        axios.get("http://localhost:8080/lesson-api/list?page=" + currentPage + "&size=" + this.state.lessonsPerPage + "&sortBy=status&sortDir=" + sortDirection)
            .then(response => response.data)
            .then((data) => {
                this.setState({
                    lessons: data.content,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                    currentPage: data.number + 1
                });
            });
    }

    deleteLesson = (idLesson) => {
        axios.delete("http://localhost:8080/lesson-api/list/" + idLesson)
            .then(response => {
                if (response.data != null) {
                    this.setState({ "show": true });
                    setTimeout(() => this.setState({ "show": false }), 3000);
                    this.setState({
                        lessons: this.state.lessons.filter(lesson => lesson.id !== idLesson)
                    });
                } else {
                    this.setState({ "show": false });
                }
            });
    }

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

    firstPage = () => {
        let firstPage = 1;
        if (this.state.currentPage > firstPage) {
            if (this.state.searchedLesson) {
                this.searchLesson(firstPage)
            } else {
                this.findAllLessons(firstPage);
            }
        }
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

    lastPage = () => {
        // let lessonsLength = this.props.lessonData.lessons.length;
        let lessonsLength = this.state.lessons.length;
        let lastPage = Math.ceil(this.state.totalElements / this.state.lessonsPerPage);
        if (this.state.currentPage < lastPage) {
            if (this.state.searchedLesson) {
                this.searchLesson(lastPage)
            } else {
                this.findAllLessons(lastPage);
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

    searchChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    cancelSearch = () => {
        this.setState({ "searchedLesson": '' })
    };

    sortData = () => {
        this.setState(state => ({
            sortToggle: !state.sortToggle
        }));

        this.findAllLessons(this.state.currentPage);
    }

    searchLesson = (currentPage) => {
        currentPage -= 1;
        axios.get("http://localhost:8080/lesson-api/search/" + this.state.searchedLesson + "?page=" + currentPage + "&size=" + this.state.lessonsPerPage)
            .then(response => response.data)
            .then((data) => {
                this.setState({
                    lessons: data.content,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                    currentPage: data.number + 1
                });
            });
    }

    lessonTookPlace = (lesson) => {
        lesson.status = 2;
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

        this.findAllLessons(this.state.currentPage);
        this.findAllLessons(this.state.currentPage);

    }



    render() {
        const { lessons, currentPage, totalPages, searchedLesson } = this.state;

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
                                    <th onClick={this.sortData}> Date [mm/dd/yy] <div className={this.state.sortToggle ? "arrow arrow-down" : "arrow arrow-up"} /> </th>
                                    <th>Time</th>
                                    <th>How Long [h]</th>
                                    <th>Nr of Students</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>


                            <tbody>
                                {this.state.lessons.length === 0 ?
                                    <tr align="center">
                                        <td colSpan="10"> No Lessons in the Data Base</td>
                                    </tr> :

                                    this.state.lessons.map(lesson => (
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
                                                    <Button size="sm" variant="outline-success" onClick={this.lessonTookPlace.bind(this, lesson)}> <FontAwesomeIcon icon={faCheckSquare} /> </Button>
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

export default LessonList;