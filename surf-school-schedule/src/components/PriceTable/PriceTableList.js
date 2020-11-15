import { faEdit, faMoneyCheckAlt, faPlusSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, ButtonGroup, Card, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import SuccessToast from '../SuccessToast';
import { deletePriceTable, fetchAllPriceTables } from './../../services/index';
import './../../style/Style.css';





class PriceTableList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            priceTables: []
        };
    }


    componentDidMount() {
        this.props.fetchAllPriceTables();
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
        this.props.fetchAllPriceTables();

    };


    render() {
        const priceTables = this.props.priceTables;



        return (
            <div>

                <div style={{ "display": this.state.show ? "block" : "none" }}>
                    <SuccessToast show={this.state.show} message="PriceTable Deleted Successfully." type="danger" />
                </div>

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

                                    priceTables.map((priceTable) => (
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