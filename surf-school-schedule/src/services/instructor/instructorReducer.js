import {
    SAVE_INSTRUCTOR_REQUEST, FETCH_INSTRUCTOR_REQUEST, UPDATE_INSTRUCTOR_REQUEST, DELETE_INSTRUCTOR_REQUEST, 
    FETCH_ALL_INSTRUCTORS_REQUEST, FETCH_ALL_INSTRUCTORS_SUCCESS, FETCH_SEARCH_INSTRUCTORS_REQUEST,
    INSTRUCTOR_SUCCESS, INSTRUCTOR_FAILURE
} from "./instructorTypes";

const initialState = {
    instructor: '',
    error: '',
    instructors: [],
    currentPage: 1,
    searchedInstructor: '',
    sortDirection: "asc",
    instructorsPerPage: 5
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ALL_INSTRUCTORS_REQUEST:
            return {
                ...state
            };
        case UPDATE_INSTRUCTOR_REQUEST:
            console.log(action);
            return {
                ...state,
                instructor: action.updatedInstructor,
                //update specific instructor
                instructors: state.instructors.map((item, index) => {
                    // Replace the item at index = updatedInstructor
                    if (index === action.updatedInstructor.id) {
                        return action.updatedInstructor;
                    }
                    // Leave every other item unchanged
                    return item;
                })
            };
        case FETCH_INSTRUCTOR_REQUEST:
            return {
                ...state,
                instructor: action.updatedInstructor
            };
        case SAVE_INSTRUCTOR_REQUEST:
            return {
                ...state,
                instructors: state.instructors.concat(action.newItem),
                instructor: action.newItem
            };
        case DELETE_INSTRUCTOR_REQUEST:
            return {
                ...state,
                instructors: state.instructors.filter(item => item.id !== action.instructorId),
            };
        case INSTRUCTOR_SUCCESS:
            return {
                ...state,
                instructor: action.payload,
                error: ''
            };
        case INSTRUCTOR_FAILURE:
            return {
                ...state,
                //instructor: '',
                error: action.payload
            };
        case FETCH_ALL_INSTRUCTORS_SUCCESS:
            return {
                ...state,
                instructors: action.payload,
                totalElements: action.totalElements,
                totalPages: action.totalPages,
                sortDirection: action.sortDirection,
                error: ''
            };
        case FETCH_SEARCH_INSTRUCTORS_REQUEST:
            return {
                ...state,
                instructors: action.instructors,
                error: ''
            };
        default: return state;
    }
};

export default reducer;