package com.SurfSchoolSchedule.backend.Instructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
public class InstructorServiceImpl implements InstructorService<Instructor> {


    @Autowired
    InstructorRepository instructorRepository;

    @Transactional
    @Override
    public Page<Instructor> getAll(Pageable pageable) {
        return instructorRepository.findAll(pageable);
    }

    @Transactional
    @Override
    public Iterable<Instructor> getAll(Sort sort) {
        return instructorRepository.findAll(sort);
    }

    @Transactional
    @Override
    public Instructor getInstructor(long id) {
        return instructorRepository.findById(id).get();
    }

    @Transactional
    @Override
    public Page<Instructor> getInstructorsByName(Pageable pageable, String name) {
        return instructorRepository.search(pageable, name);
    }


    @Transactional
    @Override
    public Instructor addNewInstructor(Pageable pageable, Instructor newInstructor) {
        if (instructorDoesNotExist(pageable, newInstructor))
            return instructorRepository.save(newInstructor);
        else
            throw new RuntimeException("Instructor already in the database");
    }


    @Transactional
    @Override
    public void deleteInstructor(long instructorId) {
        Instructor st = instructorRepository.findById(instructorId).get();
        instructorRepository.delete(st);
    }

    @Transactional
    @Override
    public void updateInstructor(Instructor instructor, long id) {
        Instructor i = instructorRepository.findById(id).get();
        i.setAllFormValues(instructor);
    }


    private boolean instructorDoesNotExist(Pageable pageable, Instructor newInstructor) {
        return instructorRepository.search(pageable, newInstructor.getFirstName().concat(" ".concat(newInstructor.getLastName()))).isEmpty();
    }
}
