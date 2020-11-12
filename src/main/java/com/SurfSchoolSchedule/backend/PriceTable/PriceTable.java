package com.SurfSchoolSchedule.backend.PriceTable;

import com.SurfSchoolSchedule.backend.AbstractEntity;
import com.sun.istack.NotNull;

import javax.persistence.Entity;

@Entity
public class PriceTable extends AbstractEntity {


    @NotNull
    private String name;

    @NotNull
    private int minNrHours;

    @NotNull
    private Double onePPrice;

    @NotNull
    private Double twoPPrice;

    //3+people
    @NotNull
    private Double threePPrice;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getMinNrHours() {
        return minNrHours;
    }

    public void setMinNrHours(int minNrHours) {
        this.minNrHours = minNrHours;
    }

    public Double getOnePPrice() {
        return onePPrice;
    }

    public void setOnePPrice(Double onePPrice) {
        this.onePPrice = onePPrice;
    }

    public Double getTwoPPrice() {
        return twoPPrice;
    }

    public void setTwoPPrice(Double twoPPrice) {
        this.twoPPrice = twoPPrice;
    }

    public Double getThreePPrice() {
        return threePPrice;
    }

    public void setThreePPrice(Double threePPrice) {
        this.threePPrice = threePPrice;
    }

    public void setAllValues(PriceTable newPriceTable) {
        this.setName(newPriceTable.getName());
        this.setMinNrHours(newPriceTable.getMinNrHours());
        this.setOnePPrice(newPriceTable.getOnePPrice());
        this.setTwoPPrice(newPriceTable.getTwoPPrice());
        this.setThreePPrice(newPriceTable.getThreePPrice());

    }


}
