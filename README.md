# unstated-next-subscribe

A React Higher Order Component (HOC) that allows for use of unstated-next containers in non-FunctionalComponents (class components).

## Installation

`npm i unstated-next-subscribe`

To get all of the peer dependencies as well:

`npm i react unstated-next unstated-next-subscribe`

## Usage

The `subscribeToContainers` HOC wraps class components to provide the containers as props. The prop name is the same as the name of the container.

The example below assumes you have created an [unstated-next](https://github.com/jamiebuilds/unstated-next) container named `MyAwesomeContainer`.

```typescript
import { subscribeToContainers } from 'unstated-next-subscribe';
import MyAwesomeContainer from './MyAwesomeContainer';

class MyAwesomeClassComponent extends Component {
    render() {
        return <p>{this.props.MyAwesomeContainer.myCoolProp}</p>;
    }
}

export default subscribeToContainers({ MyAwesomeContainer })(
    MyAwesomeClassComponent
);
```

The first function parameter is an object with containers as values (and the name of the container as the key).

For the TypeScripters among us:

```typescript
<
    V extends Container<V>,
    T extends Record<string, V>
>(
    containers: T
)
```

The second function parameter is the component you want to give props to.

There are two functions to match conventions seen in Redux connect and other HOCs.
