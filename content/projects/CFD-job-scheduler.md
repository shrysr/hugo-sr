+++
type = "itemized"
author = ""
date = "2017-06-22"
title = "1. Simulation job scheduler"
description = "Python script to manage and schedule ANSYS CFX simulations on designated computing clusters."
featured = ""
featuredpath = ""
featuredalt = ""
categories = ["python", "programming", "CFD"]
linktitle = ""
format = "Python"
link = "#"
+++

{{< figure src="/img/main/scheduler-algo.png" title="Scheduler Psuedo-Algorithm" >}}

# Introduction

**[Code On Github](<https://github.com/shrysr/jobscheduler>)**

This is a Python script for a portable, scalable job scheduler with
multiple priorities - for ANSYS CFX simulations. The script was
designed to be called every minute by an external scheduler
program. In the practical case, the free version of the software
[System
Scheduler](https://www.splinterware.com/products/scheduler.html) was
used to deploy the script successfully, for over 3 years, managing 2
computing clusters.

Once called, the program basically loops through pre designated
folders and lists .def files based on the *last modified* date
available in Windows. The system interaction is via BASH scripts
created via the Python code, as well as the python OS library. There
are several in-built flags to support priority, pausing a particular
cluster, logging data and troubleshooting.

The idea behind the project was to create a multi-platform job
scheduler for ANSYS CFX that has a balance between sophistication and
ease of deployment (and management). Typically job schedulers and load
balancing programs are relatively very sophisticated and complex to
setup with several pre-requisites and constraints. Such complexity
dictates expensive commercial support and licensing considerations.


# Problem Statement 
A job scheduler or simulation management system was required to address the following:

- Optimum and continuous simulation solver license utilisation by all
  members of the team in a First-In-First-Out (FIFO) basis, 
- Provision for dynamic or urgent priority jobs, as well as an
  interface to submit simulations or view job history.
- Optimisation and management of workload of simulation jobs
  facilitating overall project management and planning.


# What the program accomplished 

- Allowed users to submit simulations by simply placing the input
  files in a particular folder location, which also served as a
  particular priority basket.
- Removed the need of creating manual scripts to submit multiple
  simulations and resolved inefficient license utilisation approaches.
- Facilitated a optimised approach to certain design cases, thus
  resulting in a 75% reduction in simulation time
- Enabled the use of consistent solver and memory utilisation
  parameters and settings, allowing efficient deployment and reducing
  inefficiencies due to errors.
- Allowed optimal or perfect utilisation of available licensing
  scheme, resulting in a significant increase in team output and
  productivity.

# Tools used and links

- Written with Python 2.7, using portable python, Spyder, Notepad ++ and Sublime Text 3.

- See the [Github Wiki](https://github.com/shrysr/jobscheduler/wiki/) for the project goals, algorithm and other details.

- [Code On Github](<https://github.com/shrysr/jobscheduler>)




