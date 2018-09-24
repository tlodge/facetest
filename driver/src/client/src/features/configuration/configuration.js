import { createStructuredSelector, createSelector } from 'reselect';
import { get, post } from '../../utils/net';

const UPDATE_CONFIGURATION = 'profile_driver/configuration/UPDATE_CONFIGURATION';
const FETCHING_CONFIGURATION = 'profile_driver/configuration/FETCHING_CONFIGURATION';
const UPDATING_CONFIGURATION = 'profile_driver/configuration/UPDATING_CONFIGURATION';

export const NAME = 'configuration';

const initialState = {
    configuration: {},
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {


        case UPDATE_CONFIGURATION:
            return {
                ...state,
                configuration: {
                    ...state.configuration,
                    ...action.configuration,
                }
            };

        default:
            return state;
    }
}

function updatingConfiguation() {
    return {
        type: UPDATING_CONFIGURATION,
    }
}

function fetchingConfiguration() {
    return {
        type: FETCHING_CONFIGURATION,
    }
}

function updateConfiguration(configuration) {
    console.log("in update configuration", configuration);

    return {
        type: UPDATE_CONFIGURATION,
        configuration,
    };
}

function submitConfiguration() {
    return (dispatch, getState) => {
        const configuration = getState()[NAME].configuration;

        dispatch(updatingConfiguation());

        post("ui/setConfiguration", { configuration }).then((result) => {
            console.log("updated configuration", configuration);
        });
    }
}

function fetchConfiguration() {
    return (dispatch, getState) => {
        dispatch(fetchingConfiguration());

        get("ui/getConfiguration").then((result) => {
            console.log("received config", { configuration: result });
            dispatch({ type: UPDATE_CONFIGURATION, configuration: result });
        });

    }
}

const configuration = (state) => state[NAME].configuration;

export const selector = createStructuredSelector({
    configuration,
});

export const actionCreators = {
    updateConfiguration,
    submitConfiguration,
    fetchConfiguration,
};

