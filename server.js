const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(express.json());

// Configuración de Sequelize con Postgres
const sequelize = new Sequelize('crud_db', 'admin', 'admin123', {
  host: 'db',
  dialect: 'postgres'
});

// Modelo Usuario
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  }
});

// Sincronizar modelo con DB
sequelize.sync()
  .then(() => console.log('✅ DB conectada y modelo sincronizado'))
  .catch(err => console.error('❌ Error en DB:', err));

// Rutas CRUD
app.get('/users', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

app.post('/users', async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

app.put('/users/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    await user.update(req.body);
    res.json(user);
  } else {
    res.status(404).json({ error: 'Usuario no encontrado' });
  }
});

app.delete('/users/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    await user.destroy();
    res.json({ message: 'Usuario eliminado' });
  } else {
    res.status(404).json({ error: 'Usuario no encontrado' });
  }
});

// Iniciar servidor en variable PORT o 3000 por defecto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
