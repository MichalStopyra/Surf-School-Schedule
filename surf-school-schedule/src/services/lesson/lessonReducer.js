import {
    SAVE_LESSON_REQUEST, FETCH_LESSON_REQUEST, UPDATE_LESSON_REQUEST, DELETE_LESSON_REQUEST,
    FETCH_ALL_LESSONS_REQUEST, FETCH_SEARCH_LESSONS_REQUEST,
    LESSON_SUCCESS, LESSON_FAILURE, FETCH_ALL_STUDENT_LESSONS_REQUEST 
} from "./lessonTypes";

const initialState = {
    lesson: '',
    error: '',
    lessons: [],
    currentPage: 1,
    searchedLesson: '',
    sortDirection: "asc",
    lessonsPerPage: 5
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ALL_LESSONS_REQUEST:
            return {
                ...state,
                lessons: action.payload,
                totalElements: action.totalElements,
                totalPages: action.totalPages,
                sortDirection: action.sortDirection,
                error: ''
            };
        case UPDATE_LESSON_REQUEST:
            return {
                ...state,
                lesson: action.updatedLesson,
                //update specific lesson
                lessons: state.lessons.map((item, index) => {
                    // Replace the item at index = updatedLesson
                    if (index === action.updatedLesson.id) {
                        return action.updatedLesson;
                    }
                    // Leave every other item unchanged
                    return item;
                })
            };
        case FETCH_LESSON_REQUEST:
            return {
                ...state,
                lesson: action.updatedLesson
            };
        case SAVE_LESSON_REQUEST:
            return {
                ...state,
                lessons: state.lessons.concat(action.newItem),
                lesson: action.newItem
            };
        case DELETE_LESSON_REQUEST:
            return {
                ...state,
                lessons: state.lessons.filter(item => item.id !== action.lessonId),
            };
        case LESSON_SUCCESS:
            return {
                ...state,
                lesson: action.payload,
                error: ''
            };
        case LESSON_FAILURE:
            return {
                ...state,
                //lesson: '',
                error: action.payload
            };
        case FETCH_SEARCH_LESSONS_REQUEST:
            return {
                ...state,
                lessons: action.lessons,
                error: ''
            };
        case FETCH_ALL_STUDENT_LESSONS_REQUEST:
            return {
                ...state,
                lessons: action.payload,
                totalElements: action.totalElements,
                totalPages: action.totalPages,
                error: ''
            };
        default: 
        return state;
    }
};

export default reducer;