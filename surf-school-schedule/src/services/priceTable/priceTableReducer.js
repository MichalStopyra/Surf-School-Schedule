import {
    SAVE_PRICE_TABLE_REQUEST, FETCH_PRICE_TABLE_REQUEST, UPDATE_PRICE_TABLE_REQUEST, DELETE_PRICE_TABLE_REQUEST, 
    FETCH_ALL_PRICE_TABLES_REQUEST, FETCH_ALL_PRICE_TABLES_SUCCESS,
    PRICE_TABLE_SUCCESS, PRICE_TABLE_FAILURE
} from "./priceTableTypes";

const initialState = {
    priceTable: '',
    error: '',
    priceTables: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ALL_PRICE_TABLES_REQUEST:
            return {
                ...state
            };
        case UPDATE_PRICE_TABLE_REQUEST:
            console.log(action);
            return {
                ...state,
                priceTable: action.updatedPriceTable,
                //update specific priceTable
                priceTables: state.priceTables.map((item, index) => {
                    // Replace the item at index = updatedPriceTable
                    if (index === action.updatedPriceTable.id) {
                        return action.updatedPriceTable;
                    }
                    // Leave every other item unchanged
                    return item;
                })
            };
        case FETCH_PRICE_TABLE_REQUEST:
            return {
                ...state,
                priceTable: action.updatedPriceTable
            };
        case SAVE_PRICE_TABLE_REQUEST:
            return {
                ...state,
                priceTables: state.priceTables.concat(action.newItem),
                priceTable: action.newItem
            };
        case DELETE_PRICE_TABLE_REQUEST:
            return {
                ...state,
                priceTables: state.priceTables.filter(item => item.id !== action.priceTableId),
            };
        case PRICE_TABLE_SUCCESS:
            return {
                ...state,
                priceTable: action.payload,
                error: ''
            };
        case PRICE_TABLE_FAILURE:
            return {
                ...state,
                //priceTable: '',
                error: action.payload
            };
        case FETCH_ALL_PRICE_TABLES_SUCCESS:
            return {
                ...state,
                priceTables: action.payload,
                error: ''
            };
        default: return state;
    }
};

export default reducer;