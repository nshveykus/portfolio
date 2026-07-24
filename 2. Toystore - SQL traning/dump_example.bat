@echo off
set BACKUP_DIR=C:\backups\mysql
set DB_NAME=toystore
set DATE=%date:~0,4%-%date:~5,2%-%date:~8,2%_%time:~0,2%-%time:~3,2%

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump" --defaults-extra-file="C:\users\admin\.my.cnf" %DB_NAME% > %BACKUP_DIR%\%DB_NAME%_%DATE%.sql