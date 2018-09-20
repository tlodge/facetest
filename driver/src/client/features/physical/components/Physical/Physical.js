import React, { Component } from 'react';
import { actionCreators as physicalActions, selector } from '../../';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const profileKeys = ["profileAge", "profileEyeColour", "profileDateOfBirth", "profileGender", "profileHeight", "profileWeight", "profileTatoos", "profilePiercings", "profileHairColour", "profilePhysicalTraits", "profilePicture"];

class Physical extends Component {

    constructor(props) {
        super(props);
        this.renderForm = this.renderForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderProfileInputs = this.renderProfileInputs.bind(this);
    }

    componentDidMount() {
        this.props.actions.fetchAttributes();
    }

    handleChange(attribute, value) {
        this.props.actions.updateAttributes({ ...this.props.attributes, [attribute]: value });
    }

    handleSubmit(event) {
        this.props.actions.submitAttributes();
        event.preventDefault();
    }

    renderProfileInputs() {
        const { attributes = {} } = this.props;
        console.log("attributes are", attributes);
        return profileKeys.map(k => {
            return <div key={k}>
                <label>
                    {k}:
                        <input type="text" value={attributes[k] || ""} onChange={(e) => this.handleChange(k, e.target.value)} />
                </label>
            </div>
        })

    }
    renderForm() {



        return <form onSubmit={this.handleSubmit}>
            {this.renderProfileInputs()}
            <input type="submit" value="Submit" />
        </form>
    }

    render() {
        return this.renderForm();
    }
}

export default connect(selector, (dispatch) => ({
    actions: bindActionCreators(physicalActions, dispatch)
}), null, { withRef: true })(Physical);