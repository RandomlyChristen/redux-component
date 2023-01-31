import Component from "../../core/Component";
import {decrement, increment} from "../../store/counter";
import Store from "../../store";


class Counter extends Component {
    stateSelector(globalState) {
        return globalState.counter;
    }

    template() {
        const { number } = this.state;
        return `
        <h1>${number}</h1>
        <button class="counter-increase-btn">증가</button>
        <button class="counter-decrease-btn">감소</button>
        `;
    }

    initialize() {
        this.addEvent('click', '.counter-increase-btn', () => {
            Store.dispatch(increment(5));
        });
        this.addEvent('click', '.counter-decrease-btn', () => {
            Store.dispatch(decrement(5));
        });
    }

    onStateChanged() {
        const { number } = this.state;
        const $h1 = this.$target.querySelector('h1');
        $h1.innerText = number.toString();

        const $increase = this.$target.querySelector('.counter-increase-btn');

        $increase.disabled = number > 50;
    }
}

export default Counter;