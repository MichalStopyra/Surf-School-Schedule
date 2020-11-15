import { faCheck, faEdit, faTimes, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, ButtonGroup, OverlayTrigger, Popover } from 'react-bootstrap';


export default class SuccessToast extends React.Component {


    render() {
        if (this.props.data && this.props.isNotInFuture) {
            return (
                <>

                    <OverlayTrigger
                    trigger = "focus"
                        key="right"
                        placement="right"
                        overlay={
                            <Popover {...this.props} id={`popover-positioned-right`}>
                                <Popover.Title className={"border border-dark bg-dark text-white"} as="h3">Actions</Popover.Title>
                                <Popover.Content className={"border border-dark bg-light text-white"}>
                                    <Button size="sm" variant="outline-info" type="button" onClick={() => { this.props.lessonStatusChange() }}>
                                        <FontAwesomeIcon icon={faCheck} />
                                    </Button>
                                    <Button size="sm" variant="outline-dark" type="button" onClick={() => { this.props.editLesson() }}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </Button>
                                    <Button size="sm" variant="outline-danger" type="button" onClick={() => { this.props.deleteLesson() }}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </Button>

                                </Popover.Content>
                            </Popover>
                        }
                    >

                        <Button size ="sm" variant={this.props.buttonColor} >{this.props.data}</Button>
                    </OverlayTrigger>

                </>
            );
        }
        else if (this.props.data && !this.props.isNotInFuture) {
            return (
                <>

                    <OverlayTrigger
                    trigger = "focus"
                        key="right"
                        placement="right-start"
                        overlay={
                            <Popover id={`popover-positioned-right`}>
                                <Popover.Title className={"border border-dark bg-dark text-white"} as="h3">Actions</Popover.Title>
                                <Popover.Content className={"border border-dark bg-light text-white"}>
                                    <Button size="sm" variant="outline-dark" type="button" onClick={() => { this.props.editLesson() }}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </Button>
                                    <Button size="sm" variant="outline-danger" type="button" onClick={() => { this.props.deleteLesson() }}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </Button>

                                </Popover.Content>
                            </Popover>
                        }
                    >

                        <Button size ="sm" variant={this.props.buttonColor} >{this.props.data}</Button>
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