/* eslint-disable react/display-name */
import React from 'react';
import { Container } from 'unstated-next';

const subscribeToContainers = <
    V extends Container<V>,
    T extends Record<string, V>
>(
    containers: T
) => {
    return (Component: React.ComponentClass | React.FunctionComponent) => {
        return <P extends unknown>(props: P): React.ReactElement => {
            const containerProps = Object.entries(containers).reduce<{
                [nameOfContainer: string]: V;
            }>((result, [nameOfContainer, Container]) => {
                result[nameOfContainer] = Container.useContainer();
                return result;
            }, {});

            return <Component {...props} {...containerProps} />;
        };
    };
};

export default subscribeToContainers;
