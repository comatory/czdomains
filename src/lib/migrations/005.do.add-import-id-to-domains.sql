ALTER TABLE domains
  ADD COLUMN import_id INTEGER REFERENCES domains(id);
