export const peerReducer = (state, action) => {
  switch (action.type) {
    case "ADD_PEER":
      return {
        ...state,
        [action.id]: {
          stream: null,
          username: action.username,
          hasAudio: action.hasAudio,
          hasVideo: action.hasVideo,
        },
      };
    case "SET_PEER_STREAM":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          stream: action.stream,
        },
      };
    case "REMOVE_PEER":
      const updated = { ...state };
      delete updated[action.id];
      return updated;
    case "UPDATE_PEER_MEDIA":
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          hasAudio: action.hasAudio,
          hasVideo: action.hasVideo,
        },
      };
    default:
      return state;
  }
};
