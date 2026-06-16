-- =============================================================
--  SCRIPT DE PEUPLEMENT - Base de données Géocaching
--  Génère des données réalistes pour toutes les tables
-- =============================================================

USE mydatabase;

-- Désactiver les vérifications FK temporairement
SET FOREIGN_KEY_CHECKS = 0;

-- Vider les tables existantes (ordre inverse des dépendances)
TRUNCATE TABLE visite;
TRUNCATE TABLE cache;
TRUNCATE TABLE affectation;
TRUNCATE TABLE reseau;
TRUNCATE TABLE utilisateur;
TRUNCATE TABLE type_cache;
TRUNCATE TABLE etat_cache;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================
-- 1. ÉTATS DE CACHE
-- =============================================================
INSERT INTO etat_cache (libelle) VALUES
('Actif'),
('Inactif'),
('Archivé'),
('En maintenance'),
('Temporairement désactivé'),
('En attente de validation'),
('Signalé comme endommagé');

-- =============================================================
-- 2. TYPES DE CACHE
-- =============================================================
INSERT INTO type_cache (libelle) VALUES
('Traditionnel'),
('Multi-cache'),
('Cache mystère'),
('Cache terrestre'),
('Cache virtuelle'),
('Earthcache'),
('Letterbox Hybrid'),
('Webcam'),
('Cache événement'),
('Méga-événement'),
('CITO (Cache In Trash Out)'),
('Cache Lost and Found'),
('Cache Whereigo');

