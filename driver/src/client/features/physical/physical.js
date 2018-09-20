import { createStructuredSelector, createSelector } from 'reselect';
import { get, post } from '../../utils/net';

const UPDATE_ATTRIBUTES = 'profile_driver/physical/UPDATE_ATTRIBUTES';
const FETCHING_ATTRIBUTES = 'profile_driver/physical/FETCHING_ATTRIBUTES';
const UPDATING_ATTRIBUTES = 'profile_driver/physical/UPDATING_ATTRIBUTES';

export const NAME = 'physical';

const initialState = {
    attributes: {},
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {


        case UPDATE_ATTRIBUTES:
            return {
                ...state,
                attributes: {
                    ...state.attributes,
                    ...action.attributes,
                }
            };

        default:
            return state;
    }
}

function updatingAttributes() {
    return {
        type: UPDATING_ATTRIBUTES,
    }
}

function fetchingAttributes() {
    return {
        type: FETCHING_ATTRIBUTES,
    }
}

function updateAttributes(attributes) {
    console.log("in update attributes", attributes);

    return {
        type: UPDATE_ATTRIBUTES,
        attributes,
    };
}

function submitAttributes() {
    return (dispatch, getState) => {
        const attributes = getState()[NAME].attributes;

        dispatch(updatingAttributes());

        post("ui/setPhysicalAttributes", { attributes }).then((result) => {
            console.log("updated attributes", attributes);
        });
    }
}

function fetchAttributes() {
    return (dispatch, getState) => {
        dispatch(fetchingAttributes());

        get("ui/getPhysicalAttributes").then((result) => {
            console.log("received physical attributes", { attributes: result });
            dispatch({ type: UPDATE_ATTRIBUTES, attributes: result });
        });

    }
}

const attributes = (state) => state[NAME].attributes;

export const selector = createStructuredSelector({
    attributes,
});

export const actionCreators = {
    updateAttributes,
    submitAttributes,
    fetchAttributes,
};

