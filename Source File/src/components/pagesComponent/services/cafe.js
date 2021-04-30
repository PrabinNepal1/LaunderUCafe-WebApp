import React, {useContext, useState, useEffect} from 'react';
import {Card, Button, Container} from "react-bootstrap";
import {firestore} from "../../../firebase";
import {CartContext} from '../../../global/CartContext';

function useFoodDetails(){

     const [foodItems, setFoodItems] = useState([])
     useEffect(()=>{
       firestore
         .collection('foodMenu')
         .onSnapshot((snapshot) =>{
           const newFoodDetails = snapshot.docs.map((doc) => ({
             id:doc.id,
             ...doc.data()
           }))
            setFoodItems(newFoodDetails)
        })
     },[])

     return foodItems
    }

    export default function Cafe() {

      const foodItems = useFoodDetails()
      const {dispatch} = useContext(CartContext);

      return (
        <Container className="d -flex align-items-center justify-our-content mt-5">
          {foodItems.map((product) =>
            <Card className="pt-1" key={product.id}>
              <div id="foodItemHeader">{product.name}</div>
              <div>
                <div id="foodItemImage"><img src={product.image}/></div>
                <div id="foodItemDetails">{product.details}</div>
              </div>
              <div id="foodItemShop">
                <div id="foodItemCost">Price: ${product.cost}</div>
                <div id="foodCartButton"><Button variant="secondary" onClick={() => dispatch({type:'ADD_TO_CART', id: product.id, product})}>
                Add
                <span className="fas fa-shopping-cart"></span></Button></div>
              </div>

            </Card>
          )}

        </Container>
      )
}
