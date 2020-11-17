import {
    SAVE_PRICE_TABLE_REQUEST, FETCH_PRICE_TABLE_REQUEST, UPDATE_PRICE_TABLE_REQUEST,
    DELETE_PRICE_TABLE_REQUEST, PRICE_TABLE_SUCCESS, PRICE_TABLE_FAILURE,
    FETCH_ALL_PRICE_TABLES_REQUEST, FETCH_ALL_PRICE_TABLES_SUCCESS
} from "./priceTableTypes";
import axios from 'axios';

export const fetchAllPriceTables = (firstElement) => {
    return dispatch => {
        axios.get("https://surf-school-schedule.herokuapp.com/priceTable-api/list?page=0&size=9999999&sortBy=minNrHours&sortDir=asc")
            .then(response => {
                if (firstElement) {
                    response.data.content.unshift(firstElement);
                    response.data.content = response.data.content.filter((item, index, self) =>
                        index === self.findIndex((e) => (
                            e.id === item.id)
                        ));
                }
                dispatch(fetchAllPriceTablesSuccess(response.data.content));
            })
            .catch(error => {
                dispatch(priceTableFailure(error.message));
            });
    };
};

const fetchAllPriceTablesRequest = () => {
    return {
        type: FETCH_ALL_PRICE_TABLES_REQUEST
    };
};

export const savePriceTable = priceTable => {
    return dispatch => {
        axios.post("https://surf-school-schedule.herokuapp.com/priceTable-api/list", priceTable)
            .then(response => {
                //  dispatch(priceTableSuccess(response.data));
                dispatch(savePriceTableRequest(priceTable));
            })
            .catch(error => {
                console.log(error);
                dispatch(priceTableFailure(error));
            });
    };
};

const savePriceTableRequest = priceTable => {
    return {
        type: SAVE_PRICE_TABLE_REQUEST,
        newItem: priceTable
    };
};

const fetchPriceTableRequest = updatedPriceTable => {
    return {
        type: FETCH_PRICE_TABLE_REQUEST,
        updatedPriceTable: updatedPriceTable
    };
};

export const fetchPriceTable = priceTableId => {
    return dispatch => {
        axios.get("https://surf-school-schedule.herokuapp.com/priceTable-api/" + priceTableId)
            .then(response => {
                dispatch(fetchPriceTableRequest(response.data));
                //dispatch(priceTableSuccess(response.data.content));
            })
            .catch(error => {
                dispatch(priceTableFailure(error));
            });
    };
};


export const fetchPriceTableWithNrOfLessons = fullNrOfLessons => {
    return dispatch => {
        axios.get("https://surf-school-schedule.herokuapp.com/priceTable-api/fullNrOfLessons/" + fullNrOfLessons)
            .then(response => {

                dispatch(fetchPriceTableRequest(response.data));
                //dispatch(priceTableSuccess(response.data.content));
            })
            .catch(error => {
                dispatch(priceTableFailure(error));
            });
    };
};

const updatePriceTableRequest = priceTable => {
    return {
        type: UPDATE_PRICE_TABLE_REQUEST,
        updatedPriceTable: priceTable
    };
};

export const updatePriceTable = priceTable => {
    //console.log(priceTable);
    priceTable.NrHoursWeek = 0;
    priceTable.NrHoursFull = 0;
    priceTable.WeekWage = 0;
    //console.log(priceTable);

    return dispatch => {
        axios.put("https://surf-school-schedule.herokuapp.com/priceTable-api/" + priceTable.id, priceTable)
            .then(response => {
                dispatch(updatePriceTableRequest(priceTable));

                // dispatch(priceTableSuccess(response.data));
            })
            .catch(error => {
                console.log(error);
                dispatch(priceTableFailure(error));
            });
    };
};

const deletePriceTableRequest = priceTableId => {
    return {
        type: DELETE_PRICE_TABLE_REQUEST,
        priceTableId: priceTableId
    };
};

export const deletePriceTable = priceTableId => {
    return dispatch => {
        axios.delete("https://surf-school-schedule.herokuapp.com/priceTable-api/list/" + priceTableId)
            .then(response => {
                dispatch(deletePriceTableRequest(priceTableId));
                //console.log(response);
                dispatch(priceTableSuccess(response.data));
            })
            .catch(error => {
                dispatch(priceTableFailure(error));
            });
    };
};


const priceTableSuccess = priceTable => {
    return {
        type: PRICE_TABLE_SUCCESS,
        payload: priceTable
    };
};

const priceTableFailure = error => {
    return {
        type: PRICE_TABLE_FAILURE,
        payload: error
    };
};

const fetchAllPriceTablesSuccess = (priceTables, totalPages, totalElements, sortDirection) => {
    return {
        type: FETCH_ALL_PRICE_TABLES_SUCCESS,
        payload: priceTables,
    };
};




