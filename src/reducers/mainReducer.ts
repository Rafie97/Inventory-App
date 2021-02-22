const SET_PRODUCTS = "SET_PRODUCTS";

const initialState = {
  products: [],
};

export const mainReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
