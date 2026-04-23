import { render } from '@testing-library/react-native';
import React from 'react';
import IndexScreen from '../app/(tabs)/habits';
import { AppContext } from '../app/_layout';

jest.mock('@/db/client', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: View };
});

jest.mock('react-native-dropdown-picker', () => {
  const { View } = require('react-native');
  return () => <View />;
});

const mockHabit = {
  id: 1,
  name: 'Morning Run',
  category_id: 1,
  user_id: 1,
  description: null,
  duration: null,
  notes: null,
  created_at: '2024-01-01',
};

const mockCategory = {
  id: 1,
  name: 'Fitness',
  colour: '#FF6B6B',
  icon: 'zap',
  user_id: 1,
};

describe('HabitList', () => {
  it('renders the habit list and shows habit name', () => {
    const { getByText } = render(
      <AppContext.Provider value={{
        habits: [mockHabit],
        setHabits: jest.fn(),
        categories: [mockCategory],
        setCategories: jest.fn(),
        targets: [],
        setTargets: jest.fn(),
        currentUser: null,
        setCurrentUser: jest.fn(),
      }}>
        <IndexScreen />
      </AppContext.Provider>
    );

    expect(getByText('Morning Run')).toBeTruthy();
  });
});