+++
title = "Juggling multiple projects and leveraging org-projectile"
author = ["Shreyas Ragavan"]
date = 2019-01-25T14:44:00-07:00
tags = ["Org-mode", "Emacs"]
categories = ["Emacs", "Productivity"]
draft = false
profile = false
toc = true
+++

[Scimax](https://github.com/jkitchin/scimax) has a convenient feature of immediately creating projects (`M-x nb-new`). The location of the project directory is defined by the setting `(setq nb-notebook-directory "~/my_projects/")`, which has to be set in your Emacs config. Once the name of the project is chosen, a Readme.org buffer is immediately opened and one can start right away. It is an awesome, friction-free method to get started with a project.

These projects are automatically initialised as git repositories, to which it is trivial to add a new remote using Magit. Therefore individual folders and git repos are automatically created for each project in the specified project directory. This enables the convenient possibility of keeping the data, folder structures, tasks, notes and scripts of each project separate.

Different projects can be switched to using `M-x nb-open` and typing in a few words that denote the title of the project. Choosing a project automatically provides the option to open the Readme.org files created earlier. Therefore it would be convenient to include relevant links to different locations / scripts and etc in the Readme file.

Using the above technique resulted in me creating a huge number of projects over a period of time. Especially while working on multiple computers, it is worth inculcating the discipline of adding a remote on github/bitbucket and regularly pushing to the remote.

The advantage of using a separate repo for each project is the alignment with the space constraints imposed by the free tier repos on bitbucket or github. However, it is also useful to have the entire project folder as a git repo. This can be resolved by adding each project as a sub-module. In this way, all the projects are available with a single clone of the project foder, and then specific sub-modules or projects can be initialized as required. Having separate repos for each project also enables more streamlined collaboration or publishing of a particular project, rather than the entire project folder and allowing separate gitignore lists for each project.Using a single file for all the projects will also enable adding notes pertaining to the content of each project, which can be searched before intialising the entire project repo. Scripts for initializing and commit can also be included in this file for convenience.

Once the above is done, the [org-projectile](https://github.com/IvanMalison/org-projectile/blob/master/org-projectile.el) package can be leveraged to plan the tasks and manage the notes for each project. It is possible to have all the tasks for a project within a separate file within each project, or specify a single file as the task management for all the projects. This file is then appended to the org-agenda files for tasks to show up in the agenda. As mentioned in the Readme of the org-projectile package the settings would look like the following (for a single file pertaining to all the projects):

```lisp
;; Setting up org-projectile
(require 'org-projectile)
(setq org-projectile-projects-file
      "~/my_org/project-tasks.org")
(push (org-projectile-project-todo-entry) org-capture-templates)
(setq org-agenda-files (append org-agenda-files (org-projectile-todo-files)))
(global-set-key (kbd "C-c n p") 'org-projectile-project-todo-completing-read)
```

The above snippet adds a TODO capture template activated by the letter 'p', and also adds the `project-tasks` file to the agenda files. Inside a project, it is then possible to capture using `C-cc p` and add a task which will create a top level heading linked to the project, and the task or note as a sub-heading.

{{< figure src="/img/screenshot-org-projectile.png" title="org-projectile task capture" >}}
