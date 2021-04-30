import React, {createContext,useEffect, useReducer} from 'react';
import {CartReducer, initializer} from './CartReducer';

export const CartContext = createContext();

export function CartContextProvider({children}) {

    const [cart, dispatch] = useReducer(CartReducer, { shoppingCart: [], totalPrice:0, totalQty:0 }, initializer)

    useEffect(() => {
    localStorage.setItem("localCart", JSON.stringify(cart));
  }, [cart]);

    return (
      <CartContext.Provider value={{...cart, dispatch}}>
            {children}
      </CartContext.Provider>
    )

}
