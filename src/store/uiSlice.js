import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isVideoOpen: false,
  previousRoute: '/',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openVideo: (state) => {
      state.isVideoOpen = true
    },
    closeVideo: (state) => {
      state.isVideoOpen = false
    },
    toggleVideo: (state) => {
      state.isVideoOpen = !state.isVideoOpen
    },
    setPreviousRoute: (state, action) => {
      state.previousRoute = action.payload
    },
  },
})

export const { openVideo, closeVideo, toggleVideo, setPreviousRoute } = uiSlice.actions
export default uiSlice.reducer
