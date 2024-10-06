// Importer Express
const express = require('express');
const app = express();
const port = 3500;
const fs = require('fs');
const cors = require('cors')
const csv = require('csv-parser');
app.use(cors());
// Middleware pour parser les données JSON
app.use(express.json());

// Exemple de route GET (récupérer des données)
app.get('/get-csv', (req, res) => {
  const results = [];
  fs.createReadStream('./data.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
          res.json(results); // Envoi des résultats au format JSON
      })
      .on('error', (err) => {
          res.status(500).send('Erreur lors de la lecture du fichier CSV');
      });
});

// Exemple de route POST (ajouter des données)
app.post('/api/data', (req, res) => {
  const newData = req.body; // Obtenez les données envoyées par le client
  res.json({
    message: 'Données reçues',
    data: newData
  });
});

// Exemple de route PUT (mettre à jour des données)
app.put('/api/data/:id', (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  res.json({
    message: `Données mises à jour pour l'ID ${id}`,
    updatedData: updatedData
  });
});

// Exemple de route DELETE (supprimer des données)
app.delete('/api/data/:id', (req, res) => {
  const id = req.params.id;
  res.json({
    message: `Données supprimées pour l'ID ${id}`

  });
});

// Démarrer le serveur
app.listen(port, (req,res) => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
  
});

