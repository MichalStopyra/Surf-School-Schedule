package com.SurfSchoolSchedule.backend.Student;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface StudentRepository extends PagingAndSortingRepository<Student, Long> {

    @Query("select s from Student s " +
            "where lower(s.firstName) like lower(concat('%', :searchTerm, '%')) " +
            "or lower(s.lastName) like lower(concat('%', :searchTerm, '%')) " +
            "or lower(concat( concat(s.firstName, ' '), s.lastName)) like lower(concat('%', :searchTerm, '%'))")
    Page<Student> search(Pageable pageable, @Param("searchTerm") String searchTerm);

    @Query("select s from Student s " +
            "where lower(s.firstName) like lower(concat('%', :searchTerm, '%')) " +
            "or lower(s.lastName) like lower(concat('%', :searchTerm, '%')) " +
            "or lower(concat( concat(s.firstName, ' '), s.lastName)) like lower(concat('%', :searchTerm, '%')) " +
            "and s.id != :studentId")
    Page<Student> otherStudentWithThisName(Pageable pageable, @Param("studentId") Long id,@Param("searchTerm") String searchTerm);
}
