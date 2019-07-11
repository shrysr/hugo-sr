+++
title = "Notes on Docker"
author = ["Shreyas Ragavan"]
lastmod = 2019-07-11T09:25:54-06:00
tags = ["Docker", "Data-Science"]
categories = ["Docker", "DataScience"]
draft = false
linktitle = "Docker - notes"
toc = true
[menu.docs]
  identifier = "notes-on-docker"
  weight = 2001
+++

Docker is a fascinating concept that could be potentially useful in many ways, especially in Data science, and making reproducible workflows / environments. There are [several](https://towardsdatascience.com/learn-enough-docker-to-be-useful-b7ba70caeb4b) [articles](https://towardsdatascience.com/docker-for-data-scientists-5732501f0ba4) which have great introductions and examples of using docker in data science

This is an evolving summary of my exploration with Docker. It should prove to be a handy refresher of commands and concepts.


## <span class="org-todo todo TODO">TODO</span> What is Docker {#what-is-docker}

A brief summary of what Docker is all about.

1.  The main idea: disposable buckets of code that can do a specific task and either exit or run indefinitely.
    1.  The task / purpose of the container could even be a single command. Like `pwd`, which is piped into another container.
    2.  In a way this is an extension of the Unix philosophy of small tools that can do a single task well (i.e reliably).
2.  These buckets of code can be connected with each other and also stacked on top of each other to form a pipeline.
3.  These buckets of code are complete libraries
4.  The buckets consist of images which can be launched as containers.
5.  Docker images are stored in a registry. There are a number of registries, of which dockerhub is popular.

These schematics provide a good refresher of the core concept of Docker:

[Containers versus VM](/ox-hugo/Container-vs-vm.png)

[Engine Components](/ox-hugo/engine-components-flow.png)


### Dive into Docker {#dive-into-docker}

This is an excellent course run by Nick Janatakis ([link](https://diveintodocker.com/?r=devto)), which enabled me to tie together various bits and pieces of knowledge I had about Docker. I would recommend this course for anybody starting out with Docker. A lot of the notes in this document were gathered while going through the course.


#### Biggest wins of Docker {#biggest-wins-of-docker}

-   isolate and manage applications.
-   eg:  12 apps with 12 dependency sets.
-   VM : waste of resources.
-   Vagrant : lets you manage VM's on the command line (including Docker)
    -   Disk space occupied for each app is very high.
    -   Overhead of system boot up and restart / killing is high.
-   Docker can be used to manage common dependencies.
    -   Example of time frame: 2 seconds for loading 8 services.
    -   Spinning up an entire stack is very fast, compared to a VM.
-   Docker: portability of applications and dev environment.
-   Dozens of scenarios where something works for you but not for me.
-   New dev environments can be discouraging. With all the libraries and dependencies already installed, it is possible to become aggressive with the actual development and experimenting with new technology.
-   Multiple versions of a programming language can be installed within a single docker container.
-   Smaller Microservices that talk to each other are not always good, but Docker enables this in a streamlined manner.
-   LXC: raw linux containers. Existed long before docker.
    -   uses runC
    -   very complicated and brittle system.
    -   runs only on Linux.
    -   LXC's are still better than VM's for rapid build and deploy.
-   ANSIBLE: what files and tools should be on a server (very basic definition)


## Easy ways to get documentation help {#easy-ways-to-get-documentation-help}

-   Just typing in `docker` will provide a list of primary level commands that can be used.
-   For further flags, provide the primary command like `docker run --help`
-   The official documentation is a good resource.


## Definitions {#definitions}

1.  Image: Setup of the virtual computer.
2.  Container:  Instance of an image. Many containers can run with the same image.


## <span class="org-todo todo TODO">TODO</span> Running Emacs on Docker {#running-emacs-on-docker}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2019-07-07 Sun 17:25] </span></span> <br />
    Matrix DS offers a viable alternative as a platform. However, a customised docker container with all my tools is a good way to reproduce my working environment and also share my work with the community.
-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2019-07-06 Sat 17:54] </span></span> <br />
    This needs to be evaluated. Today I have a vague idea : set up a docker container combining Rocker + data science at the command line + Scimax together. A separate layer could also cater to shiny apps.

-   <https://www.christopherbiscardi.com/2014/10/17/emacs-in-docker/>
-   [Silex - github](https://github.com/Silex/docker-emacs) : Also contains references to other kinds of Emacs docker containers


## <span class="org-todo todo TODO">TODO</span> Good Online resources for Rocker {#good-online-resources-for-rocker}

-   Introducing Rocker: Docker for R | R-Bloggers
-   Rocker: Using R on Docker - A Hands-On Introduction - useR2015\_docker.Pdf
-   Jessie Frazelle's Blog: Using an R Container for Analytical Models
-   ROcker Images - Wiki Github
-   Introduction to Docker - Paper
-   [ ] Need to find a way to extract a bunch of links from the bookmark and directly available with org Mode.
-   [X] Play with Docker [link](https://training.play-with-docker.com)


## <span class="org-todo todo TODO">TODO</span> Introduction to Rocker - Technical paper [link](https://arxiv.org/pdf/1710.03675.pdf) {#introduction-to-rocker-technical-paper-link}


## Installation {#installation}


### Note on Docker Toolbox versus Native apps {#note-on-docker-toolbox-versus-native-apps}

The native Docker application uses the type 1 hypervisor (hyperkit for Mac OS and hyper-V for Windows). `docker-machine` uses a virtualbox based hypervisor (type 2). This can also be specified while creating docker machines.

In general, the native applications have a better user experience and commands can be directly typed into the terminal. The native apps (on Windows/ Mac OS) are newer than the Docker toolbox, and are being actively developed by the Docker company to reach performance on par with the original virtualbox based Docker Toolbox approach.

Note that any performance lag depends on the application and as a thumb rule it may be better to start off with the native applications and switch to the toolbox when required.


### Installing Docker on debian {#installing-docker-on-debian}

The docker repository has to be added first for being able to install docker. Detailed instructions are available at <https://docs.docker.com/install/linux/docker-ce/debian/>.

A package is also available, and is probably the easiest method to install. Choose the appropriate version at:  <https://download.docker.com/linux/debian/dists/>

Manual version without using the package:

Adding Docker's official GPG key:

```sh
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
```

Searching that the key has been installed:

```sh
sudo apt-key fingerprint 0EBFCD88
```

pub   rsa4096 2017-02-22 [SCEA]
      9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
uid           [ unknown] Docker Release (CE deb) <docker@docker.com>
sub   rsa4096 2017-02-22 [S]

Adding the stable Docker repository:

```sh
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/debian \
   $(lsb_release -cs) \
   stable"
```

Update the package lists and now search for docker-ce. It should be available since the repository has been added and the list updated.

```sh
sudo apt-get update
```

Installing docker and necessary components. Note that the manual recommends removing any older installations if they exist.

Note from the manual that different versions of docker can be installed by including `sudo apt-get install docker-ce=VERSION=abcd`. Therefore multiple versions can probably exist side by side.

```sh
sudo apt-get install docker-ce docker-compose docker-ce-cli containerd.io
```

Creating a docker group and adding this to the sudoers list will enable running docker commands without using root privileges (`sudo`). A logout will be necessary to have the changes take effect.

Note: Sometimes the `$USER` variable does not seem to work. This can be replaced with your actual user name.

```sh
sudo groupadd docker
sudo usermod -aG docker $USER
```

To configure docker to start on boot, enable it as a service. The need to do this depends on how frequently you use docker commands.

```sh
sudo systemctl start docker
```


### Installing Docker on Antergos / Arch Linux {#installing-docker-on-antergos-arch-linux}

Installation can be done via Pacman

```sh
sudo pacman -S docker
```

Enable and start docker service.

```sh
sudo systemctl enable docker
sudo systemctl start docker
```

Add docker to the user's group using `usermod`. After adding this, a log-out is necessary. Note that $USER can be replaced with the output of `whoami` in the shell if desired. If this step is not performed, each docker command will have to be executed with `Sudo` elevation.

```sh
sudo usermod -a -G docker $USER
```


### Installing Docker on Mac OS {#installing-docker-on-mac-os}

Docker can be downloaded as an app from the docker store :  <https://hub.docker.com/editions/community/docker-ce-desktop-mac>.

On the Mac, the docker app has to be launched run first, and this will create a docker icon in the menu bar indicating the status of the docker machine. This launches the docker daemon, and then commands can be directly entered into the terminal.

Docker can also be installed using Brew:

```shell
brew cask install docker
```

This created an app in the Applications folder which has to be launched. However, it seems additional components are required to run Docker from the command Line. These are available via brew.

```shell
brew install docker-compose docker-machine
```


### Checking the installation {#checking-the-installation}

```shell
docker info
```

Trying the hello world container as an additional check. Note the steps listed in the output, which is the typical process.

```shell
cd ~/docker-test
docker run hello-world
```

Checking `docker-compose` version.

```sh
docker-compose --version
```


## General notes on containers and images {#general-notes-on-containers-and-images}

-   images contain the entire filesystem and parameters needed to run the application.
-   When an image is run, a container is created.
-   containers are generally immutable and changes do not linger
-   One image can spawn any number of containers, simultaneously. Each container will be separate.


## Default location of images {#default-location-of-images}

By default, on Antergos (Linux), the images are stored at `/var/lib/docker/`

```shell
sudo ls -al /var/lib/docker
```


## Docker version and info {#docker-version-and-info}

```shell
docker --version
docker info
docker version
```


## Listing Docker containers and images {#listing-docker-containers-and-images}

List Docker Images

```shell
docker image ls
```

List running Docker Containers

```shell
docker container ls
```

List all docker containers (running and Stopped)

```shell
docker container ls -a
```

Obtain only container ID's  (All). This is useful to extract the container number alone. The `q` argument stands for quiet.

```shell
docker container ls -aq
```


## Getting started {#getting-started}

[Ropenscilabs](http://ropenscilabs.github.io/r-docker-tutorial) has a basic introduction to Docker, and the [Docker documentation](https://docs.docker.com/get-started/part2/) is also a good place to start. A rocker specific introduction is available [here](https://github.com/BillMills/Rocker-tutorial/).

If a local image is not found, docker will try to search and download the image from docker hub.

It is better to create a folder wherein the docker container will reside.

```shell
mkdir ~/docker-test/
cd ~/docker-test
docker --rm -p 8787:8787 rocker/tidyverse
```

The `--rm` flag indicates the container will be deleted when the container is quite. The `-p` flag denotes using a particular port.
iner a
Note that the interim messages and download progress are not shown in eshell.

[Different rocker images](https://www.rocker-project.org/images/) are available, depending on the need to be served.


## Attaching shells `-t` and Interactive containers `-i` {#attaching-shells-t-and-interactive-containers-i}

Example to run an ubuntu container and run bash interactively, by attaching a terminal to the container. This will login to Ubuntu and start bash.

An alternative option is to use alpine linux, which is a much smaller download.

```shell
docker run -t -i ubuntu /bin/bash
```

```sh
docker run -ti alpine /bin/bash
```


## Running a detached container {#running-a-detached-container}

-   use the `-d` flag

```shell
docker container ls -al
docker run -d ubuntu
```


## Build process of a docker image {#build-process-of-a-docker-image}

-   `docker commit` : used to commit changes to a new image layer. This is a manual process. Commit has little place in the real world. Dockerfile is superior.
-   Dockerfile : blue print or recipe for creating a docker image. Each actionable step becomes a separate layer.

Docker image : result of stacking up individual layers. Only the parts or layers that have changed are downloaded for a newer version of a specific image.

Scratch image: docker image with no base operating system


## Working with dockerfiles {#working-with-dockerfiles}

-   sample or reference docker files can be saved as "dockerfile.finished" or with some other useful extension.
-   Dockerfiles are read top to bottom.
-   the first non-comment instruction should be `FROM`
    -   `FROM` allows you import a docker image.
-   `RUN` : basically executes the specified commands
-   `WORKDIR` : setting the desired working directory. This can be set or used multiple times in the same docker file.
