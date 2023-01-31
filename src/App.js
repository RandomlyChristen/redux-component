import Component from "./core/Component";
import Counter from "./components/Counter/Counter";
import AuthenticationViewer from "./components/AuthenticationViewer/AuthenticationViewer";

class App extends Component {
    template() {
        // return `
        // <div data-component="Counter"></div>
        // `
        return `
        <div data-component="AuthenticationViewer"></div>
        `
    }

    mounted() {
        // const $counter = this.$target.querySelector('[data-component="Counter"]');
        // new Counter($counter);
        const $authenticationViewer = this.$target.querySelector('[data-component="AuthenticationViewer"]');
        new AuthenticationViewer($authenticationViewer);
    }
}

export default App;