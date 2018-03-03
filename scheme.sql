CREATE TABLE signature (
  id SERIAL primary key,
  signature TEXT not null,
  user_id INTEGER not null
);

CREATE TABLE users (
  id SERIAL primary key,
  first VARCHAR(300),
  last VARCHAR(300),
  email VARCHAR(300) not null unique,
  hashedpassword VARCHAR(300) not null,
  created TIMESTAMP
);

CREATE TABLE profiles (
    id SERIAL primary key,
    age VARCHAR(300),
    city VARCHAR(300),
    homepage VARCHAR(300),
    user_id INTEGER not null,
    created TIMESTAMP
);

SELECT users.first AS user_first, users.last AS user_last, 
        profiles.age AS profiles_age, profiles.city AS profiles_city
        FROM signature
        LEFT JOIN users
        ON users.id = signature.user_id 
        LEFT JOIN profiles
        ON users.id = profiles.user_id;

SELECT users.first AS user_first, users.last AS user_last, 
        profiles.age AS profile_age, profiles.city AS profile_city, profiles.homepage AS profile_homepage
        FROM signature
        LEFT JOIN users
        ON users.id = signature.user_id 
        LEFT JOIN profiles
        ON users.id = profiles.user_id