#!/bin/bash
config_docker() {
 
  printf '%s\n' "--------------------"
  printf '%s\n' "Setting up Docker"
  printf '%s\n' "--------------------"

  sudo service docker start
  printf "Please login (HINT: \nusername: vladmiratt \npassword: change-me-now \nemail: vladmir.att@gmail.com\n"
  sudo docker login
  if [ $? -eq 0 ]
    then
      printf '%s\n' "--------------------"
      printf '%s\n' " Pulling down VlADMIR Container"
      printf '%s\n' "--------------------"
      sudo docker pull vladmiratt/vladmir:dockerized
    else
      exit $?
  fi
}

config_import() {

  printf '%s\n' "--------------------"
  printf '%s\n' "Setting up Import Script."
  printf '%s\n' "--------------------"

  DIRECTORY=""
  while [ ! -d "$DIRECTORY" ]
    do
      printf '%s\n' "NOTE: Please omit the final '/' for the directory. For example, /var/www/ should be /var/www "
      echo -n "Please specify the FULL path to the raw import data: "
      read DIRECTORY
  done

  if [ $? -eq 0 ]
    then
      cd $DIRECTORY
      curl 'https://raw.githubusercontent.com/easauceda/vlad-mir/master/daily-import/import.py?token=AEFbJ9K8Ist1Mf67g_k8-E8cqk1A2sMyks5W3nIYwA%3D%3D' >> import.py
  fi
  echo "0 */3 * * * python $DIRECTORY/import.py" >> cronjob
  crontab cronjob
  rm cronjob
}

credits() {
  printf '%s\n' "--------------------"
  printf '%s\n' "VLADMIR"
  printf '%s\n' "Sponsored by AT&T"
  printf '%s\n' "Backend Team: David Arias, Erick Sauceda, & Raul Ramirez"
  printf '%s\n' "Frontend Team: Adam Sornoso, Vincent Luong, & Kevin Mowers"
  printf '%s\n' "Advisor: Russel Abbott"
  printf '%s\n' "Liasons: Steve Dulac, Yura Kuchinskiy, & Vladmir Villanueva"
  printf '%s\n' "VLADMIR CLI by Erick Sauceda"
  printf '%s\n' "--------------------"
}

header() {
  figlet -f slant VLADMIR
}

help() {
  echo "USAGE: vladmir [ init | start | restart | update | credits ]"
}

init() {
# Update Local Package Database
  quiet_update
# Install figlet to handle header rendering
  sudo add-apt-repository "deb http://archive.ubuntu.com/ubuntu $(lsb_release -sc) universe"
  sudo apt-get install figlet
  header
# Run preinstall checklist & install MongoDB
  install_mongo
# Run preinstall then install Docker
  install_docker
# configure docker
  config_docker
# configure daily import
  config_import
  header
  printf "VLADMIR initialized! vladmir start to start."
}

install_docker() {
  
  printf '%s\n' "--------------------"
  printf '%s\n' "Installing Docker"
  printf '%s\n' "--------------------"

  sudo apt-get install apt-transport-https ca-certificates
  sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
  sudo rm /etc/apt/sources.list.d/docker.list
  echo "deb https://apt.dockerproject.org/repo ubuntu-trusty main" | sudo tee /etc/apt/sources.list.d/docker.list
	quiet_update
  sudo apt-get purge lxc-docker
  sudo apt-get install -y linux-image-extra-$(uname -r)
  sudo apt-get install -y docker-engine 
}

install_mongo() {

  printf '%s\n' "--------------------"
  printf '%s\n' "Installing MongoDB"
  printf '%s\n' "--------------------"

  sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
  echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
  quiet_update
  sudo apt-get install -y mongodb-org
}

quiet_update(){
  printf '%s\n' "--------------------"
  printf '%s\n' "Updating Packages"
  printf '%s\n' "--------------------"
  sudo apt-get -qq update
}

vladmir_start() {
  printf '%s\n' "--------------------"
  printf '%s\n' "Starting VLADMIR"
  printf '%s\n' "--------------------"

  sudo service mongod start
  sudo service docker start
  sudo docker run --name=vladmir -d -p 54717:3000 --net="host" vladmiratt/vladmir:dockerized	

  if [ $? -ne 0 ]
    then
      echo "Something went wrong."
      exit $?
  else
    echo "VLADMIR Started."
  fi

}

vladmir_stop() {
  printf '%s\n' "--------------------"
  printf '%s\n' "Stopping VLADMIR"
  printf '%s\n' "--------------------"
  sudo docker stop vladmir
	sudo docker rm vladmir
}

update() {
  printf '%s\n' "--------------------"
  printf '%s\n' "Updating VLADMIR"
  printf '%s\n' "--------------------"
  sudo docker stop vladmir
  sudo docker rm vladmir
  sudo docker pull vladmiratt/vladmir:dockerized
}

case $1 in 
init) init
  ;;
start) header
       vladmir_start
  ;;
stop) header
      vladmir_stop
  ;;
restart) header
         vladmir_stop
         vladmir_start
  ;;
update) update
				vladmir_start
  ;;
credits) header
         credits
  ;;
*) help
  ;;
esac
