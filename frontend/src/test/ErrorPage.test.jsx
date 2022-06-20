import React from 'react';
import { render, screen } from '@testing-library/react';
import Error from '../pages/Error';

describe('Test Base Components', () => {
  test('test Error Page snapshot', () => {
    const msgTxt = 'here is some error massage that should be shown';
    render(<Error message={msgTxt} />);
    const headerElement = screen.getByText(/Ops, some error happened!/i);
    expect(headerElement).toBeInTheDocument();

    const msgElement = screen.getByText(`${msgTxt}`);
    expect(msgElement).toBeInTheDocument();
  });
})
