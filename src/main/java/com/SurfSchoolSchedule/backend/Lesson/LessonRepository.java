package com.SurfSchoolSchedule.backend.Lesson;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface LessonRepository extends PagingAndSortingRepository<Lesson, Long> {

    @Query("SELECT COUNT(l.id) FROM Lesson l WHERE l.student = :studentID")
    int countStudentLessons(@Param("studentID") Long studentID);

    @Query("SELECT COUNT(l.id) FROM Lesson l WHERE l.student = :studentID AND lower (l.status) like 'finished_unpaid'")
    int countUnpaidStudentLessons(@Param("studentID") Long studentID);

    @Query("select l from Lesson l " +
            "where l.date like :lessonDate and l.time like :lessonTime " +
            "and (l.instructor.id = :instructorId or l.student.id = :studentId)")
    Page<Lesson> alreadyExists(Pageable pageable, @Param("studentId") Long studentId, @Param("instructorId") Long instructorId,
                               @Param("lessonDate") String lessonDate, @Param("lessonTime") String lessonTime);
    @Query("select l from Lesson l " +
            "where l.date like :lessonDate and l.time like :lessonTime " +
            "and l.student.id = :studentId and l.howLong > :howLongToCoincide")
    Page<Lesson> studentDoesntHaveCoincidingLesson(Pageable pageable, @Param("studentId") Long studentId, @Param("lessonDate") String lessonDate,
                                                   @Param("lessonTime") String lessonTime, @Param("howLongToCoincide") Double howLongToCoincide);


    @Query("select l from Lesson l " +
            "where l.date like :lessonDate and l.instructor.id = :idInstructor")
    Page<Lesson> findLessonsForInstructorAtDate(Pageable pageable, @Param("idInstructor") Long idInstructor, @Param("lessonDate") String lessonDate);

}
