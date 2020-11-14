package com.SurfSchoolSchedule.backend.Lesson;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface LessonRepository extends PagingAndSortingRepository<Lesson, Long> {

    @Query("select l from Lesson l " +
            "where l.date like :lessonDate and l.time like :lessonTime " +
            "and (l.instructor.id = :instructorId or l.student.id = :studentId) " +
            "and l.id != nvl(:lessonId, -1)")
    Page<Lesson> alreadyExists(Pageable pageable, @Param("studentId") Long studentId, @Param("instructorId") Long instructorId,
                               @Param("lessonDate") String lessonDate, @Param("lessonTime") String lessonTime, @Param("lessonId") Long lessonId);
    @Query("select l from Lesson l " +
            "where l.date like :lessonDate and l.time like :lessonTime " +
            "and l.student.id = :studentId and l.howLong > :howLongToCoincide")
    Page<Lesson> studentDoesntHaveCoincidingLesson(Pageable pageable, @Param("studentId") Long studentId, @Param("lessonDate") String lessonDate,
                                                   @Param("lessonTime") String lessonTime, @Param("howLongToCoincide") Double howLongToCoincide);


    @Query("select l from Lesson l " +
            "where l.date like :lessonDate and l.instructor.id = :idInstructor")
    Page<Lesson> findLessonsForInstructorAtDate(Pageable pageable, @Param("idInstructor") Long idInstructor, @Param("lessonDate") String lessonDate);

    @Query("select l from Lesson l " +
            "where l.student.id = :idStudent")
    Page<Lesson> getAllStudentLessons(Pageable pageable, @Param("idStudent") Long idStudent);

    @Query("select l from Lesson l " +
            "where l.instructor.id = :idInstructor")
    Page<Lesson> getAllInstructorLessons(Pageable pageable, @Param("idInstructor") Long idInstructor);

    @Query("SELECT COALESCE(SUM(l.howLong), 0) FROM Lesson l WHERE l.student.id = :idStudent AND lower (l.status) like 'finished_unpaid'")
    Integer countUnpaidLessons( @Param("idStudent") Long idStudent);

    @Query("SELECT COALESCE(SUM(l.howLong), 0) FROM Lesson l WHERE l.student.id = :idStudent AND LOWER (l.status) NOT LIKE 'not_given' AND LOWER (l.status) NOT LIKE 'to_give' ")
    Integer countLessonHours(@Param("idStudent") Long idStudent);

    @Query("SELECT COALESCE(SUM(l.howLong), 0) FROM Lesson l WHERE l.instructor.id = :idInstructor AND LOWER (l.status) NOT LIKE 'not_given' AND LOWER (l.status) NOT LIKE 'to_give' ")
    Integer countFullNrLessonsForInstructor(@Param("idInstructor") Long idInstructor);
}
