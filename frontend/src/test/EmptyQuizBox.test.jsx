import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import EmptyQuizBox from '../component/EmptyQuizBox';
import { Provider } from 'react-redux';
import { store } from '../store';

describe('Test EmptyQuizBox Component', () => {
  test('test EmptyQuizBox Snapshot', () => {
    render(
            <Provider store={store}>
                <EmptyQuizBox postQuiz={() => {
                }}/>
            </Provider>
    );
    const textFieldElement = screen.getByText(/Creat a new quiz .../i);
    expect(textFieldElement).toBeInTheDocument();
    expect(textFieldElement).toBeInstanceOf(HTMLElement);
    expect(textFieldElement).not.toBeEmptyDOMElement();
    expect(textFieldElement).not.toBeInvalid();
    expect(textFieldElement).not.toBeDisabled();
    expect(textFieldElement).toBeVisible();
    expect(textFieldElement).not.toHaveStyle('display: none');
    const dataShrink = textFieldElement.getAttribute('data-shrink');
    expect(dataShrink).toBe('false');

    const ensureButtonElement = screen.getByText(/CREATE/i);
    expect(ensureButtonElement).toBeInTheDocument();
    expect(textFieldElement).toBeInstanceOf(HTMLElement);
    expect(textFieldElement).not.toBeEmptyDOMElement();
    expect(textFieldElement).not.toBeInvalid();
    expect(textFieldElement).not.toBeDisabled();
    expect(textFieldElement).toBeVisible();
    expect(textFieldElement).not.toHaveStyle('background-color: blue;');
  });

  test('test EmptyQuizBox can input quiz name', () => {
    render(
            <Provider store={store}>
                <EmptyQuizBox/>
            </Provider>
    );
    const createTextFieldInput = document.getElementById('createTextField');
    const typeAttribute = createTextFieldInput.getAttribute('type');
    expect(typeAttribute).toEqual('text');
    expect(createTextFieldInput).toBeInstanceOf(HTMLInputElement);
    const mockInputVal = 'Quiz Name';
    const inputEvent = {
      target: {
        value: mockInputVal,
      },
    };
    fireEvent.change(createTextFieldInput, inputEvent);
    const valueAttribute = createTextFieldInput.getAttribute('value');
    expect(valueAttribute).toEqual(mockInputVal);
  });

  test('test EmptyQuizBox can call prop create Function', () => {
    const fn = jest.fn();
    render(
            <Provider store={store}>
                <EmptyQuizBox testHook={fn}/>
            </Provider>
    );
    const createTextFieldInput = document.getElementById('createTextField');
    const mockInputVal = 'Quiz Name';
    const inputEvent = {
      target: {
        value: mockInputVal,
      },
    };
    fireEvent.change(createTextFieldInput, inputEvent);

    const ensureButtonElement = screen.getByText(/CREATE/i);
    ensureButtonElement.click();
    expect(fn).toBeCalled();
    expect(fn).toBeCalledWith(mockInputVal);
    expect(fn).toBeCalledTimes(1);
  });
});
