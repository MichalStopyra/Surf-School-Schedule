package com.SurfSchoolSchedule.backend.Lesson;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public interface LessonService <T> {

    public Page<T> getAll(Pageable pageable);
    public Iterable<T> getAll(Sort sort);

    Lesson addNewLesson (Pageable pageable, Lesson newLesson);



    void deleteLesson(long lessonId);

    void updateLesson(Lesson lesson, long id);
    
}
