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
            const expandedContainers = Object.entries(containers).map(
                ([nameOfContainer, Container]) => ({
                    [nameOfContainer]: Container.useContainer()
                })
            );

            const containerProps: { [nameOfContainer: string]: V } = {};
            Object.assign(containerProps, ...expandedContainers);

            return <Component {...props} {...containerProps} />;
        };
    };
};

export default subscribeToContainers;
