import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Mock data
const initialUsers = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  username: `user${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 5 === 0 ? 'Admin' : 'User',
  status: i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Inactive' : 'Pending',
}));

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
}

interface UsersState {
  users: User[];
}

const initialState: UsersState = {
  users: initialUsers,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push({ ...action.payload, id: state.users.length + 1 });
    },
  },
});

export const { addUser } = userSlice.actions;

export default userSlice.reducer;
