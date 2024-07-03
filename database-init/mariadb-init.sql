CREATE DATABASE IF NOT EXISTS quizify;

USE quizify;

CREATE TABLE
    `user_quizzes` (
        `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        `user_id` BIGINT NOT NULL,
        `quiz_at` BIGINT NOT NULL,
        `joined_at` TIMESTAMP NOT NULL
    );

CREATE TABLE
    `quizzes` (
        `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        `title` VARCHAR(255) NOT NULL,
        `quizTag` VARCHAR(255) NOT NULL,
        `description` TEXT NULL,
        `maxTime` INT NOT NULL,
        `maxPlayers` INT NOT NULL,
        `score` FLOAT NOT NULL,
        `negativeScore` FLOAT NOT NULL,
        `joinTime` INT NOT NULL,
        `creator_id` BIGINT NOT NULL COMMENT 'User ID of who created the quiz',
        `creation_date` TIMESTAMP NOT NULL,
        `updated_at` TIMESTAMP NOT NULL
    );

CREATE TABLE
    `Users` (
        `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        `account_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'The time when the account was created',
        `first_name` VARCHAR(255) NOT NULL COMMENT 'First Name of the user',
        `last_name` VARCHAR(255) NULL COMMENT 'Optional Last Name of the user',
        `email` TEXT NOT NULL COMMENT 'Email address of the user. Must be unique',
        `username` VARCHAR(50) NOT NULL COMMENT 'Unique Username for each user identification',
        `password` TEXT NOT NULL COMMENT 'A hashed password of the user',
        `quiz_attended` BIGINT UNSIGNED NOT NULL DEFAULT '0' COMMENT 'Count of how many quiz they attended',
        `quiz_created` BIGINT UNSIGNED NOT NULL DEFAULT '0' COMMENT 'Count of how many quiz they have created'
    );

ALTER TABLE `Users` ADD INDEX `users_email_index` (`email`);

ALTER TABLE `Users` ADD UNIQUE `users_email_unique` (`email`);

ALTER TABLE `Users` ADD UNIQUE `users_username_unique` (`username`);

CREATE TABLE
    `quiz_sessions` (
        `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        `quiz_id` BIGINT NOT NULL,
        `session_code` BIGINT NOT NULL,
        `host_id` BIGINT NOT NULL,
        `start_time` TIMESTAMP NOT NULL,
        `end_time` TIMESTAMP NOT NULL
    );

ALTER TABLE `quiz_sessions` ADD UNIQUE `quiz_sessions_session_code_unique` (`session_code`);

ALTER TABLE `quiz_sessions` ADD CONSTRAINT `quiz_sessions_quiz_id_foreign` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`);

ALTER TABLE `user_quizzes` ADD CONSTRAINT `user_quizzes_quiz_at_foreign` FOREIGN KEY (`quiz_at`) REFERENCES `quizzes` (`id`);

ALTER TABLE `quizzes` ADD CONSTRAINT `quizzes_creator_id_foreign` FOREIGN KEY (`creator_id`) REFERENCES `Users` (`id`);

ALTER TABLE `user_quizzes` ADD CONSTRAINT `user_quizzes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`);

ALTER TABLE `quiz_sessions` ADD CONSTRAINT `quiz_sessions_host_id_foreign` FOREIGN KEY (`host_id`) REFERENCES `Users` (`id`);

INSERT INTO
    quizify.Users (
        account_created,
        first_name,
        last_name,
        email,
        username,
        password,
        quiz_attended,
        quiz_created
    )
VALUES
    (
        '2024-06-07 06:03:15',
        'sai',
        'vishnu',
        'saivishn725@example.com',
        'saivish',
        '$2b$10$/WT5KDaJHUaaeSF8X610yO4bBi4CAOugBtnL3Reqso//1QTUSDT4O',
        0,
        0
    );