import React, {useContext, useState, useEffect} from 'react';
import {Form, Card, Button, ListGroup, Container, Modal, Alert,Row, Col, InputGroup} from "react-bootstrap";
import {firestore} from "../../../firebase";
import {CartContext} from '../../../global/CartContext';
import {useAuth} from "../../../contexts/AuthContext";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm}  from "react-hook-form";
import * as yup from 'yup';
import {LaundryContext} from '../../../global/LaundryContext';
import LaundryCart from '../services/laundryCart.js';
import { useHistory } from 'react-router-dom'

const schema = yup.object().shape({
  firstName: yup
  .string()
  .matches(/^([A-Za-z ]*)$/, "First name should not contain numbers or symbols.")
  .required("Required"),
  lastName: yup
  .string()
  .matches(/^([A-Za-z ]*)$/, "Last name should not contain numbers or symbols.")
  .required("Required"),
  phoneNumber: yup
  .string()
  .matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, "Phone number is not valid.")
  .required("Required"),
  address:yup
  .string()
  .required("Required"),
  city:yup
  .string()
  .required("Required"),
  state:yup
  .string()
  .required("Required"),
  zipCode:yup
  .string()
  .min(5)
  .max(5)
  .matches(/^[0-9]+$/, "Must be only digits")
  .required("Required")
})

