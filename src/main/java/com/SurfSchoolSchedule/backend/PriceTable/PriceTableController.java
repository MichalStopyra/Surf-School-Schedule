package com.SurfSchoolSchedule.backend.PriceTable;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/priceTable-api")
@CrossOrigin
public class PriceTableController {


    @Autowired
    private PriceTableService priceTableService;


    @GetMapping("/list")
    public ResponseEntity<Page<PriceTable>> getAll(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "5") Integer size,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = Sort.by(
                sortDir.equalsIgnoreCase("asc") ? (Sort.Order.asc("minNrHours")) : (Sort.Order.desc("minNrHours"))
        );

        return new ResponseEntity<>(
                priceTableService.getAll(
                        PageRequest.of(
                                page, size, sort)
                )
                , HttpStatus.OK);
    }


    @GetMapping("/{id}")
    public PriceTable getPriceTablesById(@PathVariable("id") long id) {
        PriceTable priceTable = priceTableService.getPriceTable(id);
        if (priceTable == null) {
            throw new RuntimeException("No priceTable with id = " + id);
        }
        return priceTable;
    }

    @GetMapping("/fullNrOfLessons/{fullNrOfLessons}")
    public PriceTable getPriceTablesByFullNrOfHours(@PathVariable("fullNrOfLessons") int fullNrOfLessons, Pageable pageable ) {
        PriceTable priceTable = priceTableService.getPriceTableByFullNrOfHours(pageable, fullNrOfLessons);
        if (priceTable == null) {
            throw new RuntimeException("No priceTable for this nr of lessons " + fullNrOfLessons);
        }
        return priceTable;
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<PriceTable> updatePriceTable(@PathVariable("id") long id, @RequestBody PriceTable priceTable, Pageable pageable) {
        return new ResponseEntity<>(priceTableService.updatePriceTable(pageable, priceTable, id), HttpStatus.OK);
    }

    @RequestMapping(value = "/list", method = RequestMethod.POST)
    public ResponseEntity<PriceTable> addNewPriceTable(@RequestBody PriceTable priceTableObj, Pageable pageable) {
        return new ResponseEntity<>(priceTableService.addNewPriceTable(pageable, priceTableObj), HttpStatus.CREATED);
    }

    @DeleteMapping("/list/{id}")
    public void deletePriceTable(@PathVariable("id") long priceTableId) {
        priceTableService.deletePriceTable(priceTableId);
    }
}
