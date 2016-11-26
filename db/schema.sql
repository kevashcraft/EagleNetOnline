DROP TABLE IF EXISTS net_controls CASCADE;
CREATE TABLE net_controls (
  id serial NOT NULL,
  created timestamp DEFAULT current_timestamp NOT NULL,
  callsign varchar(6),
  name varchar(32),
  email varchar(64),
  phone varchar(16),
  PRIMARY KEY(id)
);

DROP TABLE IF EXISTS schedule CASCADE;
CREATE TABLE schedule (
  id serial NOT NULL,
  created timestamp DEFAULT current_timestamp NOT NULL,
  ncs_id int REFERENCES net_controls(id),
  day varchar(16) UNIQUE NOT NULL,
  PRIMARY KEY(id)
);

DROP TABLE IF EXISTS announcements CASCADE;
CREATE TABLE announcements (
  id serial NOT NULL,
  created timestamp DEFAULT current_timestamp NOT NULL,
  title varchar(32),
  content text,
  active boolean DEFAULT true NOT NULL,
  PRIMARY KEY(id)
);

DROP TABLE IF EXISTS arrl_officials CASCADE;
CREATE TABLE arrl_officials (
  id serial NOT NULL,
  created timestamp DEFAULT current_timestamp NOT NULL,
  callsign varchar(6),
  name varchar(32),
  title varchar(64),
  PRIMARY KEY(id)
);
