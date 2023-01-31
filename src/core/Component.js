import Store from "../store";

class Component {
    $target;
    props;
    state;
    constructor($target, props = {}) {
        this.$target = $target;
        this.props = props;
        this._initState();
        this.initialize();
        this.render();
    }
    initialize() {}
    onStateChanged() {}
    stateSelector(globalState) {}
    mounted() {}
    template() {
        return '';
    }

    addEvent(type, selector, listener) {
        const children = [...this.$target.querySelectorAll(selector)];
        const isTarget = ({target}) => {
            return children.includes(target) || target.closest(selector);
        }
        this.$target.addEventListener(type, e => {
            if (!isTarget(e)) return false;
            return listener(e);
        });
    }

    _initState() {
        const globalState = Store.getState();
        const localState = this.stateSelector(globalState);
        if (!localState) return;
        this.state = localState;
        this._unsubscribe = Store.subscribe(() => {
            if (!this.$target.isConnected) {
                this._unsubscribe();
                return;
            }
            const globalState = Store.getState();
            const newLocalState = this.stateSelector(globalState);
            if (this.state !== newLocalState) {
                this.state = newLocalState;
                this.onStateChanged();
            }
        });

    }

    render() {
        this.$target.innerHTML = this.template();
        this.mounted();
    }
}

export default Component;