import { faArrowLeft, faEdit, faPlusSquare, faSave, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Card, Col, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { fetchPriceTable, savePriceTable, updatePriceTable } from '../../services/index';
import SuccessToast from '../SuccessToast';



class PriceTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initialState;
        this.state.show = false;
        this.state.showInvalidMessage = false;
        this.state.method = 'post';
        this.priceTableChange = this.priceTableChange.bind(this);
        this.submitPriceTable = this.submitPriceTable.bind(this);
    }

    initialState = {
        id: '', name: '', minNrHours: '', onePPrice: '', twoPPrice: '', threePPrice: ''
    }

    componentDidMount() {
        const idPriceTable = +this.props.match.params.id;
        if (idPriceTable) {
            this.findPriceTableById(idPriceTable);
        }
    };


    findPriceTableById = (idPriceTable) => {

        this.props.fetchPriceTable(idPriceTable);
        setTimeout(() => {

            let priceTable = this.props.priceTable.priceTable;
            if (priceTable != null) {
                this.setState({
                    id: priceTable.id,
                    name: priceTable.name,
                    minNrHours: priceTable.minNrHours,
                    onePPrice: priceTable.onePPrice,
                    twoPPrice: priceTable.twoPPrice,
                    threePPrice: priceTable.threePPrice
                });
            }
        }, 1000);
    };

    returnToList = () => {
        return this.props.history.push("/priceTableList");
    };

    submitPriceTable = event => {
        event.preventDefault();

        const priceTable = {
            name: this.state.name,
            minNrHours: this.state.minNrHours,
            onePPrice: this.state.onePPrice,
            twoPPrice: this.state.twoPPrice,
            threePPrice: this.state.threePPrice,
        };

        this.props.savePriceTable(priceTable);
        setTimeout(() => {
            if (this.props.priceTable) {
                this.setState({ "show": true, "method": "post" });
                setTimeout(() => this.setState({ "show": false }), 3000);
                setTimeout(() => this.returnToList(), 1000);
            } else {
                this.setState({ "showInvalidMessage": true, "method": "post" });
                setTimeout(() => this.setState({ "showInvalidMessage": false }), 3000);
            }
        }, 1000);
    };

    updatePriceTable = event => {
        event.preventDefault();

        const priceTable = {
            id: this.state.id,
            name: this.state.name,
            minNrHours: this.state.minNrHours,
            onePPrice: this.state.onePPrice,
            twoPPrice: this.state.twoPPrice,
            threePPrice: this.state.threePPrice,
        };

        this.props.updatePriceTable(priceTable);
        setTimeout(() => {

            if (!this.props.priceTable.error) {
                this.setState({ "show": true, "method": "put" });
                setTimeout(() => this.setState({ "show": false }), 3000);
                setTimeout(() => this.returnToList(), 1000);
            } else {
                this.setState({ "showInvalidMessage": true, "method": "post" });
                setTimeout(() => this.setState({ "showInvalidMessage": false }), 3000);
            }
        }, 2000);
    }

    resetPriceTable = () => {
        this.setState(() => this.initialState);
    };

    priceTableChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {
        const { name, minNrHours, onePPrice, twoPPrice, threePPrice } = this.state;
        const idPriceTable = +this.props.match.params.id;
        return (
            <div>
                <div style={{ "display": this.state.show ? "block" : "none" }}>
                    <SuccessToast show={this.state.show} message={this.state.method === "put" ? "PriceTable Updated Successfully" : "PriceTable Saved Successfully."} type="success" />
                </div>
                <div style={{ "display": this.state.showInvalidMessage ? "block" : "none" }}>
                    <SuccessToast show={this.state.showInvalidMessage} message={"Invalid Data - might be in the data base already"} type="dangerNoSuccess" />
                </div>

                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>
                        <FontAwesomeIcon icon={idPriceTable ? faEdit : faPlusSquare} /> {idPriceTable ? "Update PriceTable" : "Add New PriceTable"}
                    </Card.Header>
                    <Form onReset={this.resetPriceTable} onSubmit={idPriceTable ? this.updatePriceTable : this.submitPriceTable}>
                        <Card.Body>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridName">
                                    <Form.Label>Offer Name</Form.Label>
                                    <Form.Control required
                                        autoComplete="off"
                                        type="test"
                                        name="name"
                                        value={name}
                                        onChange={this.priceTableChange}
                                        placeholder="Enter Offer Name"
                                        className={"bg-dark text-white"} />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridMinNrHours">
                                    <Form.Label>Min Nr of Hours</Form.Label>
                                    <Form.Control required
                                        autoComplete="off"
                                        type="test"
                                        name="minNrHours"
                                        value={minNrHours}
                                        onChange={this.priceTableChange}
                                        placeholder=" Enter Min Nr of Hours"
                                        className={"bg-dark text-white"} />
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridOnePPrice">
                                    <Form.Label>Price for 1 Person</Form.Label>
                                    <Form.Control required
                                        autoComplete="off"
                                        type="test"
                                        name="onePPrice"
                                        value={onePPrice}
                                        onChange={this.priceTableChange}
                                        placeholder="Enter Price"
                                        className={"bg-dark text-white"} />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridTwoPPrice">
                                    <Form.Label>Price for 1 P in group of 2</Form.Label>
                                    <Form.Control required
                                        autoComplete="off"
                                        type="test"
                                        name="twoPPrice"
                                        value={twoPPrice}
                                        onChange={this.priceTableChange}
                                        placeholder=" Enter price"
                                        className={"bg-dark text-white"} />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridThreePPrice">
                                    <Form.Label>Price for 1 P in group of 3</Form.Label>
                                    <Form.Control required
                                        autoComplete="off"
                                        type="test"
                                        name="threePPrice"
                                        value={threePPrice}
                                        onChange={this.priceTableChange}
                                        placeholder=" Enter price"
                                        className={"bg-dark text-white"} />
                                </Form.Group>
                            </Form.Row>

                        </Card.Body>

                        <Card.Footer>
                            <div>
                                <Button size="sm" variant="primary" type="submit">
                                    <FontAwesomeIcon icon={faSave} /> {idPriceTable ? "Update" : "Submit"}
                                </Button>
                                {'      '}

                                <Button size="sm" variant="secondary" type="reset">
                                    <FontAwesomeIcon icon={faUndo} />  Reset
                    </Button>
                            </div>
                            {'      '}
                            <div>
                                <Button size="sm" variant="light" type="button" onClick={this.returnToList.bind()}>
                                    <FontAwesomeIcon icon={faArrowLeft} />  Return
                    </Button>
                            </div>
                        </Card.Footer>
                    </Form >


                </Card >
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        priceTable: state.priceTable
    };
};

const mapDispatchToProps = dispatch => {
    return {
        savePriceTable: (priceTable) => dispatch(savePriceTable(priceTable)),
        fetchPriceTable: (priceTableId) => dispatch(fetchPriceTable(priceTableId)),
        updatePriceTable: (priceTable) => dispatch(updatePriceTable(priceTable))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PriceTable);
