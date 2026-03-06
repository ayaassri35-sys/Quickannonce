const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./database');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;

// Connecter à MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Importer les utilisateurs existants dans MongoDB (une seule fois)
const importExistingUsers = async () => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      // Utilisateurs par défaut
      const defaultUsers = [
        {
          id: '1',
          email: 'admin@example.com',
          password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
          name: 'Admin',
          role: 'admin'
        },
        {
          id: '2', 
          email: 'user@example.com',
          password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
          name: 'User',
          role: 'user'
        },
        {
          id: '3', 
          email: 'ayaassri35@gmail.com',
          password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "123456"
          name: 'Aya Assri',
          role: 'user'
        }
      ];
      
      await User.insertMany(defaultUsers);
      console.log('✅ Utilisateurs par défaut importés dans MongoDB');
    }
  } catch (error) {
    console.error('❌ Erreur import utilisateurs:', error);
  }
};

// Importer les utilisateurs au démarrage
importExistingUsers();

// Middleware de vérification JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token requis' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

// Route d'inscription
app.post('/api/auth/register', async (req, res) => {
  console.log('=== DEBUG INSCRIPTION ===');
  console.log('Données reçues:', req.body);
  
  const { email, password, name } = req.body;

  try {
    // Validation
    if (!email || !password || !name) {
      console.log('❌ Validation échouée: champs manquants');
      return res.status(400).json({ 
        success: false, 
        message: 'Email, mot de passe et nom sont requis' 
      });
    }

    console.log('📧 Email reçu:', email);
    console.log('👤 Nom reçu:', name);

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    console.log('🔍 Utilisateur existant:', existingUser);
    
    if (existingUser) {
      console.log('❌ Email déjà utilisé');
      return res.status(400).json({ 
        success: false, 
        message: 'Cet email est déjà utilisé' 
      });
    }

    console.log('🔐 Hashage du mot de passe...');
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Mot de passe hashé');

    console.log('📊 Comptage utilisateurs existants...');
    const userCount = await User.countDocuments();
    console.log('📊 Nombre d\'utilisateurs:', userCount);

    // Créer le nouvel utilisateur
    const newUser = new User({
      id: (userCount + 1).toString(),
      email,
      password: hashedPassword,
      name,
      role: 'user'
    });

    console.log('💾 Sauvegarde utilisateur...');
    // Sauvegarder dans MongoDB
    await newUser.save();
    console.log('✅ Utilisateur sauvegardé:', newUser.id);

    console.log('🎟️ Génération tokens...');
    // Générer les tokens
    const token = jwt.sign(
      { 
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: newUser.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Tokens générés');

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      token,
      refreshToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('❌ ERREUR INSCRIPTION DÉTAILLÉE:', error);
    console.error('❌ Stack trace:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur',
      error: error.message 
    });
  }
});

// Route de connexion
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Trouver l'utilisateur dans MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email ou mot de passe incorrect' 
      });
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email ou mot de passe incorrect' 
      });
    }

    // Générer les tokens
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// Route de rafraîchissement
app.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ 
      success: false, 
      message: 'Refresh token requis' 
    });
  }

  jwt.verify(refreshToken, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Refresh token invalide' 
      });
    }

    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(403).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }

    // Générer nouveau token
    const newToken = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      token: newToken
    });
  });
});

// Route protégée exemple
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ 
      success: false, 
      message: 'Utilisateur non trouvé' 
    });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

// Route de déconnexion
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  res.json({ success: true });
});

// Endpoint admin pour voir toutes les données (pour debug)
app.get('/api/admin/debug', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json({
      success: true,
      users: users,
      message: 'Utilisez /api/admin/debug/users pour voir les utilisateurs'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// Endpoint pour voir les utilisateurs
app.get('/api/admin/debug/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
  console.log(`Endpoints de debug disponibles:`);
  console.log(`- GET http://localhost:${PORT}/api/admin/debug`);
  console.log(`- GET http://localhost:${PORT}/api/admin/debug/users`);
});
