import {
    SAVE_LESSON_REQUEST, FETCH_LESSON_REQUEST, UPDATE_LESSON_REQUEST,
    DELETE_LESSON_REQUEST, LESSON_SUCCESS, LESSON_FAILURE,
    FETCH_ALL_LESSONS_REQUEST,
    FETCH_SEARCH_LESSONS_REQUEST
} from "./lessonTypes";
import axios from 'axios';

export const fetchAllLessons = (currentPage, size, sortDir) => {
    --currentPage;
    return dispatch => {
        // dispatch(fetchAllLessonsRequest());???????????????????????????
        axios.get("http://localhost:8080/lesson-api/list?page=" + currentPage + "&size=" + size + "&sortBy=status&sortDir=" + sortDir)
            .then(response => {
                dispatch(fetchAllLessonsRequest(response.data.content, response.data.totalPages, response.data.totalElements, sortDir));
            })
            .catch(error => {
                dispatch(lessonFailure(error.message));
            });
    };
};

const fetchAllLessonsRequest = (lessons, totalPages, totalElements, sortDirection) => {
    return {
        type: FETCH_ALL_LESSONS_REQUEST,
        payload: lessons,
        totalPages: totalPages,
        totalElements: totalElements,
        sortDirection: sortDirection
    };
};

export const saveLesson = lesson => {
    return dispatch => {
        axios.post("http://localhost:8080/lesson-api/list", lesson)
            .then(response => {
                dispatch(saveLessonRequest(lesson));
            })
            .catch(error => {
                console.log(error);
                dispatch(lessonFailure(error));
            });
    };
};

const saveLessonRequest = lesson => {
    return {
        type: SAVE_LESSON_REQUEST,
        newItem: lesson
    };
};

const fetchLessonRequest = updatedLesson => {
    return {
        type: FETCH_LESSON_REQUEST,
        updatedLesson: updatedLesson
    };
};

export const fetchLesson = lessonId => {
    return dispatch => {
        axios.get("http://localhost:8080/lesson-api/" + lessonId)
            .then(response => {
                dispatch(fetchLessonRequest(response.data));
                //dispatch(lessonSuccess(response.data.content));
            })
            .catch(error => {
                dispatch(lessonFailure(error));
            });
    };
};

const updateLessonRequest = lesson => {
    return {
        type: UPDATE_LESSON_REQUEST,
        updatedLesson: lesson
    };
};

export const updateLesson = lesson => {
    //console.log(lesson);
    // lesson.NrHoursWeek = 0;
    // lesson.NrHoursFull = 0;
    // lesson.WeekWage = 0;
    //console.log(lesson);

    return dispatch => {
        axios.put("http://localhost:8080/lesson-api/" + lesson.id, lesson)
            .then(response => {
                dispatch(updateLessonRequest(lesson));

                // dispatch(lessonSuccess(response.data));
            })
            .catch(error => {
                console.log(error);
                dispatch(lessonFailure(error));
            });
    };
};

const deleteLessonRequest = lessonId => {
    return {
        type: DELETE_LESSON_REQUEST,
        lessonId: lessonId
    };
};

export const deleteLesson = lessonId => {
    return dispatch => {
        axios.delete("http://localhost:8080/lesson-api/list/" + lessonId)
            .then(response => {
                dispatch(deleteLessonRequest(lessonId));
                //console.log(response);
                dispatch(lessonSuccess(response.data));
            })
            .catch(error => {
                dispatch(lessonFailure(error));
            });
    };
};


const lessonSuccess = lesson => {
    return {
        type: LESSON_SUCCESS,
        payload: lesson
    };
};

const lessonFailure = error => {
    return {
        type: LESSON_FAILURE,
        payload: error
    };
};


export const searchLessons = (searchedValue, currentPage, lessonsPerPage) => {
    --currentPage;
    return dispatch => {
        axios.get("http://localhost:8080/lesson-api/search/" + searchedValue + "?page=" + currentPage + "&size=" + lessonsPerPage)
            .then(response => {
                dispatch(searchLessonsRequest(response.data.content));
            })
            .catch(error => {
                dispatch(lessonFailure(error.message));
            });
    };
};


const searchLessonsRequest = lessons => {
    return {
        type: FETCH_SEARCH_LESSONS_REQUEST,
        lessons: lessons
    };
};


