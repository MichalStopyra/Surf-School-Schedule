import {combineReducers} from 'redux';
import instructorReducer from './instructor/instructorReducer';
import studentReducer from './student/studentReducer';
import lessonReducer from './lesson/lessonReducer';

//import authReducer from './instructor/auth/authReducer';

const rootReducer = combineReducers({
    instructor: instructorReducer,
    student: studentReducer,
    lesson: lessonReducer
});

export default rootReducer;