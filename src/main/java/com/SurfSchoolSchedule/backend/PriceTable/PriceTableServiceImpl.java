package com.SurfSchoolSchedule.backend.PriceTable;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class PriceTableServiceImpl implements PriceTableService<PriceTable> {


    @Autowired
    PriceTableRepository priceTableRepository;

    @Transactional
    @Override
    public Page<PriceTable> getAll(Pageable pageable) {
        return priceTableRepository.findAll(pageable);
    }

    @Transactional
    @Override
    public Iterable<PriceTable> getAll(Sort sort) {
        return priceTableRepository.findAll(sort);
    }

    @Transactional
    @Override
    public PriceTable getPriceTable(long id) {
        return priceTableRepository.findById(id).get();
    }

    @Transactional
    @Override
    public PriceTable getPriceTableByFullNrOfHours(Pageable pageable, int fullNrOfHours) {
        Page<PriceTable> priceTablePage = priceTableRepository.findByFullNrOfLessons(pageable, fullNrOfHours);
        List<PriceTable> priceTableList = priceTablePage.getContent();
        return priceTableList.get(0);
    }



    @Transactional
    @Override
    public PriceTable addNewPriceTable(Pageable pageable, PriceTable newPriceTable) {
        if (priceTableDoesNotExist(pageable, newPriceTable))
            return priceTableRepository.save(newPriceTable);
        else
            throw new RuntimeException("PriceTable already in the database");
    }


    @Transactional
    @Override
    public void deletePriceTable(long priceTableId) {
        PriceTable instr = priceTableRepository.findById(priceTableId).get();
        priceTableRepository.delete(instr);
    }

    @Transactional
    @Override
    public PriceTable updatePriceTable(Pageable pageable, PriceTable priceTable, long id) {
        if (priceTableDoesNotExist(pageable, priceTable)) {
            PriceTable pt = priceTableRepository.findById(id).get();
            pt.setAllValues(priceTable);
            return pt;
        } else {
            throw new RuntimeException("Can't update - PriceTable already in the database");
        }
    }


    private boolean priceTableDoesNotExist(Pageable pageable, PriceTable newPriceTable) {
        return priceTableRepository.findByPrices(pageable, newPriceTable.getMinNrHours(), newPriceTable.getOnePPrice(),
                newPriceTable.getTwoPPrice(), newPriceTable.getThreePPrice()).isEmpty();
    }
//
//    @PostConstruct
//    @Override
//    public void ifPriceTableEmptyPopulateData(Pageable pageable) {
//        if(priceTableRepository.findAll(pageable).isEmpty()) {
//            priceTableRepository.saveAll()
//
//        }
//
//    }
}
