import React from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Table, ButtonGroup, Button, InputGroup, FormControl, Form, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faMoneyCheckAlt, faUndo, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import SuccessToast from '../SuccessToast';
import StudentLessonsList from './StudentLessonsList';
import { connect } from 'react-redux';
import {
    deleteLesson, fetchAllLessonsForStudent, searchLessons, updateLesson,
    fetchStudent, fetchAllPriceTables, fetchPriceTableWithNrOfLessons, updateStudent
} from './../../services/index';

import './../../style/Style.css';


class StudentSettle extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            idStudent: +this.props.match.params.id,
            student: '',
            lessons: [],
            priceTable: '',
            priceOneH: [],
            customPrice: '',
            discount: '',
            totalPrice: '',
            howMany1p: '',
            howMany2p: '',
            howMany3p: '',
            currentPage: 1,
            lessonsPerPage: 5,
            searchedLesson: '',
            sortToggle: false,
            disableCustomPrice: true,
            disableDiscount: true,
            showSuccessMessage: false
        };
    }

    componentDidMount() {
        this.findStudentById(this.state.idStudent);
        this.props.fetchAllLessonsForStudent(+this.props.match.params.id, 1, this.state.lessonsPerPage);
        setTimeout(() => {
            this.findAllPriceTables();
            this.countLessons();
            setTimeout(() => { this.countTotalPrice() }, 100);
        }, 1000);

    }

    countTotalPrice = () => {
        let tempTotalPrice = this.state.priceOneH[0] * this.state.howMany1p;
        tempTotalPrice += this.state.priceOneH[1] * this.state.howMany2p;
        tempTotalPrice += this.state.priceOneH[2] * this.state.howMany3p;
        tempTotalPrice = tempTotalPrice * (100 - this.state.discount) / 100
        if(this.props.student.student.moneyInAdvance)
            tempTotalPrice -= this.props.student.student.moneyInAdvance;
        this.setState({
            totalPrice: tempTotalPrice
        });

    }

    countLessons = () => {
        let lessons = this.props.lessons;

        lessons = lessons.filter(lesson => lesson.status === "Finished_Unpaid");
        let count1p = 0;
        let count2p = 0;
        let count3p = 0;
        for (let i = 0; i < lessons.length; ++i) {
            switch (lessons[i].nrStudents) {
                case 1:
                    count1p += lessons[i].howLong;
                    break;
                case 2:
                    count2p += lessons[i].howLong;
                    break;
                default:
                    count3p += lessons[i].howLong;
                    break;
            }
            this.setState({
                howMany1p: count1p,
                howMany2p: count2p,
                howMany3p: count3p
            });
        }
    }


    findAllPriceTables = () => {
        let fullNrOfLessons = this.props.student.student.lessonHours;
        this.props.fetchPriceTableWithNrOfLessons(fullNrOfLessons);
        setTimeout(() => {
            this.props.fetchAllPriceTables(this.props.priceTable.priceTable);
        }, 100);
        setTimeout(() => {
            this.setState({
                priceTable: this.props.priceTable.priceTable
            });
            this.setPriceOneH();
        }, 100);

    }

    setPriceOneH = () => {
        // let priceOneHTab = [this.props.priceTable.priceTable.onePPrice, this.props.priceTable.priceTable.twoPPrice, this.props.priceTable.priceTable.threePPrice]
        let priceOneHTab;
        if (this.state.customPrice) {
            priceOneHTab = [this.state.customPrice, this.state.customPrice, this.state.customPrice]
        }
        else {
            let tempPriceTab;
            if (typeof (this.state.priceTable) !== 'object')
                tempPriceTab = JSON.parse(this.state.priceTable);
            else
                tempPriceTab = this.state.priceTable;
            priceOneHTab = [tempPriceTab.onePPrice, tempPriceTab.twoPPrice, tempPriceTab.threePPrice]
        }
        this.setState({ priceOneH: priceOneHTab })
    }

    findStudentById = (idStudent) => {

        this.props.fetchStudent(idStudent);
        setTimeout(() => {

            let student = this.props.student.student;
            if (student != null) {
                this.setState({
                    student: student
                    // id: student.id,
                    // lastName: student.lastName,
                    // firstName: student.firstName,
                    // idCardNr: student.idCardNr,
                    // telNr: student.telNr,
                    // paymentStatus: student.paymentStatus,
                    // lessonHours: student.lessonHours,
                    // unpaidLessons: student.unpaidLessons,
                    // moneyOwing: student.moneyOwing,
                    // moneyInAdvance: student.moneyInAdvance
                });
            }
        }, 1000);
    };


    // lessonStatusChange = (lesson, newStatus) => {
    //     lesson.status = newStatus;
    //     this.props.updateLesson(lesson);
    //     this.props.fetchAllLessonsForStudent(+this.props.match.params.id, this.props.lesson.currentPage, this.state.lessonsPerPage);
    // }

    settleChange = event => {

        this.setState({
            [event.target.name]: event.target.value,
        });
        this.setPriceOneH();
        setTimeout(() => {
            this.setPriceOneH();

            this.countTotalPrice();
        }, 100);

    };

    handleCheckboxCustomPriceChange = () => {
        this.setState({
            disableCustomPrice: !this.state.disableCustomPrice,
            customPrice: ''
        });

        setTimeout(() => {
            if (this.state.disableCustomPrice) {
                this.setPriceOneH();
                this.countTotalPrice();
            }
        }, 10);
    }

    handleCheckboxDiscountChange = () => {
        this.setState({
            disableDiscount: !this.state.disableDiscount,
            discount: ''
        });

        setTimeout(() => {
            if (this.state.disableDiscount) {
                this.setPriceOneH();
                this.countTotalPrice();
            }
        }, 10);
    }

    returnToStudentList = () => {
        return this.props.history.push("/students");
    };

    settleStudent = () => {
        const studentLessons = this.props.lessons
        for(let i=0; i< studentLessons.length; ++i) {
            if (studentLessons[i].status==='Finished_Unpaid') {
                const lesson = {
                    id: studentLessons[i].id,
                    instructor: studentLessons[i].instructor,
                    student: studentLessons[i].student,
                    date: studentLessons[i].date,
                    time: studentLessons[i].time,
                    howLong: studentLessons[i].howLong,
                    nrStudents: studentLessons[i].nrStudents,
                    status: "Finished_Paid"
                };
              //  console.log(lesson);
                this.props.updateLesson(lesson);
            }
        }

        if (this.state.totalPrice < 0 )
            var newMoneyInAdvance = -this.state.totalPrice;
            //let newStudentStatus = "We_Owe"
           // Owes_Us
        else
            var newMoneyInAdvance = 0;

        const student = {
            id: this.props.student.student.id,
            lastName: this.props.student.student.lastName,
            firstName: this.props.student.student.firstName,
            idCardNr: this.props.student.student.idCardNr,
            telNr: this.props.student.student.telNr,
            //paymentStatus: this.props.student.student.paymentStatus,
            lessonHours: this.props.student.student.lessonHours,
            unpaidLessons: this.props.student.student.unpaidLessons,
            moneyOwing: this.props.student.student.moneyOwing,
            moneyInAdvance: newMoneyInAdvance
        };
       // console.log(student);

       
        this.props.updateStudent(student);

        setTimeout(() => {

            if (!this.props.student.error && !this.props.lesson.error) {
                this.setState({ "showSuccesMessage": true });
                setTimeout(() => this.setState({ "showSuccessMessage": false }), 3000);
                setTimeout(() => this.returnToStudentList(), 1000);
            } else {
                this.setState({ "showInvalidMessage": true, "method": "post" });
                setTimeout(() => this.setState({ "showInvalidMessage": false }), 3000);
            }
        }, 2000);
    }

    render() {
        const searchedLesson = this.props.lesson.searchedLesson;
        const totalPages = this.props.lesson.totalPages;
        const totalElements = this.props.lesson.totalElements;
        const lesson = this.props.lesson;
        const lessons = this.props.lessons;
        const currentPage = this.props.lesson.currentPage;
        const student = this.props.student.student;
        const { moneyInAdvance, unpaidLessons, paymentStatus, lessonHours } = this.props.student.student;
        const priceTables = this.props.priceTable.priceTables;
        const { priceTable, priceOneH, discount, totalPrice, payForHowMany, howMany1p, howMany2p, howMany3p, customPrice } = this.state;

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
                    <SuccessToast show={this.state.show} message={"Student Settled Successfully"} type="success" />
                </div>

                {/* <div style={{ "display": this.state.showInvalidMessage ? "block" : "none" }}>
                <SuccessToast show={this.state.showInvalidMessage} message={"Invalid Data - might be in the data base already"} type="dangerNoSuccess" />
            </div> */}

                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <FontAwesomeIcon icon={faWallet} /> Settle Student
                </Card.Header>
                    <Form >
                        <Card.Body>
                            <div id="container" style={{ "clear": "both", "display": "flex", "justifyContent": "space-between" }}>

                                <div>
                                    <h5>Student</h5>
                                    <h4>{student.firstName + " " + student.lastName}</h4>

                                    <h6>Full Nr of Lessons [h]</h6>
                                    <h5>{lessonHours}</h5>

                                    <h6>Nr of Unpaid Lessons [h] (1p/2p/+3p)</h6>
                                    <h5>{unpaidLessons} ({howMany1p?howMany1p : 0 }/{howMany2p? howMany2p : 0 }/{howMany3p? howMany3p : 0})</h5>

                                    <h6>Money in advance [zl]</h6>
                                    <h5>{moneyInAdvance}</h5>

                                    <h5>Total price</h5>
                                    <h4>{totalPrice ? totalPrice : 0} zl</h4>

                                </div>
                                <div>
                                    <Form.Group as={Col} controlId="formGridPriceTables">
                                        <Form.Label>Offer</Form.Label>
                                        <Form.Control
                                            disabled={!this.state.disableCustomPrice}
                                            required as="select"
                                            autoComplete="off"
                                            name="priceTable"
                                            value={priceTable}
                                            onChange={this.settleChange}
                                            className={"bg-dark text-white"} >
                                            {this.state.disableCustomPrice ? priceTables.map(priceTable =>
                                                <option key={priceTable.id} value={JSON.stringify(priceTable)}>
                                                    {priceTable.name + " " + priceTable.minNrHours + "h"
                                                    }
                                                </option>
                                            ) : ""}
                                        </Form.Control>
                                    </Form.Group>

                                    <InputGroup className="mb-3">
                                        <InputGroup.Prepend >
                                            <InputGroup.Checkbox onChange={() => this.handleCheckboxCustomPriceChange()} />
                                        </InputGroup.Prepend>
                                        <Form.Group as={Col} controlId="formGridCustomPrice" name="customPrice">
                                            <Form.Label>Custom Price</Form.Label>
                                            <Form.Control
                                                disabled={this.state.disableCustomPrice}
                                                autoComplete="off"
                                                type="test"
                                                name="customPrice"
                                                value={customPrice}
                                                onChange={this.settleChange}
                                                placeholder={this.state.disableCustomPrice ? "" : "Enter Price [zl]"}
                                                className={"bg-dark text-white"} />
                                        </Form.Group>
                                    </InputGroup>

                                    <InputGroup className="mb-3">
                                        <InputGroup.Prepend >
                                            <InputGroup.Checkbox onChange={() => this.handleCheckboxDiscountChange()} />
                                        </InputGroup.Prepend>
                                        <Form.Group as={Col} controlId="formGridDiscount" name="discount">
                                            <Form.Label>Discount [%]</Form.Label>
                                            <Form.Control
                                                disabled={this.state.disableDiscount}
                                                autoComplete="off"
                                                type="test"
                                                name="discount"
                                                value={discount}
                                                onChange={this.settleChange}
                                                placeholder={this.state.disableDiscount ? "" : "Enter Discount [%]"}
                                                className={"bg-dark text-white"} />
                                        </Form.Group>
                                    </InputGroup>


                                </div>

                            </div>

                        </Card.Body>

                        <Card.Footer>
                            <div>
                                <Button size="sm" variant="info" onClick={() => this.settleStudent() }>
                                    <FontAwesomeIcon icon={faMoneyCheckAlt} />  Settle
                                </Button>
                                {'      '}

                                <Button size="sm" variant="secondary" type="reset">
                                    <FontAwesomeIcon icon={faUndo} />  Reset
                </Button>
                            </div>
                            {'      '}
                            <div>
                                <Button size="sm" variant="light" type="button" onClick={() => this.returnToStudentList()}>
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
        lessons: state.lesson.lessons,
        lesson: state.lesson.lesson,
        student: state.student,
        priceTable: state.priceTable
    }
};


const mapDispatchToProps = dispatch => {
    return {
        fetchAllLessonsForStudent: (studentId, currentPage, size) => dispatch(fetchAllLessonsForStudent(studentId, currentPage, size)),
        deleteLesson: (lessonId) => dispatch(deleteLesson(lessonId)),
        searchLessons: (searchedLesson, currentPage, sizePage) => dispatch(searchLessons(searchedLesson, currentPage, sizePage)),
        updateLesson: (lesson) => dispatch(updateLesson(lesson)),
        fetchStudent: (studentId) => dispatch(fetchStudent(studentId)),
        fetchAllPriceTables: (firstElement) => dispatch(fetchAllPriceTables(firstElement)),
        fetchPriceTableWithNrOfLessons: (fullNrOfLessons) => dispatch(fetchPriceTableWithNrOfLessons(fullNrOfLessons)),
        updateStudent: (student) => dispatch(updateStudent(student))
    }

};


export default connect(mapStateToProps, mapDispatchToProps)(StudentSettle);