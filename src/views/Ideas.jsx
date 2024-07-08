import { useContext, useEffect, useState } from "react";
import { CountContext } from "../Provider";
import axios from "axios";
import {
  Container,
  Navbar,
  Card,
  ListGroup,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { enableNotifications } from "../services/user-account-manager";

const Ideas = () => {
  const [state, dispatch] = useContext(CountContext);
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    const fetchIdeas = async () => {
      dispatch({ type: "Request" });
      try {
        const response = await axios.get("http://localhost:3000/ideas/");
        dispatch({
          type: "ideaSucess",
          payload: response.data.idea,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des idées:", error);
        dispatch({
          type: "ideaError",
          payload: error.message,
        });
      }
    };

    fetchIdeas();

    // Activer les notifications push
    enableNotifications();
  }, [dispatch]);

  const handleVote = async (id, voteType) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/ideas/${id}/vote`,
        { voteType }
      );
      const updatedIdea = response.data;
      setIdeas(
        ideas.map((idea) => (idea.id === updatedIdea.id ? updatedIdea : idea))
      );
    } catch (error) {
      console.error("Erreur lors du vote :", error);
      // Gérer l'erreur ici
    }
  };

  return (
    <>
      <div>
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="/ideas">Home</Navbar.Brand>
            <Navbar.Brand href="/ideas/create">Ajouter une idée</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
          </Container>
        </Navbar>
        <h2>Boite à idée :</h2>
        {state.loading ? (
          <p>Loading ideas...</p>
        ) : state.error ? (
          <p>Error: {state.error}</p>
        ) : (
          <Row xs={1} md={2} lg={2} xl={1} className="g-4">
            {state.ideas.map((idea, index) => (
              <Col key={idea.id}>
                <Card>
                  <Card.Body>
                    <Card.Title>Boite à idée n° {index}</Card.Title>
                    <ListGroup variant="flush">
                      <ListGroup.Item>titre : {idea.title}</ListGroup.Item>
                      <ListGroup.Item>
                        description : {idea.description}{" "}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        idée de : {idea.lastname} {idea.firstname}{" "}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        crée le :{" "}
                        {format(new Date(idea.createdAt), "eeee d MMMM yyyy", {
                          locale: fr,
                        })}{" "}
                      </ListGroup.Item>
                    </ListGroup>
                    <Button
                      variant="success"
                      onClick={() => handleVote(idea.id, "pour")}
                    >
                      Pour <span className="badge bg-success">{idea.pour}</span>
                    </Button>{" "}
                    <Button
                      variant="danger"
                      onClick={() => handleVote(idea.id, "contre")}
                    >
                      Contre{" "}
                      <span className="badge bg-danger">{idea.contre}</span>
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </>
  );
};
export default Ideas;
