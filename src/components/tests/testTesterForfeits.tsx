import React from 'react';
// I installed, and it looks like it's there now


// we need to import testDuel, since this is the thing we want to test
import {TestDuel} from '@/pages/TestDuel';
import { render, screen, fireEvent} from '@testing-library/react';


// Let's first implement this test on testudel.tsx

// Q: how do you get the test to be imported
test('clicking the button changes the message', () => {
  render(<TestDuel />);

  const button = screen.getByRole('button', { name: /Click Me/i });
  fireEvent.click(button);

  expect(screen.getByText('Button Clicked!')).toBeInTheDocument();
});