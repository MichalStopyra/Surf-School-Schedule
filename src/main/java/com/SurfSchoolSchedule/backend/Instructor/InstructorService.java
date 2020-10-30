package com.SurfSchoolSchedule.backend.Instructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public interface InstructorService<T> {
    
    public Page<T> getAll (Pageable pageable);
    public Iterable<T> getAll (Sort sort);

    public Instructor getInstructor (long id);

    Page<T> getInstructorsByName (Pageable pageable, String name);
    
    Instructor addNewInstructor (Pageable pageable, Instructor newInstructor);

    void deleteInstructor(long instructorId);

    Instructor updateInstructor(Instructor instructor, long id, Pageable pageable);
}
