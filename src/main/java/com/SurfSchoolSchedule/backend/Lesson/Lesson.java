package com.SurfSchoolSchedule.backend.Lesson;

import com.SurfSchoolSchedule.backend.AbstractEntity;
import com.SurfSchoolSchedule.backend.Instructor.Instructor;
import com.SurfSchoolSchedule.backend.Student.Student;
import com.sun.istack.NotNull;

import javax.persistence.*;

@Entity
public class Lesson extends AbstractEntity {


    public enum Status{
        To_Give, Finished_Paid, Finished_Unpaid
    }

    @NotNull
    @ManyToOne
    @JoinColumn (name = "FK_IdStudent")
    private Student student;

    @NotNull
    @ManyToOne
    @JoinColumn (name = "FK_IdInstructor")
    private Instructor instructor;

    @NotNull
    private String date;

    @NotNull
    private String time;

    @NotNull
    private Double howLong;

   // @NotNull
    private int nrStudents;

    //@NotNull
    @Enumerated(EnumType.STRING)
    private Lesson.Status status;

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Instructor getInstructor() {
        return instructor;
    }

    public void setInstructor(Instructor instructor) {
        this.instructor = instructor;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public int getNrStudents() {
        return nrStudents;
    }

    public void setNrStudents(int nrStudents) {
        this.nrStudents = nrStudents;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Double getHowLong() {
        return howLong;
    }

    public void setHowLong(Double howLong) {
        this.howLong = howLong;
    }

    public void setAllFormValues(Lesson newLesson) {
        this.setInstructor(newLesson.getInstructor());
        this.setStudent(newLesson.getStudent());
        this.setDate(newLesson.getDate());
        this.setTime(newLesson.getTime());
        this.setNrStudents(newLesson.getNrStudents());
        this.setHowLong(newLesson.getHowLong());
        this.setStatus(newLesson.getStatus());
    }
}
