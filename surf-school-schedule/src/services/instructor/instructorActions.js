import {
    SAVE_INSTRUCTOR_REQUEST, FETCH_INSTRUCTOR_REQUEST, UPDATE_INSTRUCTOR_REQUEST,
    DELETE_INSTRUCTOR_REQUEST, INSTRUCTOR_SUCCESS, INSTRUCTOR_FAILURE,
    FETCH_ALL_INSTRUCTORS_REQUEST, FETCH_ALL_INSTRUCTORS_SUCCESS,
    FETCH_SEARCH_INSTRUCTORS_REQUEST
} from "./instructorTypes";
import axios from 'axios';

export const fetchAllInstructors = (currentPage, size, sortDir) => {
    --currentPage;
    return dispatch => {
        // dispatch(fetchAllInstructorsRequest());???????????????????????????
        axios.get("http://localhost:8080/instructor-api/list?page=" + currentPage + "&size=" + size + "&sortBy=paymentStatus&sortDir=" + sortDir)
            .then(response => {
                dispatch(fetchAllInstructorsSuccess(response.data.content, response.data.totalPages, response.data.totalElements, sortDir));
            })
            .catch(error => {
                dispatch(instructorFailure(error.message));
            });
    };
};

const fetchAllInstructorsRequest = () => {
    return {
        type: FETCH_ALL_INSTRUCTORS_REQUEST
    };
};

export const saveInstructor = instructor => {
    return dispatch => {
        axios.post("http://localhost:8080/instructor-api/list", instructor)
            .then(response => {
                //  dispatch(instructorSuccess(response.data));
                dispatch(saveInstructorRequest(instructor));
            })
            .catch(error => {
                console.log(error);
                dispatch(instructorFailure(error));
            });
    };
};

const saveInstructorRequest = instructor => {
    return {
        type: SAVE_INSTRUCTOR_REQUEST,
        newItem: instructor
    };
};

const fetchInstructorRequest = updatedInstructor => {
    return {
        type: FETCH_INSTRUCTOR_REQUEST,
        updatedInstructor: updatedInstructor
    };
};

export const fetchInstructor = instructorId => {
    return dispatch => {
        axios.get("http://localhost:8080/instructor-api/" + instructorId)
            .then(response => {
                dispatch(fetchInstructorRequest(response.data));
                //dispatch(instructorSuccess(response.data.content));
            })
            .catch(error => {
                dispatch(instructorFailure(error));
            });
    };
};

const updateInstructorRequest = instructor => {
    return {
        type: UPDATE_INSTRUCTOR_REQUEST,
        updatedInstructor: instructor
    };
};

export const updateInstructor = instructor => {
    //console.log(instructor);
    instructor.NrHoursWeek = 0;
    instructor.NrHoursFull = 0;
    instructor.WeekWage = 0;
    //console.log(instructor);

    return dispatch => {
        axios.put("http://localhost:8080/instructor-api/" + instructor.id, instructor)
            .then(response => {
                dispatch(updateInstructorRequest(instructor));

                // dispatch(instructorSuccess(response.data));
            })
            .catch(error => {
                console.log(error);
                dispatch(instructorFailure(error));
            });
    };
};

const deleteInstructorRequest = instructorId => {
    return {
        type: DELETE_INSTRUCTOR_REQUEST,
        instructorId: instructorId
    };
};

export const deleteInstructor = instructorId => {
    return dispatch => {
        axios.delete("http://localhost:8080/instructor-api/list/" + instructorId)
            .then(response => {
                dispatch(deleteInstructorRequest(instructorId));
                //console.log(response);
                dispatch(instructorSuccess(response.data));
            })
            .catch(error => {
                dispatch(instructorFailure(error));
            });
    };
};


const instructorSuccess = instructor => {
    return {
        type: INSTRUCTOR_SUCCESS,
        payload: instructor
    };
};

const instructorFailure = error => {
    return {
        type: INSTRUCTOR_FAILURE,
        payload: error
    };
};

const fetchAllInstructorsSuccess = (instructors, totalPages, totalElements, sortDirection) => {
    return {
        type: FETCH_ALL_INSTRUCTORS_SUCCESS,
        payload: instructors,
        totalPages: totalPages,
        totalElements: totalElements,
        sortDirection: sortDirection
    };
};

export const searchInstructors = (searchedValue, currentPage, instructorsPerPage) => {
    --currentPage;
    return dispatch => {
        axios.get("http://localhost:8080/instructor-api/search/" + searchedValue + "?page=" + currentPage + "&size=" + instructorsPerPage)
            .then(response => {
                dispatch(searchInstructorsRequest(response.data.content));
            })
            .catch(error => {
                dispatch(instructorFailure(error.message));
            });
    };
};


const searchInstructorsRequest = instructors => {
    return {
        type: FETCH_SEARCH_INSTRUCTORS_REQUEST,
        instructors: instructors
    };
};


