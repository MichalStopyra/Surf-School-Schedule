import React from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Table, ButtonGroup, Button, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faWallet, faEdit, faTrash, faUserPlus, faStepBackward, faFastBackward, faStepForward, faFastForward, faSearch, faTimes, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import SuccessToast from '../SuccessToast';

import './../../style/Style.css';


class Schedule extends React.Component {

    constructor(props) {
        super(props);
        let today = new Date();
        this.state = {
            date: today.getMonth + '-' + today.getDate + '-' + today.getFullYear,
            instructors: [],
            lessons: [],
            instructorDay: [],
            currentPage: 1,
            lessonsPerPage: 5,
            searchedLesson: '',
            sortToggle: false
        };
    }

    componentDidMount() {
        //this.findAllLessons(this.state.currentPage);
        this.findAllInstructors();
         this.findAllInstructorDay(this.state.instructors, this.state.date);
        //this.findAllInstructorDay("10-20-2020");

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
                }

                );
            }
            );

    }

    findAllInstructors(date) {
        var instructors = [];
        axios.get("http://localhost:8080/instructor-api/list?page=0&size=999999999&sortBy=paymentStatus&sortDir=desc")
            .then(response => response.data)
            .then((data) => {
                // if (!this.state.instructors.length)
                // this.state.instructors.push("Select Instructor");
console.log(data.content);
                instructors = data.content;
            }, () => this.findAllInstructorDay(instructors, date));
        
    }

    findAllInstructorDay(instructors, date) {
        

        let allInstrDayTable = [];
        console.log(instructors);
        instructors.forEach(function (instructor) {
            axios.get("http://localhost:8080/lesson-api/" + instructor.id + "/" + date)
                .then(response => {
                    if (response.data != null) {


                        let tempInstrDay = {};

                        tempInstrDay.instructor = instructor.firstName + " " + instructor.lastName;

                        //save when the lessons start 
                        let tab = response.data.content;
                        tempInstrDay.lessonsThisDay = tab;


                        allInstrDayTable.push(tempInstrDay);
                        // tab = timesTab.map(t => {t.time, t.student, t.howLong});

                        //save how long they take
                        let howLongTab = response.data.content;
                        howLongTab = howLongTab.map(h => h.howLong);

                        //if lesson is gonna e.g.  start at 12 and take 2h - delete not only 12 but also 1 pm 
                        // for (let i = 0; i < howLongTab.length; ++i) {
                        //     if (howLongTab[i] > 1) {
                        //         var pieces = timesTab[i].split(':');

                        //         for (var j = 1; j < howLongTab[i]; ++j) {
                        //             ++pieces[0];
                        //             var tempHour = pieces[0] + ":00";
                        //             timesTab = timesTab.concat(tempHour)
                        //         }
                        // }
                        //}

                    }
                }

                )
        });
        this.setState({
            instructorDay: allInstrDayTable
        }, () => console.log(this.state.instructorDay));
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

    returnLesson(hour) {

    }

    returnRow = (instructor) => {
        axios.get("http://localhost:8080/lesson-api/" + instructor.id + "/" + this.state.date)
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

                    return (
                        <tr>

                            <td>{instructor.firstName + " " + instructor.lastName}</td>
                            <td>{this.returnLesson("9:00")}</td>
                            <td>{this.returnLesson("10:00")}</td>
                            <td>{this.returnLesson("11:00")}</td>
                            <td>{this.returnLesson("12:00")}</td>
                            <td>{this.returnLesson("13:00")}</td>
                            <td>{this.returnLesson("14:00")}</td>
                            <td>{this.returnLesson("15:00")}</td>
                            <td>{this.returnLesson("16:00")}</td>
                            <td>{this.returnLesson("17:00")}</td>
                            <td>{this.returnLesson("18:00")}</td>
                            <td>{this.returnLesson("19:00")}</td>
                            <td>{this.returnLesson("20:00")}</td>
                        </tr>

                    );
                }
            })
    };

    render() {
const { instructorDay, instructors } = this.state;

        return (
            <div>

                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>


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
                                {console.log("sadsda")
                                }
                                {this.state.instructorDay.length === 0 ?
                                    <tr align="center">
                                        <td colSpan="10"> No Lessons in the Data Base</td>
                                    </tr> :
                                    this.state.instructorDay.map(instrDay => (
                                        <tr key={instrDay.id}>
                                            {console.log("asd")}
                                            <td>{instrDay.instructor}</td>


                                        </tr>

                                    ))


                                }
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

export default Schedule;