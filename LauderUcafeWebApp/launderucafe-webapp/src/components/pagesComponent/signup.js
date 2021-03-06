import React, {useRef, useState} from "react";
import {Card, Form, Button, Container, Alert} from "react-bootstrap";
import {Link, useHistory} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext";
import {firestore} from "../../firebase";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm}  from "react-hook-form";
import * as yup from 'yup';

const schema = yup.object().shape({
  firstName: yup
  .string()
  .matches(/^([A-Za-z ]*)$/, "First name should not contain numbers or symbols.")
  .required("First name is required field"),
  lastName: yup
  .string()
  .matches(/^([A-Za-z ]*)$/, "Last name should not contain numbers or symbols.")
  .required("Last name is required field"),
  email: yup
  .string()
  .email("Email should have correct format")
  .required("Email is required field"),
  password: yup
  .string()
  .min(8, 'Password is too short - should be 8 chars minimum.')
  .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    )
  .required("Password is required field"),
  passwordConfirm: yup
  .string()
  .required("Please confirm your password")
  .oneOf([yup.ref("password"), null], "Password doesn't match")
})

export default function Signup() {
    const {register, handleSubmit, errors} = useForm({
      mode:"onBlur",
      resolver: yupResolver(schema)
    })

    const emailRef = useRef()
    const passwordRef = useRef()
    const [uid, setUid] = useState()
    const [firstName, setfirstName] = useState()
    const [lastName, setlastName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [phoneNumber, setphoneNumber] = useState("N/A")
    const [address, setAddress] = useState("N/A")
    const [city, setcity] = useState("N/A")
    const [state, setstate] = useState("N/A")
    const [zipCode, setzipCode] = useState("N/A")
    const {signup} = useAuth()
    const [failed, setFailed] = useState()
    const [loading, setLoading] = useState(false)
    const history = useHistory()


    const onSubmit = (data) => {

      try{
        setLoading(true)
        signup(emailRef.current.value, passwordRef.current.value).then(cred => {
          return firestore
            .collection("users")
            .doc(cred.user.uid)
            .set({
              uid: cred.user.uid,
              firstName,
              lastName,
              phoneNumber,
              address,
              city,
              state,
              zipCode
            })
            .then(() => {
              setUid('')
              setfirstName('')
              setlastName('')
              setEmail('')
              setPassword('')
              setConfirmPassword('')
              history.push("/")
            })
        })
        .catch( error => {
          setFailed(error.message);
        })
      }
     catch{
        setFailed('Failed to create an account!')
     }
      setLoading(false)
    }

    return (
    <Container className="d -flex align-items-center justify-our-content mt-5 mb-5">
    <Card>
      <Card.Body>
        <h2 className="text-center wb-4">Sign-Up</h2>
        {failed && <Alert variant="danger">{failed}</Alert>}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group id="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
            type="text"
            placeholder="Enter your first name"
            ref={register} name="firstName"
            value={firstName}
            onChange = {e => setfirstName(e.currentTarget.value)}
            >
            </Form.Control>
            <Form.Text className="text-danger" id="firstNameHelp" muted>{errors?.firstName?.message}</Form.Text>
          </Form.Group>


          <Form.Group className="mt-2" id="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
            type="text"
            placeholder="Enter your last name"
            name="lastName"
            ref={register}
            value={lastName}
            onChange = {e => setlastName(e.currentTarget.value)}
            >
            </Form.Control>
            <Form.Text className="text-danger" id="lastNameHelp" muted>{errors?.lastName?.message}</Form.Text>
          </Form.Group>

          <Form.Group className="mt-2" id="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
            type="email"
            placeholder="Enter your email"
            name="email"
            ref={(e) =>{
            register(e)
            emailRef.current = e
          }}
          value={email}
          onChange = {e => setEmail(e.currentTarget.value)}
          >
            </Form.Control>
            <Form.Text className="text-danger" id="emailHelp" muted>{errors?.email?.message}</Form.Text>
          </Form.Group>

            <Form.Group className="mt-2" id="paswword">
              <Form.Label>Password</Form.Label>
              <Form.Control
              type="password"
              placeholder="Enter your password"
              name="password"
              ref={(e) =>{
              register(e)
              passwordRef.current = e
              }}
              value={password}
              onChange = {e => setPassword(e.currentTarget.value)}
              >
              </Form.Control>
              <Form.Text className="text-danger" id="passwordHelp" muted>{errors?.password?.message}</Form.Text>
            </Form.Group>

            <Form.Group className="mt-2" id="passwordConfirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
              type="password"
              placeholder="Confirm your password from above"
              name="passwordConfirm"
              ref={register}
              value={confirmPassword}
              onChange = {e => setConfirmPassword(e.currentTarget.value)}
              >
              </Form.Control>
              <Form.Text className="text-danger" id="passwordConfirmHelp" muted>{errors?.passwordConfirm?.message}</Form.Text>
            </Form.Group>

            <Button disabled={loading} className="w-100 mt-2" type="submit ">Sign-Up</Button>
        </Form>
      </Card.Body>
    </Card>
    <div className="w-100 text-center mt-2">
      Already have an account? <Link to='/login'> Log In</Link>
    </div>
    </Container>
  )
}