export default function Laundry() {

  const {register, handleSubmit, errors} = useForm({
    mode:"onBlur",
    resolver: yupResolver(schema)
  })

    const history = useHistory();
    const [laundryItems, setLaundryItems] = useState([])
    const {dispatch} = useContext(LaundryContext);


    const [showUpdate, setShowUpdate] = useState(false)
    const handleShowUpdate = () => {
      if (!currentUser) {
          history.push('/login');
      }
      else{
        setShowUpdate(true)
      }

    }
    const handleCloseUpdate = () => setShowUpdate(false)

    const [error, setError] = useState('')
    const {currentUser} = useAuth()
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [details, setDetails] = useState([])
    const [dbError, setDbError] = useState('')
    const [userData, setUserData] = useState([])
    const [info, setInfo] = useState([])

    const {dispatchLaundry, totalLaundryQty} = useContext(LaundryContext);

    async function userDetails(){
        await  firestore
          .collection('users')
          .doc(currentUser.uid)
          .get()
          .then(snapshot => setDetails(snapshot.data()))
        }


    useEffect(()=>{
             firestore
               .collection('laundryItems')
               .onSnapshot((snapshot) =>{
                 const newLaundryDetails = snapshot.docs.map((doc) => ({
                   id:doc.id,
                   ...doc.data()
                 }))
                  setLaundryItems(newLaundryDetails)
              })
               function userDetails(){
                if(currentUser){
                   firestore
                    .collection('users')
                    .doc(currentUser.uid)
                    .get()
                    .then(snapshot => setDetails(snapshot.data()))
                  }
                }

                  userDetails()
           },[])



        const handleInputChange = e => {
            const { name, value } = e.target

            setUserData({ ...userData, [name]:value })
        }

          const onSubmit = (data, e) => {
          e.preventDefault();
          setLoading(true)
          setDbError("")
          setMessage("")
          firestore
                .collection("LaundryCart")
                .doc(currentUser.uid)
                .collection("DeliveryInformation")
                .doc(currentUser.uid)
                .set({
                    firstName:userData["firstName"],
                    lastName:userData["lastName"],
                    phoneNumber:userData["phoneNumber"],
                    address:userData["address"],
                    city:userData["city"],
                    state:userData["state"],
                    zipCode:userData["zipCode"]

                },{merge:true}).then(() => {
                    setMessage("Your information has been added to your Cart.")
                  })
              .catch( error => {
                setDbError(error.message);
              })
              setLoading(false)
            }

      async function setDeliveryAddress(){
        setLoading(true)
        setDbError("")
        setMessage("")
        await firestore
                .collection("LaundryCart")
                .doc(currentUser.uid)
                .collection("DeliveryInformation")
                .doc(currentUser.uid)
                .set({
                  firstName:details.firstName,
                  lastName:details.lastName,
                  phoneNumber:details.phoneNumber,
                  address:details.address,
                  city:details.city,
                  state:details.state,
                  zipCode:details.zipCode
                },{merge:true}).then(() => {
                    setMessage("Your information has been added to your Cart.")
                  })
              .catch( error => {
                setDbError(error.message);
              })
              setLoading(false)
        }



      return (
        <Container className="d -flex align-items-center justify-our-content mt-2 mb-5">
        {dbError && <Alert variant="danger">{dbError}</Alert>}
            <div id="laundryServices_block">
              <div id="delieryAddress_container">
                <Button variant="secondary" className="customAddItem w-100" onClick={handleShowUpdate}>Schedule Delivery</Button>
              </div>
            </div>
            <Card>
            <Card.Header as="h3">Laundry Items</Card.Header>
            {laundryItems.map((product) =>
              <Card.Body key={product.id}>
              <ListGroup className="list-group-flush">
                    <div id="ItemHeader">{product.name}</div>
                  <div id="ItemHolder">
                      <div id="ItemImage"><img src={product.image}/></div>
                      <div id="ItemDetails">{product.details}</div>
                  </div>
                  <div id="ItemShop">
                      <div id="ItemCost">Price: ${product.cost}</div>
                      <div id="CartButton"><Button variant="secondary" className="customAddItem"
                          onClick={() => dispatchLaundry({type:'ADD_TO_CART', id: product.id, product})}>
                          Add
                          <span className="fas fa-shopping-cart"></span></Button></div>
                      </div>
              </ListGroup>
              </Card.Body>)}
              </Card>


        <Modal aria-labelledby="contained-modal-title-vcenter" show={showUpdate} onHide={handleCloseUpdate} centered>
          <Modal.Header closeButton>
            <Modal.Title>Update Your Delivery Info</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}

            <Form className="mx-3 pb-3" onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="formBasicCheckbox">
              <Form.Check className="text-success" type="checkbox" label="Use same information stored in our system" onClick={setDeliveryAddress}/>
            </Form.Group>
            <Row>
            <Form.Group as={Col} id="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
              type="text"
              name="firstName"
              onChange = {handleInputChange}
              ref={register}
              />
              <Form.Text className="danger" id="firstNameHelp" muted>{errors?.firstName?.message}</Form.Text>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridlastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="lastName"
              name="lastName"
              onChange = {handleInputChange}
              ref={register}
              />
              <Form.Text className="text-danger" id="lastName" muted>{errors?.lastName?.message}</Form.Text>
            </Form.Group>
          </Row>
            <Form.Group controlId="formGridphoneNumber">
              <Form.Label>Phone No.</Form.Label>
              <Form.Control placeholder="xxx-xxx-xxxx" name="phoneNumber"
              onChange = {handleInputChange}
              ref={register}/>
              <Form.Text className="text-danger" id="phoneNumber" muted>{errors?.phoneNumber?.message}</Form.Text>
            </Form.Group>

            <Form.Group controlId="formGridAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control placeholder="Apartment, studio, or floor" name="address"
              onChange = {handleInputChange}
              ref={register}/>
              <Form.Text className="text-danger" id="address" muted>{errors?.address?.message}</Form.Text>
            </Form.Group>

            <Form.Row>
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>City</Form.Label>
                <Form.Control name="city"
                onChange = {handleInputChange}
                ref={register}/>
                <Form.Text className="text-danger" id="city" muted>{errors?.city?.message}</Form.Text>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>State</Form.Label>
                <Form.Control as="select" name="state"  onChange = {handleInputChange} ref={register}>
                    <option value="N/A">Choose...</option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="DC">District Of Columbia</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                </Form.Control>
                <Form.Text className="text-danger" id="state" muted>{errors?.state?.message}</Form.Text>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridzipCode">
                <Form.Label>zip Code</Form.Label>
                <Form.Control name="zipCode"
                onChange = {handleInputChange}
                ref={register}
                />
                <Form.Text className="text-danger" id="zipCode" muted>{errors?.zipCode?.message}</Form.Text>
              </Form.Group>
            </Form.Row>

            <Button disabled={loading} variant="primary mt-2" type="submit">
              Submit
            </Button>
          </Form>
          </Modal.Body>
          </Modal>
          </Container>
      )
}
