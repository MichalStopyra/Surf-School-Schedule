package com.SurfSchoolSchedule.backend.Student;

import com.SurfSchoolSchedule.backend.AbstractEntity;
import com.SurfSchoolSchedule.backend.Lesson.Lesson;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.sun.istack.NotNull;

import javax.persistence.*;
import java.util.LinkedList;
import java.util.List;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Student extends AbstractEntity {

    public enum PaymentStatus{
        Settled, We_Owe, Owes_Us
    }

    @NotNull
    @Column
    private String firstName;

    @NotNull
    @Column
    private String lastName;

    @NotNull
    @Column
    private  int idCardNr;

    @NotNull
    @Column
    private long telNr;

    @Column
    private int lessonHours;

    @Column
    private int unpaidLessons;


    @Column
    private int moneyInAdvance;

    @Column
    @NotNull
    private Student.PaymentStatus paymentStatus;

    @JsonIgnore
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    @PrimaryKeyJoinColumn
    private List<Lesson> lessons = new LinkedList<>();

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public int getIdCardNr() {
        return idCardNr;
    }

    public void setIdCardNr(int idCardNr) {
        this.idCardNr = idCardNr;
    }

    public long getTelNr() {
        return telNr;
    }

    public void setTelNr(long telNr) {
        this.telNr = telNr;
    }

    public int getLessonHours() {
        return lessonHours;
    }

    public void setLessonHours(int lessonHours) {
        this.lessonHours = lessonHours;
    }

    public int getUnpaidLessons() {
        return unpaidLessons;
    }

    public void setUnpaidLessons(int unpaidLessons) {
        this.unpaidLessons = unpaidLessons;
    }

    public int getMoneyInAdvance() {
        return moneyInAdvance;
    }

    public void setMoneyInAdvance(int moneyInAdvance) {
        this.moneyInAdvance = moneyInAdvance;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    @JsonIgnore
    public List<Lesson> getLessons() {
        return lessons;
    }

    @JsonProperty
    public void setLessons(List<Lesson> lessons) {
        this.lessons = lessons;
    }

    public void setAllFormValues(Student newStudent) {
        this.setLastName(newStudent.getLastName());
        this.setFirstName(newStudent.getFirstName());
        this.setIdCardNr(newStudent.getIdCardNr());
        this.setTelNr(newStudent.getTelNr());
        this.setMoneyInAdvance(newStudent.getMoneyInAdvance());
    }
}
