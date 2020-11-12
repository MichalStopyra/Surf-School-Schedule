package com.SurfSchoolSchedule.backend.PriceTable;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PriceTableRepository extends JpaRepository<PriceTable, Long > {
    @Query("select pt from PriceTable pt " +
            "where  pt.minNrHours = :minNrHours and pt.onePPrice = :onePPrice " +
            "and pt.twoPPrice = :twoPPrice and pt.threePPrice = :threePPrice")
    Page<PriceTable> findByPrices(Pageable pageable, @Param("minNrHours") int minNrHours, @Param("onePPrice") Double onePPrice,
                                  @Param("twoPPrice") Double twoPPrice, @Param("threePPrice") Double threePPrice);


    @Query("select pt from PriceTable pt " +
            "where  pt.minNrHours <= :fullNrOfHours " +
            "order by pt.minNrHours desc")
    Page<PriceTable> findByFullNrOfLessons(Pageable pageable, @Param("fullNrOfHours") int fullNrOfHours);
}
