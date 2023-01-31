const actionTypes = {
    CHANGE_INPUT: 'input/CHANGE_INPUT'
};

const initialState = { value: '' };

export const changeInput = (value) => ({ type: actionTypes.CHANGE_INPUT, value });

export default function input(state = initialState, action) {
    switch (action.type) {
        case actionTypes.CHANGE_INPUT:
            return { ...state,
                value: action.value
            }
        default:
            return state;
    }
};