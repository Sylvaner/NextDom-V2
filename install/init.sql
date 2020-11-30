CREATE DATABASE nextdom;
\c nextdom
CREATE TABLE light (
  id VARCHAR(64) NOT NULL,
  data JSON NOT NULL,
  capabilities JSON NOT NULL,
  PRIMARY KEY (id)
);
