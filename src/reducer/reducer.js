const initialState = {
    ideas: [],
    loading: false,
    error: null,
  };
  
  const reducer = (state, action) => {
    const updateIdeas = state.ideas.filter(idea => idea.id !== action.payload);
    switch (action.type) {
        case "Request":
            return { ...state, loading: true, error: null };
        case "ideaSucess":
            return {
                ...state,
                loading: false,
                ideas: action.payload,
            };
        case "ideaError":
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case "deleteIdea":
            // Supprimer le cadeau de la liste des cadeaux
            return {
                ...state,
                ideas: updateIdeas,
            };
        default:
            return state;
    }
  };
  
  export { initialState, reducer };
  