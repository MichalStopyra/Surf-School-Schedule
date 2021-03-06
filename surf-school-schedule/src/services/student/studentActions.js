import {
    SAVE_STUDENT_REQUEST, FETCH_STUDENT_REQUEST, UPDATE_STUDENT_REQUEST,
    DELETE_STUDENT_REQUEST, STUDENT_SUCCESS, STUDENT_FAILURE,
    FETCH_ALL_STUDENTS_REQUEST,
    FETCH_SEARCH_STUDENTS_REQUEST
} from "./studentTypes";
import axios from 'axios';

export const fetchAllStudents = (currentPage, size, sortDir, addedStudent) => {
    --currentPage;
    return dispatch => {

        axios.get("https://surf-school-schedule.herokuapp.com/student-api/list?page=" + currentPage + "&size=" + size + "&sortBy=paymentStatus&sortDir=" + sortDir)
            .then(response => {
                    if (addedStudent)
                        response.data.content.unshift(
                            //  {   id: -1, lastName: 'Select Student', firstName: '', idCardNr: '', telNr: '', paymentStatus: 0, lessonHours: 0, unpaidLessons: 0, moneyOwing: 0, moneyInAdvance: ''
                            // }
                            addedStudent);

                dispatch(fetchAllStudentsRequest(response.data.content, response.data.totalPages, response.data.totalElements, sortDir));
            })
            .catch(error => {
                dispatch(studentFailure(error.message));
            });
    };
};

const fetchAllStudentsRequest = (students, totalPages, totalElements, sortDirection) => {
    return {
        type: FETCH_ALL_STUDENTS_REQUEST,
        payload: students,
        totalPages: totalPages,
        totalElements: totalElements,
        sortDirection: sortDirection
    };
};

export const saveStudent = student => {
    return dispatch => {
        axios.post("https://surf-school-schedule.herokuapp.com/student-api/list", student)
            .then(response => {
                dispatch(saveStudentRequest(student));
            })
            .catch(error => {
                console.log(error);
                dispatch(studentFailure(error));
            });
    };
};

const saveStudentRequest = student => {
    return {
        type: SAVE_STUDENT_REQUEST,
        newItem: student
    };
};

const fetchStudentRequest = updatedStudent => {
    return {
        type: FETCH_STUDENT_REQUEST,
        updatedStudent: updatedStudent
    };
};

export const fetchStudent = studentId => {
    return dispatch => {
        axios.get("https://surf-school-schedule.herokuapp.com/student-api/" + studentId)
            .then(response => {
                dispatch(fetchStudentRequest(response.data));
                //dispatch(studentSuccess(response.data.content));
            })
            .catch(error => {
                dispatch(studentFailure(error));
            });
    };
};

const updateStudentRequest = student => {
    return {
        type: UPDATE_STUDENT_REQUEST,
        updatedStudent: student
    };
};

export const updateStudent = student => {
    //console.log(student);
    // student.NrHoursWeek = 0;
    // student.NrHoursFull = 0;
    // student.WeekWage = 0;
    //console.log(student);

    return dispatch => {
        axios.put("https://surf-school-schedule.herokuapp.com/student-api/" + student.id, student)
            .then(response => {
                dispatch(updateStudentRequest(student));

                // dispatch(studentSuccess(response.data));
            })
            .catch(error => {
                console.log(error);
                dispatch(studentFailure(error));
            });
    };
};

const deleteStudentRequest = studentId => {
    return {
        type: DELETE_STUDENT_REQUEST,
        studentId: studentId
    };
};

export const deleteStudent = studentId => {
    return dispatch => {
        axios.delete("https://surf-school-schedule.herokuapp.com/student-api/list/" + studentId)
            .then(response => {
                dispatch(deleteStudentRequest(studentId));
                //console.log(response);
                dispatch(studentSuccess(response.data));
            })
            .catch(error => {
                dispatch(studentFailure(error));
            });
    };
};


const studentSuccess = student => {
    return {
        type: STUDENT_SUCCESS,
        payload: student
    };
};

const studentFailure = error => {
    return {
        type: STUDENT_FAILURE,
        payload: error
    };
};


export const searchStudents = (searchedValue, currentPage, studentsPerPage) => {
    --currentPage;
    return dispatch => {
        axios.get("https://surf-school-schedule.herokuapp.com/student-api/search/" + searchedValue + "?page=" + currentPage + "&size=" + studentsPerPage)
            .then(response => {
                dispatch(searchStudentsRequest(response.data.content));
            })
            .catch(error => {
                dispatch(studentFailure(error.message));
            });
    };
};


const searchStudentsRequest = students => {
    return {
        type: FETCH_SEARCH_STUDENTS_REQUEST,
        students: students
    };
};


