INSERT INTO Users (ID, Name, Provider, data)
VALUES (':id', ':name', ':provider',':data') ON CONFLICT DO NOTHING