import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  data: Record<string, string> | null
}

const initialState: UserState = {
  data: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserData: (state, action: PayloadAction<Record<string, string> | null>) => {
      state.data = action.payload; 
    },
  },
})

export const { updateUserData } = userSlice.actions

export default userSlice.reducer