+++
title = "Docker container and image management within Emacs"
author = ["Shreyas Ragavan"]
date = 2020-02-19T13:46:00-08:00
tags = ["docker", "Data-Science"]
categories = ["Emacs"]
draft = false
weight = 2001
profile = true
toc = false
+++

As my Emacs configuration will indicate, I have installed the package [docker.el](https://github.com/Silex/docker.el) with it the `dockerfile` and `docker-compose` minor mode packages. The main docker package enables me to list, view, launch and generally manage containers from within Emacs instead of using vebose Shell commands and possibly constructing aliases for common commands. The latter 2 packages are more useful for developing and editing docker files (including within Org source blocks) with syntax highlighting.

I have `M-x docker` mapped to `M-s d` and this gives me instant access to all the images and containers on my system. It is invariably handy to run containers with specific commands as well and I intend to use it simplify my workflows. I believe this capability of docker container launch via an interface ia a premium feature in Rstudio.

-   [ ] It would be worthwhile again to add this shortcut to the Scimax hydra. This would come under the apps section, and would probably be the easiest to add as it is the least crowded menu at the moment.

So this has been setup with a minimal configuration, not different from the instructions on the package website.

The best part of this bargain is running the docker package within Emacs on the terminal on a VPS. Therefore I have an overview of all the docker containers right within the terminal, with one press access to actions. This is how it looks:

{{< figure src="/img/docker-container-list-vps-terminal.png" caption="Figure 1: Screenshot: docker containers on terminal Emacs" >}}

{{< figure src="/img/dockcer-image-list-emacs.png" caption="Figure 2: List of docker images available on my machine (GUI Emacs)" >}}

There are a host of other possibilities, including controlling builds, using `docker-compose` and so on. The desired options can be set with single key-presses, similar to the magit porcelain.

{{< figure src="/img/one-press-actions-docker-containers.png" caption="Figure 3: Accessing common commands to be run on containers (Terminal Emacs)" >}}

Using the docker package has saved several minutes of my time (for each command) and just as important - a tonne of effort involved in hunting for docker container names, command history, copying the container ID's and so on that are very typical steps of messing around with docker. Anybody learning docker will know that these commands are used so frequently that it becomes rather annoying quickly.

The next step will be to find a way to interact with remote docker containers from my local Emacs setup. This would be super cool and convenient. Apparently the `docker-tramp` package can help with this. Maybe it's my poor googline skills but - though here are some discussions around in Reddit on this topic - I was expecting many more blog posts or material on the web talking about workflows in using Docker and Emacs, especially considering the amount of effort being saved.
