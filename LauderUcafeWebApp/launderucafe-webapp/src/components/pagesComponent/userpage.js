import React, {useRef, useState, useEffect} from 'react';
import {firestore} from "../../firebase";
import {Form, Button, Card, Container, Alert, Col, Modal, CardGroup} from 'react-bootstrap'
import {useAuth} from "../../contexts/AuthContext";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm}  from "react-hook-form";
import * as yup from 'yup';

const passwordSchema = yup.object().shape({
  password: yup
  .string()
  .required("Password is required field")
  .min(8, 'Password is too short - should be 8 chars minimum.')
  .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
  passwordConfirm: yup
  .string()
  .required("Please confirm your password")
  .oneOf([yup.ref("password"), null], "Password doesn't match")
})

export default function UserPage() {

  const {register, handleSubmit, errors} = useForm({
    mode:"onBlur",
    resolver: yupResolver(passwordSchema)
  })

  const [showUpdate, setShowUpdate] = useState(false)
  const handleShowUpdate = () => setShowUpdate(true)
  const handleCloseUpdate = () => setShowUpdate(false)
  const [showReset, setShowReset] = useState(false)
  const handleShowReset = () => setShowReset(true)
  const handleCloseReset = () => setShowReset(false)

  const {currentUser, updatePassword} = useAuth()
  const passwordRef = useRef()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [details, setDetails] = useState([])
  const [firstname, setFirstName] = useState()
  const [lastname, setLastName] = useState()
  const [streetname, setStreetName] = useState()
  const [cityname, setCityName] = useState()
  const [statename, setStateName] = useState()
  const [zip, setZip] = useState()

function addUserDetails(){
  setLoading(true)
  setError("")
  setMessage("")
    firestore
        .collection("users")
        .doc(currentUser.uid)
        .update({
            firstname,
            lastname,
            streetname,
            cityname,
            statename,
            zip
        }).then(() => {
            setFirstName('')
            setLastName('')
            setStreetName('')
            setCityName('')
            setStateName('')
            setZip('')
            setMessage("Profile Updated Successfully!")
          })
      .catch( error => {
        setError(error.message);
      })
      setLoading(false)
    }

   async function userDetails(){
    await  firestore
      .collection('users')
      .doc(currentUser.uid)
      .get()
      .then(snapshot => setDetails(snapshot.data()))
    }

  useEffect(()=>{
    userDetails()
  }, [])



  const onSubmit = (data, e) =>{
    e.preventDefault()
      setLoading(true)
      setError("")
     updatePassword(passwordRef.current.value).then(() => {
            setMessage("Successfully Update Your Password")
          })
          .catch( error => {
            setError(error.message);
          })
          .finally(() => {
            setLoading(false)
          })
}


  return(
      <div>
      <Container className="d -flex align-items-left justify-our-content mt-5">
      <CardGroup>
      <Card>
        <Card.Header as="h5"><i className="far fa-address-card"></i> Profile</Card.Header>
        <Card.Body>
          <Card.Title><i className="fas fa-user"></i> {details.firstname} {details.lastname}</Card.Title>
            <Card.Title><i className="fas fa-envelope-open-text"></i> Your Email: {currentUser.email}</Card.Title>
            <Card.Title><i className="fas fa-map-marker-alt"></i> Your Address</Card.Title>
              <Card.Title className="px-3 mx-3">Street: {details.streetname}</Card.Title>
              <Card.Title className="px-3 mx-3">City: {details.cityname}</Card.Title>
              <Card.Title className="px-3 mx-3">State: {details.statename}</Card.Title>
              <Card.Title className="px-3 mx-3">Zip: {details.zip}</Card.Title>
          <Card.Text as="h6" className="mt-3">
              Update Your Details!
          </Card.Text>
          <Button variant="primary" onClick={handleShowUpdate}><i className="fas fa-user-edit"></i> Edit Profile</Button>
        </Card.Body>
        </Card>
        <Card className="text-center" border="light">
            <Card.Header as="h5"><i className="fas fa-user-cog"></i> Manage Your Account</Card.Header>
            <Card.Body>
              <Card.Text as="h6" className="mx-2 pb">
                Reset Your Password
              </Card.Text>
              <Button variant="danger" onClick={handleShowReset}><i className="fas fa-key"></i> Reset</Button>
              </Card.Body>
              </Card>
        </CardGroup>
        </Container>

      <Modal aria-labelledby="contained-modal-title-vcenter" show={showUpdate} onHide={handleCloseUpdate} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Your Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form className="mx-3 pb-3">
          <Form.Row>
            <Form.Group as={Col} id="firstname">
              <Form.Label>First Name</Form.Label>
              <Form.Control
              type="text"
              name="firstname"
              value={details.firstname}
              onChange = {e => setFirstName(e.currentTarget.value)}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="lastname"
              name="lastname"
              defaultValue={details.lastname}
              onChange = {e => setLastName(e.currentTarget.value)}/>
            </Form.Group>
          </Form.Row>

          <Form.Group controlId="formGridAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control placeholder="Apartment, studio, or floor" name="streetname"
            value={streetname}
            onChange = {e => setStreetName(e.currentTarget.value)}/>
          </Form.Group>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>City</Form.Label>
              <Form.Control name="cityname"
              value={cityname}
              onChange = {e => setCityName(e.currentTarget.value)}/>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>State</Form.Label>
              <Form.Control as="select" defaultValue="Choose..." name="statename">
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
              onChange = {e => setCityName(e.currentTarget.value)}/>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridZip">
              <Form.Label>Zip</Form.Label>
              <Form.Control name="zip"
              value={zip}
              onChange = {e => setZip(e.currentTarget.value)}
              />
            </Form.Group>
          </Form.Row>

          <Form.Group id="formGridCheckbox">
            <Form.Check type="checkbox" required label="Check me out" />
          </Form.Group>

          <Button disabled={loading} variant="primary" type="button" onClick={addUserDetails}>
            Submit
          </Button>
        </Form>
        </Modal.Body>
        </Modal>

        <Modal aria-labelledby="contained-modal-title-vcenter" show={showReset} onHide={handleCloseReset} centered>
          <Modal.Header closeButton>
            <Modal.Title>Reset Your Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form className="mx-3 pb-3" onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="formGridNewPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control type="password" placeholder="Password"
            ref={register}
            name="password"
            ref={(e) =>{
            register(e)
            passwordRef.current = e
            }}
            />
          <Form.Text className="text-danger" id="passwordHelp" muted>{errors?.password?.message}</Form.Text>
          </Form.Group>
          <Form.Group controlId="formGridConfirmNewPassWord">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control type="password" placeholder="Password"
            ref={register}
            name="passwordConfirm"
            />
          <Form.Text className="text-danger" id="passwordConfirmHelp" muted>{errors?.passwordConfirm?.message}</Form.Text>
          </Form.Group>
          <Button disable={loading} variant="primary" type="submit">
            Submit
          </Button>
        </Form>
          </Modal.Body>
          </Modal>
      </div>
  );
}
