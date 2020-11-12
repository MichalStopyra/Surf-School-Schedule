package com.SurfSchoolSchedule.backend.PriceTable;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public interface PriceTableService <T> {

    public Page<T> getAll(Pageable pageable);
    public Iterable<T> getAll(Sort sort);

    PriceTable addNewPriceTable (Pageable pageable, PriceTable newPriceTable);

    public PriceTable getPriceTable (long id);
    public PriceTable getPriceTableByFullNrOfHours(Pageable pageable, int fullNrOfHours);

    void deletePriceTable(long PriceTableId);

    PriceTable updatePriceTable(Pageable pageable, PriceTable priceTable, long id);

    //public void ifPriceTableEmptyPopulateData(Pageable pageable);

}
