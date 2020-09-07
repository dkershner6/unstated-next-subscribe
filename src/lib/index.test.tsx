import React, { useState, Component, PureComponent } from 'react';
import subscribeToContainers from '.';
import { createContainer } from 'unstated-next';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

interface TestContainerOneOutput {
    testStateOne: string;
    setTestStateOne: React.Dispatch<React.SetStateAction<string>>;
}

const useTestContainerOne = (): TestContainerOneOutput => {
    const [testStateOne, setTestStateOne] = useState<string>('testStateOne');
    return { testStateOne, setTestStateOne };
};

const TestContainerOne = createContainer(useTestContainerOne);

interface TestContainerTwoOutput {
    testStateTwo: string;
    setTestStateTwo: React.Dispatch<React.SetStateAction<string>>;
}

const useTestContainerTwo = (): TestContainerTwoOutput => {
    const [testStateTwo, setTestStateTwo] = useState('testStateTwo');
    return { testStateTwo, setTestStateTwo };
};

const TestContainerTwo = createContainer(useTestContainerTwo);

class TestComponent extends Component<{
    TestContainerOne: TestContainerOneOutput;
    TestContainerTwo: TestContainerTwoOutput;
    passedInProp?: string;
}> {
    render() {
        return (
            <div>
                <p data-testid="testStateOne">
                    {this.props.TestContainerOne.testStateOne}
                </p>
                <button
                    data-testid="ButtonOne"
                    onClick={() =>
                        this.props.TestContainerOne.setTestStateOne('newOne')
                    }
                />
                <p data-testid="testStateTwo">
                    {this.props.TestContainerTwo.testStateTwo}
                </p>
                <button
                    data-testid="ButtonTwo"
                    onClick={() =>
                        this.props.TestContainerTwo.setTestStateTwo('newTwo')
                    }
                />
                <p data-testid="passedInProp">{this.props.passedInProp}</p>
            </div>
        );
    }
}

class PureTestComponent extends PureComponent<{
    TestContainerOne: TestContainerOneOutput;
    TestContainerTwo: TestContainerTwoOutput;
}> {
    render() {
        return (
            <div>
                <p data-testid="testStateOne">
                    {this.props.TestContainerOne.testStateOne}
                </p>
                <button
                    data-testid="ButtonOne"
                    onClick={() =>
                        this.props.TestContainerOne.setTestStateOne('newOne')
                    }
                />
                <p data-testid="testStateTwo">
                    {this.props.TestContainerTwo.testStateTwo}
                </p>
                <button
                    data-testid="ButtonTwo"
                    onClick={() =>
                        this.props.TestContainerTwo.setTestStateTwo('newTwo')
                    }
                />
            </div>
        );
    }
}

const TestWrapper = ({ children }) => {
    return (
        <TestContainerOne.Provider>
            <TestContainerTwo.Provider>{children}</TestContainerTwo.Provider>
        </TestContainerOne.Provider>
    );
};

const SubscribedTestComponent = subscribeToContainers({
    TestContainerOne,
    TestContainerTwo
})(TestComponent);

const SubscribedPureTestComponent = subscribeToContainers({
    TestContainerOne,
    TestContainerTwo
})(PureTestComponent);

describe('subscribeToContainers', () => {
    it('Should render with the correct state values', () => {
        const { getByTestId } = render(
            <TestWrapper>
                <SubscribedTestComponent />
            </TestWrapper>
        );

        expect(getByTestId('testStateOne')).toHaveTextContent('testStateOne');
        expect(getByTestId('testStateTwo')).toHaveTextContent('testStateTwo');
    });

    it('Should still allow for passed in props', () => {
        const { getByTestId } = render(
            <TestWrapper>
                <SubscribedTestComponent passedInProp="testPassingInProps" />
            </TestWrapper>
        );

        expect(getByTestId('passedInProp')).toHaveTextContent(
            'testPassingInProps'
        );
    });

    it('Should be able to set values as well', () => {
        const { getByTestId } = render(
            <TestWrapper>
                <SubscribedTestComponent />
            </TestWrapper>
        );

        expect(getByTestId('testStateOne')).toHaveTextContent('testStateOne');
        expect(getByTestId('testStateTwo')).toHaveTextContent('testStateTwo');

        fireEvent.click(getByTestId('ButtonOne'));
        fireEvent.click(getByTestId('ButtonTwo'));

        expect(getByTestId('testStateOne')).toHaveTextContent('newOne');
        expect(getByTestId('testStateTwo')).toHaveTextContent('newTwo');
    });

    it('Should update even as a PureComponent', () => {
        const { getByTestId } = render(
            <TestWrapper>
                <SubscribedPureTestComponent />
            </TestWrapper>
        );

        expect(getByTestId('testStateOne')).toHaveTextContent('testStateOne');
        expect(getByTestId('testStateTwo')).toHaveTextContent('testStateTwo');

        fireEvent.click(getByTestId('ButtonOne'));
        fireEvent.click(getByTestId('ButtonTwo'));

        expect(getByTestId('testStateOne')).toHaveTextContent('newOne');
        expect(getByTestId('testStateTwo')).toHaveTextContent('newTwo');
    });
});
