<h1>Table of Contents</h1>

- [AnimeW API](#animew-api)
  - [Installation](#installation)
    - [Local](#local)
  - [Authentication Endpoints](#authentication-endpoints)
    - [Get User List](#get-user-list)
    - [Register User](#register-user)
    - [User Login](#user-login)
    - [Delete User](#delete-user)
  - [Admin Endpoints](#admin-endpoints)
    - [Get User Information (Admin)](#get-user-information-admin)
    - [Add New Anime (Admin)](#add-new-anime-admin)
    - [Update Anime (Admin)](#update-anime-admin)
    - [Delete Anime (Admin)](#delete-anime-admin)
    - [Add Episode to Anime (Admin)](#add-episode-to-anime-admin)
    - [Update Episode (Admin)](#update-episode-admin)
    - [Delete Episode (Admin)](#delete-episode-admin)
  - [Anime Endpoints](#anime-endpoints)
    - [Get Anime List](#get-anime-list)
    - [Get Anime Details](#get-anime-details)
    - [Get Episodes of Anime](#get-episodes-of-anime)
    - [Search Anime](#search-anime)
    - [Get Popular Anime](#get-popular-anime)
    - [Get Top Anime](#get-top-anime)
    - [Get Watch List](#get-watch-list)
    - [Add Anime to Watch List](#add-anime-to-watch-list)
    - [Remove Anime from Watch List](#remove-anime-from-watch-list)
    - [Get Viewing History](#get-viewing-history)
    - [Remove Anime from Viewing History](#remove-anime-from-viewing-history)
  - [Comments Endpoints](#comments-endpoints)
    - [Get Anime Comments](#get-anime-comments)
    - [Create Comment](#create-comment)
    - [Update Comment](#update-comment)
    - [Delete Comment](#delete-comment)
  - [Profile Endpoints](#profile-endpoints)
    - [Get User Profile](#get-user-profile)
    - [Create User Profile](#create-user-profile)
    - [Update User Profile](#update-user-profile)
    - [Update Avatar](#update-avatar)

# AnimeW API

AnimeW API is a RESTful API for managing anime information and user-related functionalities. It allows users to browse, search, and interact with anime content, as well as perform user authentication and profile management. This document provides an overview of the available endpoints and their respective methods and descriptions.

## Installation

### Local

Run the following command to clone the repository, and install the dependencies:

```sh
git clone https://github.com/luan-thnh/animew-api.git
cd animew-api
npm install #or yarn install
```

start the server with the following command:

```sh
npm run dev #or yarn run dev
```

Now the server is running on http://localhost:3003/api/v1/anime

## Authentication Endpoints

### Get User List

- Endpoint: `/auth`
- Method: `GET`
- Description: Retrieves a list of users.

### Register User

- Endpoint: `/auth/register`
- Method: `POST`
- Description: Registers a new user.

### User Login

- Endpoint: `/auth/login`
- Method: `POST`
- Description: Authenticates a user. If the user has the role of `admin`, the `redirectUrl` will be included in the response data to redirect to the admin page.

### Delete User

- Endpoint: `/auth/delete/:userId`
- Method: `DELETE`
- Description: Deletes a user account.

## Admin Endpoints

### Get User Information (Admin)

- Endpoint: `/admin/users`
- Method: `GET`
- Description: Retrieves information about the current users (admin).

### Add New Anime (Admin)

- Endpoint: `/admin/anime`
- Method: `POST`
- Description: Adds a new anime series (admin).

### Update Anime (Admin)

- Endpoint: `/admin/anime/:animeId`
- Method: `PUT`
- Description: Updates an existing anime series based on the `animeId` (admin).

### Delete Anime (Admin)

- Endpoint: `/admin/anime/:animeId`
- Method: `DELETE`
- Description: Deletes an anime series based on the `animeId` (admin).

### Add Episode to Anime (Admin)

- Endpoint: `/admin/anime/:animeId/episodes`
- Method: `POST`
- Description: Adds a new episode to a specific anime series (admin).

### Update Episode (Admin)

- Endpoint: `/admin/anime/:animeId/episodes/:episodeId`
- Method: `PUT`
- Description: Updates an episode of a specific anime series based on the `animeId` and `episodeId` (admin).

### Delete Episode (Admin)

- Endpoint: `/admin/anime/:animeId/episodes/:episodeId`
- Method: `DELETE`
- Description: Deletes an episode from a specific anime series based on the `animeId` and `episodeId` (admin).

## Anime Endpoints

### Get Anime List

- Endpoint: `/anime/anime-list`
- Method: `GET`
- Description: Retrieves a list of anime.

### Get Anime Details

- Endpoint: `/anime/details/:animeId`
- Method: `GET`
- Description: Retrieves detailed information about a specific anime based on the `animeId`.

### Get Episodes of Anime

- Endpoint: `/anime/details/:animeId/episodes`
- Method: `GET`
- Description: Retrieves a list of episodes for a specific anime based on the `animeId`. Specific episodes can be obtained using query parameters. The accessed anime episodes will be saved in the viewing history.

### Search Anime

- Endpoint: `/anime/search`
- Method: `GET`
- Description: Searches for anime based on various criteria such as title, type, genre, rating, episodeCount, and greater than or equal to (gte) options.

### Get Popular Anime

- Endpoint: `/anime/popular`
- Method: `GET`
- Description: Retrieves a list of popular anime based on a rating greater than or equal to 8.

### Get Top Anime

- Endpoint: `/anime/top-anime`
- Method: `GET`
- Description: Retrieves a list of the hottest anime from the past month based on a

rating greater than or equal to 9.

### Get Watch List

- Endpoint: `/anime/watch-list`
- Method: `GET`
- Description: Retrieves a list of anime that have been added to the watch list.

### Add Anime to Watch List

- Endpoint: `/anime/watch-list/:animeId`
- Method: `POST`
- Description: Adds an anime to the watch list.

### Remove Anime from Watch List

- Endpoint: `/anime/watch-list/:animeWatchListId`
- Method: `DELETE`
- Description: Removes an anime from the watch list based on the `animeWatchListId`.

### Get Viewing History

- Endpoint: `/anime/history`
- Method: `GET`
- Description: Retrieves anime from the viewing history.

### Remove Anime from Viewing History

- Endpoint: `/anime/history/:animeHistoryId`
- Method: `DELETE`
- Description: Removes anime from the viewing history based on the `animeHistoryId`.

## Comments Endpoints

### Get Anime Comments

- Endpoint: `/comments/anime/:animeId`
- Method: `GET`
- Description: Retrieves a list of comments for a specific anime. The comments include the `username` and `avatar` referenced from the `User` table, `title` referenced from the `Anime` table, `content`, and `createdAt` ordered from newest to oldest.

### Create Comment

- Endpoint: `/comments`
- Method: `POST`
- Description: Creates a comment for an anime.

### Update Comment

- Endpoint: `/comments/:commentId`
- Method: `PUT`
- Description: Updates a comment for an anime.

### Delete Comment

- Endpoint: `/comments/:commentId`
- Method: `DELETE`
- Description: Deletes a comment for an anime.

## Profile Endpoints

### Get User Profile

- Endpoint: `/profile`
- Method: `GET`
- Description: Retrieves user profile information.

### Create User Profile

- Endpoint: `/profile/create`
- Method: `POST`
- Description: Creates user profile information.

### Update User Profile

- Endpoint: `/profile/update`
- Method: `PUT`
- Description: Updates user profile information.

### Update Avatar

- Endpoint: `/profile/avatar`
- Method: `POST`
- Description: Updates the user's avatar. The avatar URL should be provided in Base64 format.

---

<h4>Created by @luanthnh :fountain_pen:</h4>
