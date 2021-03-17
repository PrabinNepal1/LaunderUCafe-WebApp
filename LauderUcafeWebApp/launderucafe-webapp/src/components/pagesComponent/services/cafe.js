import React, {useContext, useState, useEffect} from 'react';
import {Card, Button, Container, Alert} from "react-bootstrap";
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

      const [error, setError] = useState('')
      const foodItems = useFoodDetails()
      const [images, setImages] = useState()
      const [cart, setCart] = useState([])
      const {dispatch} = useContext(CartContext);

      return (
        <Container className="d -flex align-items-center justify-our-content mt-5">
          {foodItems.map((detail) =>
            <Card className="pt-1" key={detail.id}>
              <div id="foodItemHeader">{detail.name}</div>
              <div>
                <div id="foodItemImage"><img src={detail.image}/></div>
                <div id="foodItemDetails">{detail.details}</div>
              </div>
              <div id="foodItemShop">
                <div id="foodItemCost">Price: ${detail.cost}</div>
                <div id="foodCartButton"><Button variant="secondary" onClick={() => dispatch({type:'ADD_TO_CART', id: detail.id, detail})}>
                Add
                <span className="fas fa-shopping-cart"></span></Button></div>
              </div>

            </Card>
          )}

        </Container>
      )
}
