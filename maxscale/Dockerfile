FROM ubuntu
RUN apt update &&\
    apt upgrade -y &&\
    apt install -y vim nano net-tools iputils-ping wget
RUN wget https://downloads.mariadb.com/MaxScale/2.4.9/ubuntu/dists/bionic/main/binary-amd64/maxscale-2.4.9-1.ubuntu.bionic.x86_64.deb && \
    dpkg -i maxscale-2.4.9-1.ubuntu.bionic.x86_64.deb; exit 0
RUN apt --fix-broken install -y
EXPOSE 4006 4008
CMD service maxscale start & tail -F /var/log/maxscale/maxscale.log