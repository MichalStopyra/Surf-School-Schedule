import { faArrowLeft, faMoneyCheckAlt, faWallet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React from 'react';
import { Button, Card, Col, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import SuccessToast from '../SuccessToast';
import { fetchInstructor, updateInstructor } from './../../services/index';
import './../../style/Style.css';




class InstructorSettle extends React.Component {

    constructor(props) {
        super(props);
        let today = new Date();
        this.state = {
            idInstructor: +this.props.match.params.id,
            instructor: '',
            weekInstructorTab: [],
            weekInstructor: '',
            showSuccessMessage: false,
            showInvalidMessage: false,
            date: today.getMonth() + 1 + '-' + today.getDate() + '-' + today.getFullYear()

        };
    }

    componentDidMount() {
        this.findInstructorById(this.state.idInstructor);
        this.findWeekInstructorTab(this.state.idInstructor)
        this.findWeekInstructor(this.state.idInstructor, this.state.date)
    }

    findWeekInstructorTab = (idInstructor) => {
        axios.get("http://localhost:8080/weekInstructor-api/studentWeekInstructors/" + idInstructor)
            .then(response => {
                if (response.data != null) {
                    this.setState({
                        weekInstructorTab: response.data.content
                    });
                }
            }).catch((error) => {
                console.error("Error: " + error);
            });
    };

    findWeekInstructor = (idInstructor, date) => {
        axios.get("http://localhost:8080/weekInstructor-api/" + idInstructor + "/" + date)
            .then(response => {
                if (response.data != null) {
                    this.setState({
                        weekInstructor: response.data
                    });
                }
            }).catch((error) => {
                console.error("Error: " + error);
            });
    };



    findInstructorById = (idInstructor) => {

        this.props.fetchInstructor(idInstructor);
        setTimeout(() => {

            let instructor = this.props.instructor.instructor;
            if (instructor != null) {
                this.setState({
                    instructor: instructor
                });
            }
        }, 1000);
    };


    settleChange = event => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    returnToInstructorList = () => {
        return this.props.history.push("/instructors");
    };

    settleInstructor = () => {
        const weekInstructor = {
            id: this.state.weekInstructor.id,
            instructor: this.state.instructor,
            beginningDate: this.state.weekInstructor.beginningDate,
            endDate: this.state.weekInstructor.endDate,
            fullNrOfLessonsWeek: this.state.weekInstructor.fullNrOfLessonsWeek,
            nrOfLessons1p: this.state.weekInstructor.nrOfLessons1p,
            nrOfLessons2p: this.state.weekInstructor.nrOfLessons2p,
            nrOfLessons3p: this.state.weekInstructor.nrOfLessons3p,
            weekWage: this.state.weekInstructor.weekWage,
            status: 1
        };

        axios.put("http://localhost:8080/weekInstructor-api/" + weekInstructor.id, weekInstructor)
            .then(response => {
                if (response.data != null) {
                    this.setState({ "showSuccesMessage": true });
                    setTimeout(() => this.setState({ "showSuccessMessage": false }), 3000);
                    setTimeout(() => this.returnToInstructorList(), 2000);
                }
                else {
                    this.setState({ "showInvalidMessage": true, "method": "post" });
                    setTimeout(() => this.setState({ "showInvalidMessage": false }), 3000);
                }
            }).catch((error) => {
                console.error("Error: " + error);
            });
    }

    render() {
        const instructor = this.state.instructor;
        const { weekInstructorTab, weekInstructor } = this.state

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
                <div style={{ "display": this.state.showSuccessMessage ? "block" : "none" }}>
                    <SuccessToast show={this.state.showSuccessMessage} message={"Instructor Settled Successfully"} type="success" />
                </div>
                <div style={{ "display": this.state.showInvalidMessage ? "block" : "none" }}>
                    <SuccessToast show={this.state.showInvalidMessage} message={"Couldn't settle instructor"} type="dangerNoSuccess" />
                </div>

                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <FontAwesomeIcon icon={faWallet} /> Settle Instructor
                </Card.Header>
                    <Form >
                        <Card.Body>
                            <div id="container" style={{ "clear": "both", "display": "flex", "justifyContent": "space-between" }}>

                                <div>
                                    <h5>Instructor</h5>
                                    <h4>{instructor.firstName + " " + instructor.lastName}</h4>

                                    <h6>Date (Monday - Sunday)</h6>
                                    <h5>{weekInstructor.beginningDate} - {weekInstructor.endDate}</h5>

                                    <h6>Nr of Lessons This Week[h]</h6>
                                    <h5>{weekInstructor.fullNrOfLessonsWeek}</h5>

                                    <h6>(1p/2p/+3p)</h6>
                                    <h5>{weekInstructor.nrOfLessons1p ? weekInstructor.nrOfLessons1p : 0} /
                                    {weekInstructor.nrOfLessons2p ? weekInstructor.nrOfLessons2p : 0} /
                                    {weekInstructor.nrOfLessons3p ? weekInstructor.nrOfLessons3p : 0} </h5>

                                    <h5> Week's Wage [zl]</h5>
                                    <h4>{weekInstructor.weekWage ? weekInstructor.weekWage : 0}</h4>

                                </div>
                                <Form.Group as={Col} controlId="formGridWhichWeek">
                                    <Form.Label>Choose Week</Form.Label>
                                    <Form.Control required as="select"
                                        autoComplete="off"
                                        name="weekInstructor"
                                        value={weekInstructor}
                                        onChange={this.settleChange}
                                        className={"bg-dark text-white"}>
                                        {weekInstructorTab.filter(weekInstructor =>
                                            weekInstructor.status === "Not_Settled").length ? weekInstructorTab.filter(weekInstructor =>
                                            weekInstructor.status === "Not_Settled")
                                            .map(weekInstructor =>
                                                <option key={weekInstructor.id} value={weekInstructor}>
                                                    {weekInstructor.beginningDate} - {weekInstructor.endDate}
                                                </option>
                                            ) : <option>All weeks are settled</option>}
                                    </Form.Control>
                                </Form.Group>


                            </div>

                        </Card.Body>

                        <Card.Footer>
                            <div>
                                <Button size="sm" variant="info" onClick={() => this.settleInstructor()}>
                                    <FontAwesomeIcon icon={faMoneyCheckAlt} />  Settle
                                    </Button>
                                {"     "}
                                <Button size="sm" variant="light" type="button" onClick={() => this.returnToInstructorList()}>
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
        instructor: state.instructor,
    }
};


const mapDispatchToProps = dispatch => {
    return {
        fetchInstructor: (instructorId) => dispatch(fetchInstructor(instructorId)),
        updateInstructor: (instructor) => dispatch(updateInstructor(instructor))
    }

};


export default connect(mapStateToProps, mapDispatchToProps)(InstructorSettle);