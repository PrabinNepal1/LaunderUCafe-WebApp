import React, {useContext, useState, useEffect} from 'react';
import {Form, Card, Button, ListGroup, Container, Modal, Alert,Row, Col, InputGroup} from "react-bootstrap";
import {firestore} from "../../../firebase";
import {useAuth} from "../../../contexts/AuthContext";

export default function Employee() {

  const{employee, currentUser} = useAuth()
  const orderDetails = [];

  async function viewOrder(){
    await firestore.collection('orderDetails').get()
    .then(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
      orderDetails.push(doc.id, "=>", doc.data());
    });
  });
  }

  useEffect(()=>{
    viewOrder()
    console.log(orderDetails)
  },[])

  return (
    <Container className="d -flex align-items-center justify-our-content mt-3 mb-3">
    <Card>
    <Card.Header as="h3">Orders</Card.Header>
    {orderDetails &&
      <Card.Body >
      <Button className="mb-3" variant="primary">Accept Orders</Button>
      <Button className="mx-3 mb-3" variant="danger">Completed</Button>
      <ListGroup className="list-group-flush">
            <div id="ItemHeader">{JSON.stringify(orderDetails)}</div>
      </ListGroup>
      </Card.Body>}
      </Card>


    </Container>
  )
}
