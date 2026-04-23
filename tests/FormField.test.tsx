import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import FormField from '../components/ui/form-field';

describe('FormField', () => {
  it('renders the label and fires onChangeText', () => {
    const onChangeText = jest.fn();
    const { getByText, getByLabelText } = render(
      <FormField label="Name" value="" onChangeText={onChangeText} />
    );

    expect(getByText('Name')).toBeTruthy();

    fireEvent.changeText(getByLabelText('Name'), 'Morning Run');
    expect(onChangeText).toHaveBeenCalledWith('Morning Run');
  });
});