import React from 'react';
import { render, screen } from '@testing-library/react';
import Error from './pages/Error';

describe('Test Base Components', () => {
  test('test Error Page snapshot', () => {
    const msgTxt = 'here is some error massage that should be shown';
    render(<Error message={msgTxt} />);
    const headerElement = screen.getByText(/Ops, some error happened!/i);
    expect(headerElement).toBeInTheDocument();

    const msgElement = screen.getByText(`${msgTxt}`);
    expect(msgElement).toBeInTheDocument();
  });

  test('simple functions', () => {
    const sum = (a, b) => {
      return a + b;
    };
    expect(sum(5, 3)).toBe(8);
  });

  test('test function should be called', () => {
    const mockFn = jest.fn();
    const func = () => {
      mockFn();
    };
    func();
    expect(mockFn).toBeCalled();
  });
});
