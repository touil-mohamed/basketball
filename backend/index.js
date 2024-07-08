const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const webPush = require("web-push");

// Charger le fichier .env
dotenv.config();

// Configurer la connexion à la base de données
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
};

// Fonction pour créer une connexion à la base de données
async function createDatabaseConnection() {
  return await mysql.createConnection(dbConfig);
}

// Générer et configurer les clés VAPID pour Web Push
const vapidKeys = webPush.generateVAPIDKeys();

webPush.setVapidDetails(
  "mailto:momo2grem@gmail.com",
  process.env.VAPID_PUBLIC_KEY || vapidKeys.publicKey,
  process.env.VAPID_PRIVATE_KEY || vapidKeys.privateKey
);

// Stocker les abonnements en mémoire (vous pouvez les stocker dans la base de données pour une solution plus persistante)
const subscriptions = [];

// Initialiser l'application Express
const app = express();

// Utiliser bodyParser pour analyser les requêtes JSON
app.use(bodyParser.json());

// Utiliser CORS pour permettre les requêtes cross-origin
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Route pour obtenir toutes les idées
app.get("/ideas", async (req, res) => {
  const connection = await createDatabaseConnection();
  try {
    const [rows] = await connection.execute("SELECT * FROM idea");
    res.send({
      idea: rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await connection.end();
  }
});

// Route pour créer une nouvelle idée
app.post("/ideas", async (req, res) => {
  const { title, description, lastname, firstname } = req.body;

  try {
    const connection = await createDatabaseConnection();
    const [result] = await connection.execute(
      "INSERT INTO idea (title, description, createdAt, lastname, firstname ) VALUES (?, ?,  NOW(), ?, ?)",
      [title, description, lastname, firstname]
    );
    await connection.end();

    const newIdea = {
      id: result.insertId,
      title,
      description,
      createdAt: new Date(),
      lastname,
      firstname,
    };
    // Envoyer une notification push à tous les abonnés
    const payload = JSON.stringify({
      title: "Nouvelle suggestion",
      body: "Hey ! il y a du nouveau dans la boite à idées 😁",
    });
    subscriptions.forEach((subscription) => {
      webPush
        .sendNotification(subscription, payload)
        .catch((error) => console.error("Error sending notification:", error));
    });

    res.status(201).json(newIdea);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Middleware pour obtenir une idée par ID
async function getIdea(req, res, next) {
  const connection = await createDatabaseConnection();
  try {
    const [rows] = await connection.execute("SELECT * FROM idea WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Idée non trouvée" });
    }
    res.idea = rows[0];
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await connection.end();
  }
}

// Route pour obtenir une idée par ID
app.get("/ideas/:id", getIdea, (req, res) => {
  res.json(res.idea);
});

// Route pour mettre à jour une idée
app.patch("/ideas/:id", getIdea, async (req, res) => {
  const { title, description } = req.body;
  const connection = await createDatabaseConnection();
  try {
    const updatedIdea = {
      ...res.idea,
      title: title !== undefined ? title : res.idea.title,
      description:
        description !== undefined ? description : res.idea.description,
    };
    await connection.execute(
      "UPDATE idea SET title = ?, description = ? WHERE id = ?",
      [updatedIdea.title, updatedIdea.description, req.params.id]
    );
    res.json(updatedIdea);
  } catch (error) {
    res.status(400).json({ message: error.message });
  } finally {
    await connection.end();
  }
});

// Route pour supprimer une idée
app.delete("/ideas/:id", getIdea, async (req, res) => {
  const connection = await createDatabaseConnection();
  try {
    await connection.execute("DELETE FROM idea WHERE id = ?", [req.params.id]);
    res.json({ message: "Idée supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await connection.end();
  }
});

// Route pour obtenir la clé publique VAPID
app.get("/push/key", (req, res) => {
  res.json({
    pubkey: process.env.VAPID_PUBLIC_KEY || vapidKeys.publicKey,
  });
});

// Route pour ajouter un nouvel abonnement
app.post("/push/sub", (req, res) => {
  subscriptions.push(req.body);
  res.json({});
});

// Route pour voter pour ou contre une idée
app.post("/ideas/:id/vote", async (req, res) => {
  const { voteType } = req.body;
  const ideaId = req.params.id;

  try {
    const connection = await createDatabaseConnection();
    let [result] = await connection.execute(
      `UPDATE idea SET ${voteType} = ${voteType} + 1 WHERE id = ?`,
      [ideaId]
    );

    // Récupérer l'idée mise à jour
    [result] = await connection.execute("SELECT * FROM idea WHERE id = ?", [
      ideaId,
    ]);
    const updatedIdea = result[0];

    await connection.end();

    res.status(200).json(updatedIdea);
  } catch (error) {
    console.error("Erreur lors du vote :", error);
    res.status(400).json({ message: "Erreur lors du vote" });
  }
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
