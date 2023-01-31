const actionTypes = {
    INCREMENT: 'counter/INCREMENT',
    DECREMENT: 'counter/DECREMENT'
};

const initialState = { number: 0 };

export const increment = (diff) => ({ type: actionTypes.INCREMENT, diff });
export const decrement = (diff) => ({ type: actionTypes.DECREMENT, diff });

export default function counter(state = initialState, action) {
    switch (action.type) {
        case actionTypes.INCREMENT:
            return { ...state,
                number: state.number + action.diff
            }
        case actionTypes.DECREMENT:
            return { ...state,
                number: state.number - action.diff
            }
        default:
            return state;
    }
};