-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 20, 2024 at 10:28 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `devx`
--

-- --------------------------------------------------------

--
-- Table structure for table `bikes`
--

CREATE TABLE `bikes` (
  `BikeId` int(11) NOT NULL,
  `Longitude` double(200,20) NOT NULL,
  `Latitude` double(200,20) NOT NULL,
  `Status` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bikes`
--

INSERT INTO `bikes` (`BikeId`, `Longitude`, `Latitude`, `Status`) VALUES
(7, 103.86660000000000000000, 1.28874400000000000000, 2),
(8, 103.86660000000000000000, 1.28694600000000000000, 2),
(9, 103.86660000000000000000, 1.28780000000000000000, 1),
(10, 4.53720000000000000000, 35.74060000000000000000, 1),
(11, 4.53780000000000000000, 35.74030000000000000000, 2),
(12, 4.53730000000000000000, 35.74050000000000000000, 1);

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `feedback_text` text NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `BikeId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `userid`, `feedback_text`, `rating`, `BikeId`) VALUES
(1, 31, 'The service was excellent and I really appreciated the prompt response!', 5, 9),
(2, 19, 'uuuuu', 3, 8),
(3, 19, 'kkkkkk', 5, 8),
(4, 19, 'mounir', NULL, 8),
(5, 19, 'kkkkkk', 3, 8);

-- --------------------------------------------------------

--
-- Table structure for table `RIdes`
--

CREATE TABLE `RIdes` (
  `RideId` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `BikeId` int(11) NOT NULL,
  `StartTime` varchar(200) NOT NULL,
  `EndTime` varchar(200) DEFAULT NULL,
  `Distance` float DEFAULT NULL,
  `TotalCost` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `RIdes`
--

INSERT INTO `RIdes` (`RideId`, `userid`, `BikeId`, `StartTime`, `EndTime`, `Distance`, `TotalCost`) VALUES
(9, 19, 7, '2024-12-17T13:01:16.923Z', NULL, NULL, NULL),
(10, 31, 10, '2024-12-17T13:27:01.784Z', NULL, NULL, NULL),
(13, 10, 10, '2024-12-17T15:09:03.079Z', NULL, NULL, NULL),
(14, 19, 7, '2024-12-17T15:49:44.689Z', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Settings`
--

CREATE TABLE `Settings` (
  `BookingFee` float NOT NULL,
  `HourlyRate` mediumint(9) NOT NULL,
  `DamageReportPoints` double(200,20) NOT NULL,
  `PointValue` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(200) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `firstname` varchar(200) DEFAULT NULL,
  `lastname` varchar(200) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `imgurl` varchar(200) DEFAULT NULL,
  `phone` int(16) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `firstname`, `lastname`, `email`, `imgurl`, `phone`) VALUES
(11, 'omar22', '$2b$10$n6mEMz7YAY6r/77vs2CU9eyKR8drxqIx1rbBJFZFXofOwmHI68jEa', 'omar', 'mili', 'omars22@gmail.com', NULL, 89878987),
(19, NULL, '$2b$10$HkMTT1uo6CvCviAdacfiBujHD/8G1iIpQSdPoRUMj15NRWFLOQEye', 'mounir', 'fardjaoui', 'fardjaouimounir@gmail.com', NULL, 771129863),
(24, 'omar10', '$2b$10$7NmTmPwVrbbQg2RaBLNxXOpHQzYaPXFTV5jl28/HSUGQRNaVzOdw2', 'firstnae', 'lastname', 'o@gmail.com', NULL, 662637532),
(28, 'od', '$2b$10$7ZwrBDXSSffXyGUaLxwg0.ry2mVTh1EHAcE89L.N0zzDwoWo0h0eu', 'd', 'd', 'od@gmail.com', NULL, 4),
(29, 'ods', '$2b$10$pJe5/Tc2jl0jXqJPCcNkV.DI0v1YXYAJcXXaGcqVN7j8MftsmXLny', 'd', 'd', 'ods@gmail.com', NULL, 4),
(30, 'omar2', '$2b$10$zsh.qR0ZaDZ1QzDmPFm/1O6t48GfeMUXiQY.UE3zJOfqgf6KlDaAK', NULL, NULL, 'omar2@gmail.com', NULL, NULL),
(31, 'yassinemili', '$2b$10$LYH97WU8gdc9tC0lKHM3z.NEI5.FlVbnnSLpDCoEoTWpTAbnQ.peC', NULL, NULL, 'yassinemili@gmail.com', NULL, NULL),
(32, 'rideme', '$2b$10$pveHbUqCyQ2MwSJK2zsPDuiLdtroVKA9lyfitcCD5ZUJFr8dv13Ym', NULL, NULL, 'ride@gmail.com', NULL, NULL),
(33, 'omar', '$2b$10$Z3xA88R1s2asKDX/Vitge..y6pwn8mzOUnQZVf6fmghiThJT952D.', NULL, NULL, 'omar@gmail.com', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bikes`
--
ALTER TABLE `bikes`
  ADD PRIMARY KEY (`BikeId`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `RIdes`
--
ALTER TABLE `RIdes`
  ADD PRIMARY KEY (`RideId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_username` (`username`),
  ADD UNIQUE KEY `unique_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bikes`
--
ALTER TABLE `bikes`
  MODIFY `BikeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `RIdes`
--
ALTER TABLE `RIdes`
  MODIFY `RideId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
