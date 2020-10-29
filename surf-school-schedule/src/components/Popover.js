import React, { Component } from 'react';
import { Popover, Button, OverlayTrigger, ButtonGroup } from 'react-bootstrap';
import { faCheck, faTimes, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';


export default class SuccessToast extends React.Component {


    render() {
        // const toastCss = {
        //     position: 'fixed',
        //     top: '10px',
        //     right: '10px',
        //     zIndex: '1',
        //     boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
        // };
        if (this.props.data) {
            return (
                <>

                    <OverlayTrigger
                    trigger = "focus"
                        //showPopover={this.props.showPopover}
                        key="right"
                        placement="right"
                        overlay={
                            <Popover id={`popover-positioned-right`}>
                                <Popover.Title className={"border border-dark bg-dark text-white"} as="h3">Actions</Popover.Title>
                                <Popover.Content className={"border border-dark bg-light text-white"}>
                                    <Button size="sm" variant="outline-info" type="button" onClick={() => { this.props.lessonStatusChange() }}>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </Button>
                                    <Button size="sm" variant="outline-danger" type="button" onClick={() => { this.props.deleteLesson() }}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </Button>

                                </Popover.Content>
                            </Popover>
                        }
                    >

                        <Button variant={this.props.buttonColor} >{this.props.data}</Button>
                    </OverlayTrigger>

                </>
            );
        }
        else {
            return (
                <>

                    <OverlayTrigger
                        trigger="focus"
                        key="right"
                        placement="right"
                        overlay={
                            <Popover id={`popover-positioned-right`}>
                                <Popover.Title className={"border border-dark bg-dark text-white"} as="h3">Actions</Popover.Title>

                                <Popover.Content className={"border border-dark bg-light text-white"}>
                                    {/* <Link to={"add-lesson"} className="nav-link"> <Button show="false" size="lg" variant="info" block>  <FontAwesomeIcon icon={faUserPlus} /> </Button> </Link> */}
                                    <Button show="false" size="lg" variant="info" block onClick={() => { this.props.changeShowForm() }}>  <FontAwesomeIcon icon={faUserPlus} /> </Button>

                                </Popover.Content>
                            </Popover>
                        }
                    >
                        <ButtonGroup vertical>
                            <Button size="lg" variant="transparent" ></Button>
                            <Button size="lg" variant="transparent" ></Button>
                        </ButtonGroup>

                    </OverlayTrigger>

                </>
            );
        }

    };
}