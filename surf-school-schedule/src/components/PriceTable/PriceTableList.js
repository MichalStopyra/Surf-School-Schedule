import React from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import { Alert, Card, Table, ButtonGroup, Button, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyCheckAlt, faEdit, faTrash, faPlusSquare} from '@fortawesome/free-solid-svg-icons';
import SuccessToast from '../SuccessToast';

import './../../style/Style.css';


import { connect } from 'react-redux';
import { deletePriceTable, fetchAllPriceTables } from './../../services/index';

class PriceTableList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            priceTables: []//,
            // currentPage: 1,
            //   priceTablesPerPage: 5,
            //  searchedPriceTable: '',
            //sortToggle: true
        };
    }


    componentDidMount() {
        this.props.fetchAllPriceTables(/*this.props.priceTable.currentPage, this.state.priceTablesPerPage, this.props.priceTable.sortDirection*/);
    }

    deletePriceTable = (idPriceTable) => {

        this.props.deletePriceTable(idPriceTable);

        setTimeout(() => {
            if (this.props.priceTable != null) {
                this.setState({ "show": true });
                setTimeout(() => this.setState({ "show": false }), 1000);

            } else {
                this.setState({ "show": false });
            }
        }, 1000);
        this.props.fetchAllPriceTables(/*this.props.priceTable.currentPage, this.state.priceTablesPerPage, this.props.priceTable.sortDirection, false*/);

    };

    // changePage = event => {
    //     let target = parseInt(event.target.value);
    //     if (this.props.priceTable.searchedPriceTable) {
    //         this.searchPriceTable(target)
    //     } else {
    //         let sortDirection = this.state.sortToggle ? "asc" : "desc";
    //         this.props.fetchAllPriceTables(target, this.state.priceTablesPerPage, this.props.priceTable.sortDirection, false);
    //     }
    //     this.setState({
    //         [event.target.name]: target
    //     });

    // };

    // firstPage = () => {
    //     let firstPage = 1;

    //     if (this.props.priceTable.currentPage > firstPage) {
    //         this.props.priceTable.currentPage = 1;
    //         if (this.props.priceTable.searchedPriceTable) {
    //             this.searchPriceTable(this.props.priceTable.currentPage)
    //         } else {
    //             let sortDirection = this.state.sortToggle ? "asc" : "desc";
    //             this.props.fetchAllPriceTables(this.props.priceTable.currentPage, this.state.priceTablesPerPage, this.props.priceTable.sortDirection);
    //         }
    //     }
    // };

    // prevPage = () => {
    //     if (this.props.priceTable.currentPage > 1) {
    //         --this.props.priceTable.currentPage;
    //         if (this.props.priceTable.searchedPriceTable) {
    //             this.searchPriceTable(this.props.priceTable.currentPage)
    //         } else {
    //             let sortDirection = this.state.sortToggle ? "asc" : "desc";
    //             this.props.fetchAllPriceTables(this.props.priceTable.currentPage, this.state.priceTablesPerPage, this.props.priceTable.sortDirection, false);
    //         }
    //     }
    // };

    // lastPage = () => {
    //     let priceTablesLength = this.state.priceTables.length;
    //     let lastPage = Math.ceil(this.props.totalElements / this.state.priceTablesPerPage);
    //     if (this.props.priceTable.currentPage < lastPage) {
    //         this.props.priceTable.currentPage = lastPage;
    //         if (this.props.priceTable.searchedPriceTable) {
    //             this.searchPriceTable(this.props.priceTable.currentPage)
    //         } else {
    //             this.props.fetchAllPriceTables(this.props.priceTable.currentPage, this.state.priceTablesPerPage, this.props.priceTable.sortDirection);
    //         }
    //     }
    // };

    // nextPage = () => {
    //     if (this.state.currentPage < Math.ceil(this.props.totalElements / this.state.priceTablesPerPage)) {
    //         ++this.props.priceTable.currentPage;

    //         if (this.props.priceTable.searchedPriceTable) {
    //             this.searchPriceTable(this.props.priceTable.currentPage)
    //         } else {
    //             let sortDirection = this.state.sortToggle ? "asc" : "desc";
    //             this.props.fetchAllPriceTables(this.props.priceTable.currentPage, this.state.priceTablesPerPage, this.props.priceTable.sortDirection, false);
    //         }
    //     }
    // };

    // searchChange = event => {
    //     this.props.priceTable.searchedPriceTable = event.target.value;
    //     this.forceUpdate();
    // };

    // cancelSearch = () => {
    //     this.props.priceTable.searchedPriceTable = '';
    //     this.props.fetchAllPriceTables(this.props.priceTable.currentPage, this.state.priceTablesPerPage, this.props.priceTable.sortDirection, false);
    //     this.forceUpdate();
    // };

    // sortData = () => {
    //    // console.log(this.props.priceTable.sortDirection);
    //     if (this.props.priceTable.sortDirection === "asc")
    //         this.props.priceTable.sortDirection = "desc";
    //     else
    //         this.props.priceTable.sortDirection = "asc";
    //      //   console.log(this.props.priceTable.sortDirection);

    //     this.props.fetchAllPriceTables(this.props.priceTable.currentPage, this.state.priceTablesPerPage, this.props.priceTable.sortDirection, false);

    // }

    // searchPriceTable = (currentPage) => {
    //     if (this.props.priceTable.searchedPriceTable)
    //         this.props.searchPriceTables(this.props.priceTable.searchedPriceTable, this.props.priceTable.currentPage, this.props.priceTable.priceTablesPerPage);
    // }

    render() {
        // const searchedPriceTable = this.props.priceTable.searchedPriceTable;
        //const totalPages = this.props.priceTable.totalPages;
        //const totalElements = this.props.priceTable.totalElements;
        const priceTable = this.props.priceTable;
        const priceTables = this.props.priceTables;
        //const currentPage = this.props.priceTable.currentPage;
        //const sortDirection = this.props.priceTable.sortDirection;

        const pageNumCss = {
            width: "45px",
            border: "1px solid #F8F8FF",
            color: "#F8F8FF",
            textAlign: "center",
            fontWeight: "bold"
        };

        const searchBoxCss = {
            width: "100px",
            border: "1px solid #17A2B8",
            color: "#17A2B8",
            textAlign: "center",
            fontWeight: "bold"
        };


        return (
            <div>

                <div style={{ "display": this.state.show ? "block" : "none" }}>
                    <SuccessToast show={this.state.show} message="PriceTable Deleted Successfully." type="danger" />
                </div>

                {/* {priceTableData.error ?
                <Alert variant="danger">
                    {priceTableData.error}

                </Alert> : */}
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <div style={{ "float": "left" }}>
                            <FontAwesomeIcon icon={faMoneyCheckAlt} />     PriceTables List
                        </div>


                    </Card.Header>
                    <Card.Body>
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Min nr hours</th>
                                    <th>1 Person [zl]</th>
                                    <th>2 People [zl/1 Person]</th>
                                    <th>3+ People [zl/1 Person]</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>


                            <tbody>
                                {priceTables.length === 0 ?
                                    <tr align="center">
                                        <td colSpan="10"> No PriceTables in the Data Base</td>
                                    </tr> :

                                    priceTables.map((priceTable, index) => (
                                        <tr key={priceTable.id}>
                                            <td>{priceTable.name}</td>
                                            <td>{priceTable.minNrHours}</td>
                                            <td>{priceTable.onePPrice}</td>
                                            <td>{priceTable.twoPPrice}</td>
                                            <td>{priceTable.threePPrice}</td>
                                            <td>
                                                <ButtonGroup>
                                                    <Link to={"editPriceTable/" + priceTable.id}> <Button size="sm" variant="outline-primary"> <FontAwesomeIcon icon={faEdit} /> </Button> </Link>
                                                    <Button size="sm" variant="outline-danger" onClick={this.deletePriceTable.bind(this, priceTable.id)}> <FontAwesomeIcon icon={faTrash} /> </Button>
                                                </ButtonGroup>
                                            </td>

                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </Card.Body>
                    <Card.Footer>
                        <div style={{ "float": "left" }}>
                            <Link to={"add-priceTable"} className="nav-link">
                                <ButtonGroup>
                                    <Button size="lg" variant="outline-light"> <FontAwesomeIcon icon={faPlusSquare} /> </Button>
                                </ButtonGroup>
                            </Link>
                        </div>


                    </Card.Footer>
                </Card>

            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        priceTable: state.priceTable,
        priceTables: state.priceTable.priceTables,
    }
};


const mapDispatchToProps = dispatch => {
    return {
        fetchAllPriceTables: () => dispatch(fetchAllPriceTables() ),
        deletePriceTable: (priceTableId) => dispatch(deletePriceTable(priceTableId)),
    }

};


export default connect(mapStateToProps, mapDispatchToProps)(PriceTableList);