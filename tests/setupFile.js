const db = require('../models/database')
db.executeQuery(
  `CREATE TABLE IF NOT EXISTS public."ACCOUNTS"
  (
    "ACCOUNT_ID" bigint NOT NULL DEFAULT nextval('"ACCOUNTS_ACCOUNT_ID_seq"'::regclass),
    "USERNAME" character varying(50) NOT NULL,
    "PASSWORD" character varying(100) NOT NULL,
    CONSTRAINT "ACCOUNTS_pkey" PRIMARY KEY ("ACCOUNT_ID")
  )
  WITH {
    OIDS=FALSE
  );`
).catch(error => {
  return error
})

db.executeQuery(
  `CREATE TABLE IF NOT EXISTS public."SCORES"
  (
    "SCORE_ID" bigint NOT NULL DEFAULT nextval('"SCORES_SCORE_ID_seq"'::regclass),
    "ACCOUNT_ID" bigint NOT NULL,
    "SCORE" double precision NOT NULL,
    "HIGHEST_STREAK" smallint NOT NULL,
    "DATE" date NOT NULL,
    CONSTRAINT "SCORES_pkey" PRIMARY KEY ("SCORE_ID"),
    CONSTRAINT "SCORE_ACCOUNT" FOREIGN KEY ("ACCOUNT_ID")
        REFERENCES public."ACCOUNTS" ("ACCOUNT_ID") MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION
  )
  WITH (
    OIDS=FALSE
  );`
).catch(error => {
  return error
})

db.executeQuery(
  `CREATE TABLE IF NOT EXISTS public."QUESTIONS"
  (
    "QUESTION_ID" bigint NOT NULL DEFAULT nextval('"QUESTIONS_QUESTION_ID_seq"'::regclass),
    "QUESTION_CONTENT" character varying(1000),
    "RIGHT_ANSWER" character varying(1000),
    "WRONG_ANSWER1" character varying(1000),
    "WRONG_ANSWER2" character varying(1000),
    "WRONG_ANSWER3" character varying(1000),
    "ACCOUNT_ID" bigint,
    CONSTRAINT "QUESTIONS_pkey" PRIMARY KEY ("QUESTION_ID"),
    CONSTRAINT "FK_ACCOUNT_QUESTION" FOREIGN KEY ("ACCOUNT_ID")
        REFERENCES public."ACCOUNTS" ("ACCOUNT_ID") MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION
  )
  WITH (
    OIDS=FALSE
  );`
).catch(error => {
  return error
})
