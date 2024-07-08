import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Navbar } from "react-bootstrap";
//import { enableNotifications } from '../../service/user-account-manager.js';

const AddIdeas = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    createdAt: "",
    lastname: "",
    firstname: "",
  });
  const navigate = useNavigate(); // Hook de redirection

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === "radio" ? value === "true" : value;
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/ideas/", formData);

      // Rediriger vers la page d'accueil après l'ajout
      navigate("/ideas");
    } catch (error) {
      console.error("Error adding Ideas:", error);
    }
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/ideas">Home</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
        </Container>
      </Navbar>
      <Container>
        <h2>Ajouter une idée dans la boite</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title">
            <Form.Label>Titre : </Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="description">
            <Form.Label>Description : </Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="firstname">
            <Form.Label>Nom : </Form.Label>
            <Form.Control
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="lastname">
            <Form.Label>Prenom : </Form.Label>
            <Form.Control
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Ajouter
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default AddIdeas;
