import React, { Component } from 'react';
import { actionCreators as configurationActions, selector } from '../..';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


class Configuration extends Component {

    constructor(props) {
        super(props);
        this.renderForm = this.renderForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.actions.fetchConfiguration();
    }

    handleChange(attribute, value) {
        this.props.actions.updateConfiguration({ ...this.props.configuration, [attribute]: value });
    }

    handleSubmit(event) {
        this.props.actions.submitConfiguration();
        event.preventDefault();
    }

    renderForm() {
        const { configuration = {} } = this.props;
        return <form onSubmit={this.handleSubmit}>
            <input type="text" value={configuration.webcamip || ""} onChange={(e) => this.handleChange("webcamip", e.target.value)} />
            <input type="submit" value="Submit" />
        </form>
    }

    render() {
        return this.renderForm();
    }
}

export default connect(selector, (dispatch) => ({
    actions: bindActionCreators(configurationActions, dispatch)
}), null, { withRef: true })(Configuration);