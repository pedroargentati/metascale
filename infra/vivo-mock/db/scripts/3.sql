-- Configurando permissões do usuário para a replicação
SYSTEM mysql -u root -proot

GRANT SELECT, UPDATE, DELETE, INSERT, RELOAD, SHOW DATABASES, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'user';
FLUSH PRIVILEGES;