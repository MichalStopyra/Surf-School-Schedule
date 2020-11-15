package com.SurfSchoolSchedule.backend.WeekInstructor;

import com.SurfSchoolSchedule.backend.Instructor.Instructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface WeekInstructorService<T> {
    public Page<T> getAll(Pageable pageable);

    public Page<T> getAllWeekInstructorForInstructor(Pageable pageable, Long instructorId);
    public WeekInstructor getWeekInstructorForInstructorForGivenDate(Pageable pageable, Long instructorId, String date);


    WeekInstructor addNewWeekInstructor (Pageable pageable, WeekInstructor newWeekInstructor);

    public WeekInstructor getWeekInstructor (long id);



    void deleteWeekInstructor(long weekInstructorId);

    void updateWeekInstructor(Pageable pageable, WeekInstructor weekInstructor, long id);

    public void setValues(Pageable pageable, WeekInstructor weekInstructor, Instructor instructor);
    public void setStatus(Pageable pageable, WeekInstructor weekInstructor, WeekInstructor.Status status);

}
