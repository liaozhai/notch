FROM postgres:18
ADD init.sql /home/init.sql
ADD init.sh /docker-entrypoint-initdb.d/init.sh
ADD *.csv /home/
EXPOSE 5432