-- =============================================================
-- 3. UTILISATEURS
--    Mots de passe hashés (bcrypt simulé pour l'exemple)
--    En production, utiliser un vrai hash bcrypt
-- =============================================================
INSERT INTO utilisateur (pseudo, mot_de_passe, admin) VALUES
-- Administrateurs
('AdminChief',    '$2b$12$xK9mL3pQrZ8nVwY5tU2eAuGjHdFsIqWcBvNzOlPkMrXyTaEh6Cg0S', 1),
('SuperCache',    '$2b$12$aB3cD4eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5aB6cD7eF8gH9iJ0', 1),

-- Utilisateurs réguliers
('GéoChasseur31',    '$2b$12$mN8kP2qL5rT9vX3yZ7bA1cD4eF6gH0iJ2kL4mN6oP8qR0sT2uV4wX', 0),
('TrésORupeuse',     '$2b$12$zA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR', 0),
('BoussoleDor',      '$2b$12$hI1jJ2kK3lL4mM5nN6oO7pP8qQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ', 0),
('ExplorateurFou',   '$2b$12$eF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT0uU1vV2wW', 0),
('CacheNinja42',     '$2b$12$bC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6qQ7rR8sS9tT', 0),
('Montagnarde77',    '$2b$12$yZ0aA1bB2cC3dD4eE5fF6gG7hH8iI9jJ0kK1lL2mM3nN4oO5pP6q', 0),
('RandoGeek',        '$2b$12$vW4xX5yY6zZ7aA8bB9cC0dD1eE2fF3gG4hH5iI6jJ7kK8lL9mM0nN', 0),
('PisteSauvage',     '$2b$12$sT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2eE3fF4gG5hH6iI7jJ8kK', 0),
('UrbanExplorer',    '$2b$12$pQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2eE3fF4gG5h', 0),
('ForêtMagique',     '$2b$12$mN6oO7pP8qQ9rR0sS1tT2uU3vV4wW5xX6yY7zZ8aA9bB0cC1dD2e', 0),
('TroglodytePro',    '$2b$12$jK4lL5mM6nN7oO8pP9qQ0rR1sS2tT3uU4vV5wW6xX7yY8zZ9aA0b', 0),
('AventuriersClub',  '$2b$12$gH2iI3jJ4kK5lL6mM7nN8oO9pP0qQ1rR2sS3tT4uU5vV6wW7xX8y', 0),
('GéoPassionné',     '$2b$12$dE0fF1gG2hH3iI4jJ5kK6lL7mM8nN9oO0pP1qQ2rR3sS4tT5uU6v', 0);

-- =============================================================
-- 4. RÉSEAUX DE CACHES
-- =============================================================
INSERT INTO reseau (id_proprietaire, nom_reseau) VALUES
-- Réseaux créés par les admins
(1, 'Réseau Île-de-France Historique'),
(1, 'Circuit des Châteaux de la Loire'),
(2, 'Les Mystères de Paris'),
(2, 'Bretagne Sauvage'),

-- Réseaux créés par les utilisateurs
(3,  'Caches Pyrénéennes'),
(4,  'Normandie Débarquement'),
(5,  'Alps & Cache'),
(6,  'Massif Central Aventure'),
(7,  'Côte d\'Azur Découverte'),
(8,  'Vosges en Cache'),
(9,  'Alsace Pittoresque'),
(10, 'Bordelais Vignoble'),
(11, 'Provence Lavande'),
(12, 'Dordogne Préhistorique'),
(13, 'Loire-Atlantique Côtière'),
(14, 'Ardennes Secrètes');

-- =============================================================
-- 5. AFFECTATIONS (membres des réseaux)
-- =============================================================
INSERT INTO affectation (id_utilisateur, id_reseau, date_affectation) VALUES
-- Réseau 1 : Île-de-France Historique
(1,  1, '2022-01-15'),
(3,  1, '2022-02-10'),
(5,  1, '2022-03-05'),
(7,  1, '2022-04-20'),
(9,  1, '2022-06-12'),
(11, 1, '2023-01-08'),

-- Réseau 2 : Circuit des Châteaux de la Loire
(1,  2, '2022-01-15'),
(4,  2, '2022-05-20'),
(6,  2, '2022-07-14'),
(8,  2, '2023-02-28'),
(13, 2, '2023-09-15'),

-- Réseau 3 : Les Mystères de Paris
(2,  3, '2022-02-01'),
(3,  3, '2022-02-15'),
(10, 3, '2022-08-30'),
(12, 3, '2023-03-10'),

-- Réseau 4 : Bretagne Sauvage
(2,  4, '2022-03-01'),
(4,  4, '2022-09-05'),
(13, 4, '2022-11-20'),

-- Réseau 5 : Caches Pyrénéennes
(3,  5, '2022-04-10'),
(8,  5, '2022-10-18'),
(15, 5, '2023-05-25'),

-- Réseau 6 : Normandie Débarquement
(4,  6, '2022-05-06'),
(6,  6, '2022-06-18'),
(9,  6, '2022-08-22'),

-- Réseau 7 : Alps & Cache
(5,  7, '2022-06-01'),
(7,  7, '2022-07-10'),
(14, 7, '2023-01-15'),

-- Réseau 9 : Côte d'Azur
(7,  9, '2022-08-01'),
(11, 9, '2022-09-10'),
(15, 9, '2023-06-20'),

-- Réseau 11 : Provence Lavande
(11, 11, '2023-04-01'),
(14, 11, '2023-07-15'),
(3,  11, '2023-08-10'),

-- Réseau 12 : Dordogne Préhistorique
(12, 12, '2022-10-01'),
(6,  12, '2023-01-20'),
(9,  12, '2023-03-05'),

-- Réseau 14 : Ardennes Secrètes
(14, 14, '2022-12-01'),
(10, 14, '2023-02-15'),
(5,  14, '2023-04-20');

-- =============================================================
-- 6. CACHES
--    coordonnees = POINT(longitude, latitude)
--    Zones géographiques : Paris, Loire, Bretagne, Pyrénées, etc.
-- =============================================================
INSERT INTO cache (id_reseau, id_type, id_etat, description, description_technique, description_libre, coordonnees) VALUES

-- ===== Réseau 1 : Île-de-France Historique =====
(1, 1, 1,
 'Cache au pied de la Tour Eiffel',
 'Boîte magnétique sous le 3e pilier côté Seine, à hauteur des yeux',
 'Apportez un crayon ! Vue imprenable en récompense.',
 ST_GeomFromText('POINT(2.2945 48.8584)')),

(1, 3, 1,
 'Énigme du Marais Royal',
 'Résolvez l\'énigme des 5 plaques historiques pour trouver les coordonnées finales',
 'Niveau 4/5 en difficulté. Prévoir 2h minimum.',
 ST_GeomFromText('POINT(2.3522 48.8566)')),

(1, 1, 1,
 'Le Secret de Montmartre',
 'Petite boîte nano collée sous le banc face à la basilique, côté gauche',
 'Cherchez tôt le matin pour éviter la foule.',
 ST_GeomFromText('POINT(2.3431 48.8867)')),

(1, 2, 2,
 'Multi-cache Versailles',
 'Étape 1 : fontaine principale. Étape 2 : orangerie. Final : bosquet du Roi',
 'Cache temporairement inactive pour maintenance du parc.',
 ST_GeomFromText('POINT(2.1204 48.8049)')),

(1, 6, 1,
 'Géologie de la Butte aux Cailles',
 'Earthcache : observez les formations calcaires et répondez aux questions',
 'Idéal pour les familles. Aucun contenant à chercher.',
 ST_GeomFromText('POINT(2.3534 48.8269)')),

-- ===== Réseau 2 : Circuit des Châteaux de la Loire =====
(2, 1, 1,
 'Aux portes de Chambord',
 'Contenant régulier caché dans le creux d\'un chêne centenaire à 30m de l\'entrée est',
 'Attention à la faune sauvage environnante.',
 ST_GeomFromText('POINT(1.5175 47.6161)')),

(2, 2, 1,
 'Multi Amboise Royal',
 'Parcours en 4 étapes autour du château. Chaque étape donne une lettre du code final.',
 'Durée estimée : 3h. Dénivelé faible.',
 ST_GeomFromText('POINT(0.9853 47.4133)')),

(2, 1, 1,
 'Le Donjon de Loches',
 'Micro-cache magnétique fixée derrière la plaque commémorative à l\'entrée nord',
 'Cherchez discrètement, lieu très fréquenté.',
 ST_GeomFromText('POINT(1.0020 47.1286)')),

(2, 3, 1,
 'Mystère de Chenonceau',
 'Résolvez l\'énigme des arches pour obtenir les vraies coordonnées',
 'La cache finale est dans la forêt derrière le château.',
 ST_GeomFromText('POINT(1.0703 47.3248)')),

(2, 1, 4,
 'Blois Centre Historique',
 'Petit contenant dans la cour intérieure, sous une pierre descellée',
 'En cours de vérification suite à un signalement.',
 ST_GeomFromText('POINT(1.3363 47.5861)')),

-- ===== Réseau 3 : Les Mystères de Paris =====
(3, 7, 1,
 'Letterbox Catacombes',
 'Tampon dissimulé dans une alcôve à 200m de l\'entrée principale des Catacombes',
 'Apportez votre propre tampon et carnet.',
 ST_GeomFromText('POINT(2.3326 48.8339)')),

(3, 1, 1,
 'Notre-Dame et ses Gargouilles',
 'Micro nano sous le banc N°7 de l\'esplanade face à la façade principale',
 'Cache posée après la réouverture 2024. Belle vue sur la restauration.',
 ST_GeomFromText('POINT(2.3499 48.8530)')),

(3, 3, 1,
 'Code Secret du Palais Royal',
 'L\'énigme se cache dans les colonnes de Buren. Comptez, calculez, trouvez !',
 'Cache petite taille dans le péristyle nord.',
 ST_GeomFromText('POINT(2.3366 48.8637)')),

(3, 1, 1,
 'Père-Lachaise, le Repos des Géants',
 'Boîte régulière cachée derrière la tombe d\'un illustre compositeur',
 'Indice : il a composé pour les Romantiques.',
 ST_GeomFromText('POINT(2.3954 48.8604)')),

-- ===== Réseau 4 : Bretagne Sauvage =====
(4, 1, 1,
 'Falaises de Penhir',
 'Cache waterproof dans une crevasse rocheuse à 5m du belvédère principal',
 'Ne pas chercher par mer agitée ou pluie. Terrain glissant.',
 ST_GeomFromText('POINT(-4.7114 48.2758)')),

(4, 1, 1,
 'Menhirs de Carnac',
 'Micro-cache entre deux menhirs de la rangée centrale, secteur Kermario',
 'Respectez le site classé, ne déplacez rien.',
 ST_GeomFromText('POINT(-3.0592 47.5909)')),

(4, 2, 1,
 'Multi-cache Pointe du Raz',
 'Quatre waypoints le long du sentier côtier. Final sur la pointe extrême.',
 'Prévoir chaussures de randonnée et vêtements imperméables.',
 ST_GeomFromText('POINT(-4.7347 48.0376)')),

-- ===== Réseau 5 : Caches Pyrénéennes =====
(5, 1, 1,
 'Sommet du Pic du Midi',
 'Boîte étanche enterrée sous un cairn, à 20m de l\'observatoire côté est',
 'Accessible uniquement l\'été. Altitude 2877m.',
 ST_GeomFromText('POINT(0.1403 42.9366)')),

(5, 1, 1,
 'Gavarnie - Cirque Géant',
 'Cache sous un rocher plat à l\'entrée du cirque, côté gauche du sentier',
 'Marche de 1h30 depuis le village. Magnifique cascade en prime.',
 ST_GeomFromText('POINT(-0.0117 42.7328)')),

(5, 6, 1,
 'Earthcache Gorges de Kakuetta',
 'Observez les spéléothèmes et répondez aux 3 questions géologiques',
 'Bottes conseillées - les gorges sont humides.',
 ST_GeomFromText('POINT(-0.9271 43.1139)')),

-- ===== Réseau 6 : Normandie Débarquement =====
(6, 1, 1,
 'Mémorial d\'Omaha Beach',
 'Petit contenant sous le banc en pierre face à la mer, côté américain',
 'Lieu de recueillement. Soyez discrets et respectueux.',
 ST_GeomFromText('POINT(-0.8630 49.3693)')),

(6, 3, 1,
 'Énigme Pointe du Hoc',
 'Décodez les inscriptions des bunkers pour trouver les coordonnées',
 'Cache finale dans un bunker accessible côté mer.',
 ST_GeomFromText('POINT(-0.9897 49.3963)')),

(6, 1, 1,
 'Bayeux et sa Tapisserie',
 'Nano cache magnétique collée sous le panneau de signalisation historique',
 'À deux pas du musée de la tapisserie.',
 ST_GeomFromText('POINT(-0.7033 49.2762)')),

-- ===== Réseau 7 : Alps & Cache =====
(7, 1, 1,
 'Mont Blanc Base Camp Cache',
 'Cache étanche dans un amas de rochers à Chamonix, vue sur le Mont Blanc',
 'Accessible toute l\'année depuis le centre-ville.',
 ST_GeomFromText('POINT(6.8694 45.9237)')),

(7, 1, 1,
 'Lac Annecy Panorama',
 'Boîte régulière dans un creux d\'arbre au bord du lac, sentier côté est',
 'Balade facile. Idéal en famille.',
 ST_GeomFromText('POINT(6.1296 45.8992)')),

(7, 2, 1,
 'Multi Gorges du Verdon',
 'Parcours en 3 étapes sur le sentier Martel. Panoramas époustouflants.',
 'Niveau sportif requis. Prévoir une journée complète.',
 ST_GeomFromText('POINT(6.3424 43.7415)')),

-- ===== Réseau 9 : Côte d\'Azur =====
(9, 1, 1,
 'Calanques de Cassis',
 'Cache waterproof dans une calanque accessible à pied, sous un rocher blanc',
 'Accès fermé en été par fortes chaleurs. Vérifier avant de partir.',
 ST_GeomFromText('POINT(5.5386 43.2145)')),

(9, 1, 1,
 'Monaco Rocher',
 'Micro-cache sous une fontaine décorative près du Palais Princier',
 'Cherchez tôt le matin avant l\'afflux touristique.',
 ST_GeomFromText('POINT(7.4197 43.7313)')),

(9, 3, 1,
 'Mystère d\'Èze Village',
 'Résolvez l\'énigme du jardin exotique pour trouver les coordonnées',
 'Vue mer exceptionnelle depuis le point final.',
 ST_GeomFromText('POINT(7.3608 43.7274)')),

-- ===== Réseau 11 : Provence Lavande =====
(11, 1, 1,
 'Champs de Lavande de Valensole',
 'Boîte nano sous un piquet délimitant les rangées de lavande, côté nord',
 'Meilleure période : juin-juillet pour la floraison.',
 ST_GeomFromText('POINT(5.9796 43.8380)')),

(11, 1, 1,
 'Les Baux-de-Provence',
 'Cache dans les ruines du château médiéval, dans une cavité de la roche',
 'Paysage lunaire unique. Cache difficile à niveau 4.',
 ST_GeomFromText('POINT(4.7947 43.7444)')),

(11, 6, 1,
 'Earthcache Colorado Provençal',
 'Étude des ocres rouges. Répondez aux questions géologiques en ligne.',
 'Circuit des ocres de Rustrel.',
 ST_GeomFromText('POINT(5.4761 43.9326)')),

-- ===== Réseau 12 : Dordogne Préhistorique =====
(12, 1, 1,
 'Lascaux et la Préhistoire',
 'Micro cache magnétique sur la signalétique à l\'entrée du site',
 'Visitez Lascaux IV pour voir les reproductions.',
 ST_GeomFromText('POINT(1.1681 45.0548)')),

(12, 3, 1,
 'Mystère des Eyzies',
 'Énigme sur l\'art rupestre des Eyzies. Coordonnées à déchiffrer.',
 'La cache finale est dans la falaise surplombant le village.',
 ST_GeomFromText('POINT(1.0181 44.9367)')),

(12, 1, 1,
 'Château de Beynac',
 'Boîte régulière cachée dans les remparts, accès par le sentier des chevaliers',
 'Vue imprenable sur la Dordogne depuis la cache.',
 ST_GeomFromText('POINT(1.1554 44.8412)')),

-- ===== Réseau 14 : Ardennes Secrètes =====
(14, 1, 1,
 'Forêt des Ardennes Profondes',
 'Grosse boîte régulière dans un tronc d\'arbre creux, chemin forestier balisé rouge',
 'Cache avec livre d\'échanges. Laissez un objet, prenez un objet.',
 ST_GeomFromText('POINT(4.7139 49.9929)')),

(14, 1, 1,
 'Méandres de la Semois',
 'Cache waterproof sous un pont de pierres enjambant la Semois',
 'Zone inondable : vérifier la météo avant la visite.',
 ST_GeomFromText('POINT(4.9672 49.8903)')),

(14, 3, 5,
 'Énigme du Fort de Charlemont',
 'Déchiffrez les inscriptions du fort Vauban pour trouver la cache finale',
 'Cache temporairement désactivée pour travaux de restauration du fort.',
 ST_GeomFromText('POINT(4.7181 50.1521)'));

-- =============================================================
-- 7. VISITES
-- =============================================================
INSERT INTO visite (id_utilisateur, id_cache, date_heure, commentaire, photo_url, cache_trouve) VALUES

-- Visites cache 1 (Tour Eiffel)
(3,  1, '2023-03-15 10:23:00', 'Trouvée facilement ! Belle journée ensoleillée.', 'https://photos.geocache.fr/u3/cache1_mars2023.jpg', 1),
(5,  1, '2023-04-02 14:05:00', 'Un peu galère à cause des touristes mais trouvée !', NULL, 1),
(7,  1, '2023-05-20 09:15:00', 'Introuvable ce matin, trop de monde autour.', NULL, 0),
(7,  1, '2023-05-21 07:30:00', 'Trouvée au second essai en arrivant à l\'ouverture.', 'https://photos.geocache.fr/u7/cache1_mai2023.jpg', 1),
(9,  1, '2023-07-14 11:00:00', 'Fêtée le 14 juillet ! Cache bien cachée. TFTC', NULL, 1),
(11, 1, '2023-09-08 15:45:00', 'Superbe vue ! Cache intacte.', 'https://photos.geocache.fr/u11/eiffel_sept23.jpg', 1),
(4,  1, '2024-01-10 10:00:00', 'Première cache de l\'année ! Parfaite.', NULL, 1),

-- Visites cache 2 (Énigme du Marais Royal)
(5,  2, '2023-04-22 13:30:00', 'Énigme vraiment difficile. Trouvé après 3h de recherche !', NULL, 1),
(9,  2, '2023-06-10 10:00:00', 'Pas trouvé malgré 2h de recherche. L\'énigme est tordue.', NULL, 0),
(12, 2, '2023-08-05 11:15:00', 'Excellent défi intellectuel ! Bravo au poseur.', 'https://photos.geocache.fr/u12/marais_aout23.jpg', 1),

-- Visites cache 3 (Montmartre)
(3,  3, '2023-03-20 08:00:00', 'Magnifique lever de soleil sur Paris depuis Montmartre !', 'https://photos.geocache.fr/u3/montmartre_matin.jpg', 1),
(6,  3, '2023-05-12 16:30:00', 'Trouvée ! Belle escapade parisienne.', NULL, 1),
(10, 3, '2023-09-30 10:20:00', 'TFTC, cache en bon état.', NULL, 1),
(14, 3, '2024-02-14 09:00:00', 'Romantique par excellence le jour de la Saint-Valentin !', 'https://photos.geocache.fr/u14/montmartre_valentin.jpg', 1),

-- Visites cache 5 (Earthcache Butte aux Cailles)
(7,  5, '2023-04-05 14:00:00', 'Très instructif sur la géologie parisienne. Questions répondues en ligne.', NULL, 1),
(15, 5, '2023-11-18 11:30:00', 'Parfait pour initier mes enfants à la géologie !', NULL, 1),

-- Visites cache 6 (Chambord)
(4,  6, '2023-06-25 09:30:00', 'Splendide château ! Cache trouvée au pied du grand chêne.', 'https://photos.geocache.fr/u4/chambord_juin23.jpg', 1),
(8,  6, '2023-07-14 10:00:00', 'Trouvée après une balade en vélo autour du domaine.', NULL, 1),
(13, 6, '2023-09-02 15:00:00', 'Belle cache, bon état. Contenant légèrement humide.', NULL, 1),
(6,  6, '2024-03-20 11:15:00', 'Première visite au château ET première cache trouvée ici !', NULL, 1),

-- Visites cache 7 (Multi Amboise)
(8,  7, '2023-07-16 09:00:00', 'Superbe parcours ! Les 4 étapes sont bien pensées.', 'https://photos.geocache.fr/u8/amboise_multi.jpg', 1),
(4,  7, '2023-08-10 10:30:00', 'Étape 3 manquante - cache disparue ou déplacée ?', NULL, 0),

-- Visites cache 8 (Loches)
(13, 8, '2023-09-03 14:30:00', 'Nano très bien dissimulée. Trouvée du premier coup !', NULL, 1),
(6,  8, '2024-04-05 11:00:00', 'Excellente cache en milieu urbain. TFTC !', NULL, 1),

-- Visites cache 11 (Letterbox Catacombes)
(10, 11, '2023-05-20 13:00:00', 'Atmosphère unique dans les catacombes. Tampon magnifique.', 'https://photos.geocache.fr/u10/catacombes.jpg', 1),
(12, 11, '2023-10-31 14:00:00', 'Visite parfaite pour Halloween !', 'https://photos.geocache.fr/u12/cataco_halloween.jpg', 1),

-- Visites cache 12 (Notre-Dame)
(3,  12, '2023-11-05 09:15:00', 'Émouvant de voir Notre-Dame se restaurer. Cache trouvée !', 'https://photos.geocache.fr/u3/notredame_restauration.jpg', 1),
(5,  12, '2023-12-08 10:30:00', 'Belle cache, beau lieu en pleine renaissance.', NULL, 1),
(9,  12, '2024-01-20 14:00:00', 'La cathédrale est magnifique en hiver !', NULL, 1),

-- Visites cache 15 (Falaises de Penhir)
(4,  15, '2023-08-15 08:00:00', 'Lever de soleil fantastique sur les falaises. Cache waterproof au top.', 'https://photos.geocache.fr/u4/penhir_aube.jpg', 1),
(13, 15, '2023-08-20 10:00:00', 'Terrain difficile mais le panorama vaut le détour.', NULL, 1),

-- Visites cache 16 (Menhirs de Carnac)
(4,  16, '2023-08-16 11:00:00', 'Impressionnant ! Cache trouvée discrètement entre les menhirs.', 'https://photos.geocache.fr/u4/carnac_menhirs.jpg', 1),
(2,  16, '2023-10-10 09:30:00', 'Site exceptionnel. Cache en bon état.', NULL, 1),

-- Visites cache 18 (Pic du Midi)
(5,  18, '2023-08-20 07:00:00', 'Montée au pic au lever du soleil. Cache trouvée sous le cairn.', 'https://photos.geocache.fr/u5/picmidi_sunrise.jpg', 1),
(15, 18, '2023-07-30 10:00:00', 'Merveilleux ! Vue sur toute la chaîne pyrénéenne.', 'https://photos.geocache.fr/u15/pyrenees_sommet.jpg', 1),

-- Visites cache 19 (Gavarnie)
(3,  19, '2023-07-22 09:00:00', 'Cirque de Gavarnie, le plus beau de France. Cache bien cachée.', 'https://photos.geocache.fr/u3/gavarnie_cirque.jpg', 1),
(8,  19, '2023-08-12 11:30:00', 'Randonnée magnifique, cascade impressionnante !', NULL, 1),
(15, 19, '2023-09-05 08:00:00', 'Pas trouvé, cherché 30min sans succès.', NULL, 0),

-- Visites cache 21 (Omaha Beach)
(6,  21, '2023-06-06 08:00:00', 'Commémoration du 6 juin. Émouvant et respectueux. Cache discrète.', 'https://photos.geocache.fr/u6/omaha_dday.jpg', 1),
(9,  21, '2023-08-22 14:00:00', 'Lieu chargé d\'histoire. Cache trouvée après une courte recherche.', NULL, 1),
(4,  21, '2024-06-06 09:00:00', 'Hommage aux soldats tombés. TFTC.', NULL, 1),

-- Visites cache 22 (Pointe du Hoc)
(6,  22, '2023-06-06 16:00:00', 'Deux caches en une journée pour le D-Day ! Énigme bien ficelée.', NULL, 1),
(9,  22, '2023-08-23 10:30:00', 'Bunkers impressionnants. Énigme résolue en 45min.', 'https://photos.geocache.fr/u9/pointhoc_bunker.jpg', 1),

-- Visites cache 24 (Mont Blanc / Chamonix)
(7,  24, '2023-07-10 06:30:00', 'Vue sur le Mont Blanc au petit matin. Cache introuvable sous la neige !', NULL, 0),
(7,  24, '2023-08-15 07:00:00', 'Retour en été, cache trouvée ! Le rocher a bougé avec la fonte.', 'https://photos.geocache.fr/u7/montblanc_chamonix.jpg', 1),
(14, 24, '2023-09-01 08:30:00', 'Chamonix est une ville incroyable. TFTC !', NULL, 1),

-- Visites cache 25 (Lac d\'Annecy)
(7,  25, '2023-07-12 10:00:00', 'Balade au bord du lac d\'Annecy, cache trouvée !', 'https://photos.geocache.fr/u7/annecy_lac.jpg', 1),
(14, 25, '2023-10-05 14:30:00', 'Couleurs d\'automne magnifiques. Cache en bon état.', NULL, 1),

-- Visites cache 27 (Calanques Cassis)
(11, 27, '2023-09-15 09:00:00', 'Couleur de l\'eau irréelle dans les calanques. Cache waterproof OK.', 'https://photos.geocache.fr/u11/cassis_calanque.jpg', 1),
(15, 27, '2023-10-20 10:00:00', 'Sentier moins fréquenté en octobre. Cache trouvée sans problème.', NULL, 1),

-- Visites cache 30 (Champs de Lavande)
(11, 30, '2023-06-28 08:00:00', 'La Provence en fleur, magique ! Cache nano bien dissimulée.', 'https://photos.geocache.fr/u11/valensole_lavande.jpg', 1),
(3,  30, '2023-07-05 09:30:00', 'Visite en pleine floraison. Parfum enivrant !', 'https://photos.geocache.fr/u3/lavande_juillet.jpg', 1),
(14, 30, '2024-07-02 07:30:00', 'Lever de soleil sur les lavandes. Cache introuvable - peut-être déplacée ?', NULL, 0),

-- Visites cache 33 (Lascaux)
(12, 33, '2023-04-15 10:00:00', 'Site exceptionnel. Cache discrète et respectueuse du lieu.', NULL, 1),
(6,  33, '2023-07-25 14:00:00', 'Impressionnant de se retrouver face à l\'art préhistorique.', 'https://photos.geocache.fr/u6/lascaux_art.jpg', 1),
(9,  33, '2023-09-10 11:30:00', 'Cache trouvée mais le journal est saturé, besoin de remplacement.', NULL, 1),

-- Visites cache 35 (Château de Beynac)
(12, 35, '2023-05-10 10:30:00', 'Château médiéval splendide ! Cache bien cachée dans les remparts.', 'https://photos.geocache.fr/u12/beynac_chateau.jpg', 1),
(6,  35, '2023-08-18 09:00:00', 'Visite du château + cache. Journée parfaite !', NULL, 1),

-- Visites cache 36 (Ardennes - Forêt)
(14, 36, '2023-05-20 11:00:00', 'Forêt magnifique au printemps. J\'ai laissé un porte-clé, pris un badge.', 'https://photos.geocache.fr/u14/ardennes_foret.jpg', 1),
(10, 36, '2023-09-15 10:00:00', 'Cache avec de beaux objets d\'échange. J\'ai laissé une pièce de collection.', NULL, 1),
(5,  36, '2024-04-20 14:00:00', 'Première cache dans les Ardennes ! Accueil magnifique de la forêt.', NULL, 1),

-- Visites cache 37 (Semois)
(14, 37, '2023-06-10 09:00:00', 'Méandres sublimes de la Semois. Cache waterproof, parfait état.', 'https://photos.geocache.fr/u14/semois_meandre.jpg', 1),
(10, 37, '2023-07-22 08:30:00', 'Baignade dans la Semois après la cache ! Journée parfaite.', NULL, 1);

-- =============================================================
-- VÉRIFICATION RAPIDE
-- =============================================================
SELECT 'etat_cache'    AS table_name, COUNT(*) AS nb_lignes FROM etat_cache
UNION ALL SELECT 'type_cache',   COUNT(*) FROM type_cache
UNION ALL SELECT 'utilisateur',  COUNT(*) FROM utilisateur
UNION ALL SELECT 'reseau',       COUNT(*) FROM reseau
UNION ALL SELECT 'affectation',  COUNT(*) FROM affectation
UNION ALL SELECT 'cache',        COUNT(*) FROM cache
UNION ALL SELECT 'visite',       COUNT(*) FROM visite;
