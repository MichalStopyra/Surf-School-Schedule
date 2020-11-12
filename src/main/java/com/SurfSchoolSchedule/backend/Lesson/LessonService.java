package com.SurfSchoolSchedule.backend.Lesson;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public interface LessonService <T> {

    public Page<T> getAll(Pageable pageable);
    public Iterable<T> getAll(Sort sort);

    Lesson addNewLesson (Pageable pageable, Lesson newLesson);

    public Lesson getLesson (long id);

    void deleteLesson(long lessonId);

    void updateLesson(Pageable pageable, Lesson lesson, long id);

    public Page<T>  getLessonsForInstructorAtDate(Pageable pageable, String date, Long idInstructor);
    public Page<T> getAllStudentLessons(Pageable pageable, Long idStudent);
}
