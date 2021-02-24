import React, {useRef, useState} from "react";
import {Card, Form, Button, Container, Alert} from "react-bootstrap";
import {Link, useHistory} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext";
import {firestore} from "../../firebase";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm}  from "react-hook-form";
import * as yup from 'yup';

const schema = yup.object().shape({
  firstname: yup
  .string()
  .matches(/^([^0-9]*)$/, "First name should not contain numbers.")
  .required("First name is required field"),
  lastname: yup
  .string()
  .matches(/^([^0-9]*)$/, "Last name should not contain numbers.")
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
    const [firstname, setFirstName] = useState()
    const [lastname, setLastName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [streetname, setStreetName] = useState()
    const [cityname, setCityName] = useState()
    const [statename, setStateName] = useState()
    const [zip, setZip] = useState()
    const {signup} = useAuth()
    const [failed, setFailed] = useState()
    const [loading, setLoading] = useState(false)
    const history = useHistory()


    const onSubmit = (data) => {

      try{
        setStreetName("N/A")
        setCityName("N/A")
        setStateName("N/A")
        setZip("N/A")
        setLoading(true)
        signup(emailRef.current.value, passwordRef.current.value).then(cred => {
          return firestore
            .collection("users")
            .doc(cred.user.uid)
            .set({
              firstname,
              lastname,
              streetname,
              cityname,
              statename,
              zip
            })
            .then(() => {
              setFirstName('')
              setLastName('')
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
    <Container className="d -flex align-items-center justify-our-content mt-5">
    <Card>
      <Card.Body>
        <h2 className="text-center wb-4">Sign-Up</h2>
        {failed && <Alert variant="danger">{failed}</Alert>}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group id="firstname">
            <Form.Label>Firstname</Form.Label>
            <Form.Control
            type="text"
            placeholder="Enter your first name"
            ref={register} name="firstname"
            value={firstname}
            onChange = {e => setFirstName(e.currentTarget.value)}
            >
            </Form.Control>
            <Form.Text className="text-danger" id="firstnameHelp" muted>{errors?.firstname?.message}</Form.Text>
          </Form.Group>


          <Form.Group id="lastname">
            <Form.Label>Lastname</Form.Label>
            <Form.Control
            type="text"
            placeholder="Enter your last name"
            name="lastname"
            ref={register}
            value={lastname}
            onChange = {e => setLastName(e.currentTarget.value)}
            >
            </Form.Control>
            <Form.Text className="text-danger" id="lastnameHelp" muted>{errors?.lastname?.message}</Form.Text>
          </Form.Group>

          <Form.Group id="email">
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

            <Form.Group id="paswword">
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

            <Form.Group id="passwordConfirm">
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

            <Button disabled={loading} className="w-100" type="submit ">Sign-Up</Button>
        </Form>
      </Card.Body>
    </Card>
    <div className="w-100 text-center mt-2">
      Already have an account?<Link to='/login'> Log In</Link>
    </div>
    </Container>
  )
}
