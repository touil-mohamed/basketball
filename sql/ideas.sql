-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : lun. 08 juil. 2024 à 08:34
-- Version du serveur : 5.7.39
-- Version de PHP : 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `ideas`
--

-- --------------------------------------------------------

--
-- Structure de la table `idea`
--

CREATE TABLE `idea` (
  `id` int(11) NOT NULL,
  `title` varchar(40) NOT NULL,
  `description` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastname` varchar(30) NOT NULL,
  `firstname` varchar(30) NOT NULL,
  `pour` int(11) NOT NULL DEFAULT '0',
  `contre` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `idea`
--

INSERT INTO `idea` (`id`, `title`, `description`, `createdAt`, `lastname`, `firstname`, `pour`, `contre`) VALUES
(1, 'Horaire', 'loremp ipsum', '2024-06-27 13:47:42', 'Miky', 'Lacon', 3, 3),
(2, 'Absence', 'Lorem ipsum', '2024-06-27 18:49:56', '', '', 0, 0),
(3, 'Information', 'lorem ', '2024-06-27 18:50:42', '', '', 0, 0),
(4, 'Absence', 'Lorem ipsum', '2024-06-29 16:10:51', 'Bil', 'Louki', 0, 1),
(5, 'Télétravail', 'lorem ipsum', '2024-06-29 16:19:27', 'freddy', 'Jack', 0, 0),
(6, 'lorem', 'test', '2024-06-29 16:28:31', 'test', 'test', 0, 0),
(7, 'test', 'test', '2024-06-29 16:29:04', 'test', 'test', 0, 0);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `idea`
--
ALTER TABLE `idea`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `idea`
--
ALTER TABLE `idea`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
