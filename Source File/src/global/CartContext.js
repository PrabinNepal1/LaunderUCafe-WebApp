import React, {createContext,useEffect, useReducer} from 'react';
import {CartReducer, initializer} from './CartReducer';

export const CartContext = createContext();

export const CartContextProvider = (props) => {

    const [cart, dispatch] = useReducer(CartReducer, { shoppingCart: [], totalPrice:0, totalQty:0 }, initializer)

    useEffect(() => {
    localStorage.setItem("localCart", JSON.stringify(cart));
  }, [cart]);

    return (
      <CartContext.Provider value={{...cart, dispatch}}>
            {props.children}
      </CartContext.Provider>
    )

}



        var i = 0;
        while (i < foodItems.length){
          if(foodItems[i].category === selector){
            setSelectedItems([...foodItems])
          }
          else if (selector==="All"){
            setSelectedItems([...foodItems])
          }
          i++;
        }