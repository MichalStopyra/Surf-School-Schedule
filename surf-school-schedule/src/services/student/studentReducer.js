import {
    SAVE_STUDENT_REQUEST, FETCH_STUDENT_REQUEST, UPDATE_STUDENT_REQUEST, DELETE_STUDENT_REQUEST,
    FETCH_ALL_STUDENTS_REQUEST, FETCH_SEARCH_STUDENTS_REQUEST,
    STUDENT_SUCCESS, STUDENT_FAILURE
} from "./studentTypes";

const initialState = {
    student: '',
    error: '',
    students: [],
    currentPage: 1,
    searchedStudent: '',
    sortDirection: "asc",
    studentsPerPage: 5
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ALL_STUDENTS_REQUEST:
            return {
                ...state,
                students: action.payload,
                totalElements: action.totalElements,
                totalPages: action.totalPages,
                sortDirection: action.sortDirection,
                error: ''
            };
        case UPDATE_STUDENT_REQUEST:
            return {
                ...state,
                student: action.updatedStudent,
                //update specific student
                students: state.students.map((item, index) => {
                    // Replace the item at index = updatedStudent
                    if (index === action.updatedStudent.id) {
                        return action.updatedStudent;
                    }
                    // Leave every other item unchanged
                    return item;
                })
            };
        case FETCH_STUDENT_REQUEST:
            return {
                ...state,
                student: action.updatedStudent
            };
        case SAVE_STUDENT_REQUEST:
            return {
                ...state,
                students: state.students.concat(action.newItem),
                student: action.newItem
            };
        case DELETE_STUDENT_REQUEST:
            return {
                ...state,
                students: state.students.filter(item => item.id !== action.studentId),
            };
        case STUDENT_SUCCESS:
            return {
                ...state,
                student: action.payload,
                error: ''
            };
        case STUDENT_FAILURE:
            return {
                ...state,
                //student: '',
                error: action.payload
            };
        case FETCH_SEARCH_STUDENTS_REQUEST:
            return {
                ...state,
                students: action.students,
                error: ''
            };
        default:
            return state;
    }
};

export default reducer;