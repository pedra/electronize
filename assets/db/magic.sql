--
-- File generated with SQLiteStudio v3.2.1 on seg mar 22 14:41:58 2021
--
-- Text encoding used: UTF-8
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: event
DROP TABLE IF EXISTS event;

CREATE TABLE event (
    id      INTEGER  PRIMARY KEY
                     UNIQUE,
    user    INTEGER  REFERENCES user (id),
    [when]  DATETIME NOT NULL,
    [table] VARCHAR  DEFAULT user,
    type    VARCHAR  DEFAULT login
                     NOT NULL,
    content TEXT
);


-- Table: lorem
DROP TABLE IF EXISTS lorem;

CREATE TABLE lorem (
    info TEXT
);

INSERT INTO lorem (
                      info
                  )
                  VALUES (
                      'Ipsum 0'
                  );

INSERT INTO lorem (
                      info
                  )
                  VALUES (
                      'Ipsum 1'
                  );

INSERT INTO lorem (
                      info
                  )
                  VALUES (
                      'Ipsum 2'
                  );

INSERT INTO lorem (
                      info
                  )
                  VALUES (
                      'Ipsum 3'
                  );

INSERT INTO lorem (
                      info
                  )
                  VALUES (
                      'Ipsum 4'
                  );

INSERT INTO lorem (
                      info
                  )
                  VALUES (
                      'Ipsum 5'
                  );

INSERT INTO lorem (
                      info
                  )
                  VALUES (
                      'Ipsum 6'
                  );

INSERT INTO lorem (
                      info
                  )
                  VALUES (
                      'Ipsum 7'
                  );

INSERT INTO lorem (
                      info
                  )
                  VALUES (
                      'Ipsum 8'
                  );

INSERT INTO lorem (
                      info
                  )
                  VALUES (
                      'Ipsum 9'
                  );

INSERT INTO lorem (
                      info
                  )
                  VALUES (
                      'Ipsum 0'
                  );

INSERT INTO lorem (
                      info
                  )
                  VALUES (
                      'Ipsum 1'
                  );

INSERT INTO lorem (
                      info
                  )
                  VALUES (
                      'Ipsum 2'
                  );

INSERT INTO lorem (
                      info
                  )
                  VALUES (
                      'Ipsum 3'
                  );

INSERT INTO lorem (
                      info
                  )
                  VALUES (
                      'Ipsum 4'
                  );

INSERT INTO lorem (
                      info
                  )
                  VALUES (
                      'Ipsum 5'
                  );

INSERT INTO lorem (
                      info
                  )
                  VALUES (
                      'Ipsum 6'
                  );

INSERT INTO lorem (
                      info
                  )
                  VALUES (
                      'Ipsum 7'
                  );

INSERT INTO lorem (
                      info
                  )
                  VALUES (
                      'Ipsum 8'
                  );

INSERT INTO lorem (
                      info
                  )
                  VALUES (
                      'Ipsum 9'
                  );


-- Table: user
DROP TABLE IF EXISTS user;

CREATE TABLE user (
    id       INTEGER PRIMARY KEY
                     UNIQUE,
    login    VARCHAR NOT NULL,
    password INTEGER NOT NULL,
    token    VARCHAR,
    [key]    VARCHAR,
    name     VARCHAR NOT NULL,
    level    INTEGER DEFAULT (10) 
);

INSERT INTO user (
                     id,
                     login,
                     password,
                     token,
                     [key],
                     name,
                     level
                 )
                 VALUES (
                     1,
                     'prbr@ymail.com',
                     'Ab123456',
                     '',
                     '',
                     'Bill Rocha',
                     1
                 );

INSERT INTO user (
                     id,
                     login,
                     password,
                     token,
                     [key],
                     name,
                     level
                 )
                 VALUES (
                     2,
                     'rosangela@email.com',
                     'Ab123456',
                     '',
                     '',
                     'Rosangela Silva',
                     10
                 );


COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
