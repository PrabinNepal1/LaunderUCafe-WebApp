import React, {useState} from 'react'
import {Form, Button, Container, Alert} from "react-bootstrap";
import Axios from "axios";

export default function ContactUs() {

  const [formData, setFormData] = useState({})
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const updateInput = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  const handleSubmit = event => {
    event.preventDefault()
    sendEmail()
    setFormData({
      name: '',
      email: '',
      message: '',
    })
  }
  const sendEmail = () => {
    Axios.post(
      'https://us-central1-launderucafe-e4099.cloudfunctions.net/submit',
      formData
    ).then(
      setMessage("Your message has been sent.We will get back to you soon.")
    )
    .catch(error => {
        setError(error.message)
      })
  }


  return (
    <Container className="d -flex align-items-center justify-our-content mt-5 w-50">
    {message && <Alert variant="success">{message}</Alert>}
    {error && <Alert variant="danger">{error}</Alert>}
    <Form onSubmit={handleSubmit}>
    <Form.Group controlId="formName">
    <Form.Label>Full Name</Form.Label>
      <Form.Control
        type="text"
        name="name"
        placeholder="Name"
        onChange={updateInput}
        value={formData.name || ''}
      />
      </Form.Group>
      <Form.Group controlId="forEmail" className="mt-2">
      <Form.Label>Email Address</Form.Label>
        <Form.Control
        type="email"
        name="email"
        placeholder="Email"
        onChange={updateInput}
        value={formData.email || ''}
      />
      </Form.Group>
      <Form.Group controlId="formMessage" className="mt-3">
      <Form.Label>Message</Form.Label>
        <Form.Control
        as="textarea" rows={3}
        name="message"
        placeholder="Message"
        onChange={updateInput}
        value={formData.message || ''}
      />
      </Form.Group>

      <Button className="mt-2 mb-5" variant="primary" type="submit">Submit</Button>
    </Form>
  </Container>
  )
}
