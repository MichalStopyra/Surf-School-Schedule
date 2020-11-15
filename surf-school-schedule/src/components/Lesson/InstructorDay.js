import React from 'react';
import Popover from '../Popover';

class InstructorDay extends React.Component {

    getField = (instrDay, index) => {
        if (!instrDay.lessonsThisDay[index])
            return;
        else
            return instrDay.lessonsThisDay[index].student.firstName + " " + instrDay.lessonsThisDay[index].student.lastName + " "
                + instrDay.lessonsThisDay[index].howLong + "h";
    }

    getFieldColor = (instrDay, index) => {
        if (instrDay.lessonsThisDay[index] &&
            (instrDay.lessonsThisDay[index].status === "Finished_Unpaid" || instrDay.lessonsThisDay[index].status === "Finished_Paid"))
            return "info";
        else
            return "secondary";
    };

    //if lesson is in the future - it can't be marked as finished, so no accepting button is displayed
    isNotInFuture = (instrDay, index) => {
        if (instrDay.lessonsThisDay[index]) {
            let tonight = new Date();
            tonight.setHours(23);
            tonight.setMinutes(59);
            tonight.setSeconds(59);
            let temp = new Date(instrDay.lessonsThisDay[index].date);
            return (temp < tonight)
        }
    }
    render() {
        return (
            this.props.instructorDay.map((instrDay, index) => (
                <tr key={instrDay.instructor.id}>
                    <td >{instrDay.instructor.firstName + " " + instrDay.instructor.lastName}</td>
                    <td>
                        <Popover lessonStatusChange={() => this.props.lessonStatusChange(instrDay.lessonsThisDay[0], "Finished_Unpaid")}
                            deleteLesson={() => this.props.deleteLesson(instrDay.lessonsThisDay[0], index)}
                            data={this.getField(instrDay, 0)} buttonColor={this.getFieldColor(instrDay, 0)}
                            isNotInFuture={this.isNotInFuture(instrDay, 0)}
                            changeShowForm={() => this.props.changeShowForm(instrDay.instructor, index, 0)}
                            editLesson={() => this.props.editLesson(instrDay.lessonsThisDay[0], index, 0)} />
                    </td>
                    <td>
                        <Popover lessonStatusChange={() => this.props.lessonStatusChange(instrDay.lessonsThisDay[1], "Finished_Unpaid")}
                            deleteLesson={() => this.props.deleteLesson(instrDay.lessonsThisDay[1], index)}
                            data={this.getField(instrDay, 1)} buttonColor={this.getFieldColor(instrDay, 1)}
                            isNotInFuture={this.isNotInFuture(instrDay, 1)}
                            changeShowForm={() => this.props.changeShowForm(instrDay.instructor, index, 1)}
                            editLesson={() => this.props.editLesson(instrDay.lessonsThisDay[1], index, 1)} />
                    </td>
                    <td>
                        <Popover lessonStatusChange={() => this.props.lessonStatusChange(instrDay.lessonsThisDay[2], "Finished_Unpaid")}
                            deleteLesson={() => this.props.deleteLesson(instrDay.lessonsThisDay[2], index)}
                            data={this.getField(instrDay, 2)} buttonColor={this.getFieldColor(instrDay, 2)}
                            isNotInFuture={this.isNotInFuture(instrDay, 2)}
                            changeShowForm={() => this.props.changeShowForm(instrDay.instructor, index, 2)}
                            editLesson={() => this.props.editLesson(instrDay.lessonsThisDay[2], index, 2)} />
                    </td>
                    <td>
                        <Popover lessonStatusChange={() => this.props.lessonStatusChange(instrDay.lessonsThisDay[3], "Finished_Unpaid")}
                            deleteLesson={() => this.props.deleteLesson(instrDay.lessonsThisDay[3], index)}
                            data={this.getField(instrDay, 3)} buttonColor={this.getFieldColor(instrDay, 3)}
                            isNotInFuture={this.isNotInFuture(instrDay, 3)}
                            changeShowForm={() => this.props.changeShowForm(instrDay.instructor, index, 3)}
                            editLesson={() => this.props.editLesson(instrDay.lessonsThisDay[3], index, 3)} />
                    </td>
                    <td>
                        <Popover lessonStatusChange={() => this.props.lessonStatusChange(instrDay.lessonsThisDay[4], "Finished_Unpaid")}
                            deleteLesson={() => this.props.deleteLesson(instrDay.lessonsThisDay[4], index)}
                            data={this.getField(instrDay, 4)} buttonColor={this.getFieldColor(instrDay, 4)}
                            isNotInFuture={this.isNotInFuture(instrDay, 4)}
                            changeShowForm={() => this.props.changeShowForm(instrDay.instructor, index, 4)}
                            editLesson={() => this.props.editLesson(instrDay.lessonsThisDay[4], index, 4)} />
                    </td>
                    <td>
                        <Popover lessonStatusChange={() => this.props.lessonStatusChange(instrDay.lessonsThisDay[5], "Finished_Unpaid")}
                            deleteLesson={() => this.props.deleteLesson(instrDay.lessonsThisDay[5], index)}
                            data={this.getField(instrDay, 5)} buttonColor={this.getFieldColor(instrDay, 5)}
                            isNotInFuture={this.isNotInFuture(instrDay, 5)}
                            changeShowForm={() => this.props.changeShowForm(instrDay.instructor, index, 5)}
                            editLesson={() => this.props.editLesson(instrDay.lessonsThisDay[5], index, 5)} />
                    </td>
                    <td>
                        <Popover lessonStatusChange={() => this.props.lessonStatusChange(instrDay.lessonsThisDay[6], "Finished_Unpaid")}
                            deleteLesson={() => this.props.deleteLesson(instrDay.lessonsThisDay[6], 6)}
                            data={this.getField(instrDay, 6)} buttonColor={this.getFieldColor(instrDay, 6)}
                            isNotInFuture={this.isNotInFuture(instrDay, 6)}
                            changeShowForm={() => this.props.changeShowForm(instrDay.instructor, index, 6)}
                            editLesson={() => this.props.editLesson(instrDay.lessonsThisDay[6], index, 6)} />
                    </td>
                    <td>
                        <Popover lessonStatusChange={() => this.props.lessonStatusChange(instrDay.lessonsThisDay[7], "Finished_Unpaid")}
                            deleteLesson={() => this.props.deleteLesson(instrDay.lessonsThisDay[7], index)}
                            data={this.getField(instrDay, 7)} buttonColor={this.getFieldColor(instrDay, 7)}
                            isNotInFuture={this.isNotInFuture(instrDay, 7)}
                            changeShowForm={() => this.props.changeShowForm(instrDay.instructor, index, 7)}
                            editLesson={() => this.props.editLesson(instrDay.lessonsThisDay[7], index, 7)} />
                    </td>
                    <td>
                        <Popover lessonStatusChange={() => this.props.lessonStatusChange(instrDay.lessonsThisDay[8], "Finished_Unpaid")}
                            deleteLesson={() => this.props.deleteLesson(instrDay.lessonsThisDay[8], index)}
                            data={this.getField(instrDay, 8)} buttonColor={this.getFieldColor(instrDay, 8)}
                            isNotInFuture={this.isNotInFuture(instrDay, 8)}
                            changeShowForm={() => this.props.changeShowForm(instrDay.instructor, index, 8)}
                            editLesson={() => this.props.editLesson(instrDay.lessonsThisDay[8], index, 8)} />
                    </td>
                    <td>
                        <Popover lessonStatusChange={() => this.props.lessonStatusChange(instrDay.lessonsThisDay[9], "Finished_Unpaid")}
                            deleteLesson={() => this.props.deleteLesson(instrDay.lessonsThisDay[9], index)}
                            data={this.getField(instrDay, 9)} buttonColor={this.getFieldColor(instrDay, 9)}
                            isNotInFuture={this.isNotInFuture(instrDay, 9)}
                            changeShowForm={() => this.props.changeShowForm(instrDay.instructor, index, 9)}
                            editLesson={() => this.props.editLesson(instrDay.lessonsThisDay[9], index, 9)} />
                    </td>
                    <td>
                        <Popover lessonStatusChange={() => this.props.lessonStatusChange(instrDay.lessonsThisDay[10], "Finished_Unpaid")}
                            deleteLesson={() => this.props.deleteLesson(instrDay.lessonsThisDay[10], index)}
                            data={this.getField(instrDay, 10)} buttonColor={this.getFieldColor(instrDay, 10)}
                            isNotInFuture={this.isNotInFuture(instrDay, 10)}
                            changeShowForm={() => this.props.changeShowForm(instrDay.instructor, index, 10)}
                            editLesson={() => this.props.editLesson(instrDay.lessonsThisDay[10], index, 10)} />
                    </td>
                    <td>
                        <Popover lessonStatusChange={() => this.props.lessonStatusChange(instrDay.lessonsThisDay[11], "Finished_Unpaid")}
                            deleteLesson={() => this.props.deleteLesson(instrDay.lessonsThisDay[11], index)}
                            data={this.getField(instrDay, 11)} buttonColor={this.getFieldColor(instrDay, 11)}
                            isNotInFuture={this.isNotInFuture(instrDay, 11)}
                            changeShowForm={() => this.props.changeShowForm(instrDay.instructor, index, 11)}
                            editLesson={() => this.props.editLesson(instrDay.lessonsThisDay[11], index, 11)} />
                    </td>

                </tr>
            ))
        )
    }
}
export default InstructorDay;