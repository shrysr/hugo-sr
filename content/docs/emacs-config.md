+++
title = "shrysr's Dotemacs"
author = ["Shreyas Ragavan"]
lastmod = 2020-04-08T22:02:46-07:00
tags = ["Emacs", "config", "dotemacs"]
categories = ["Emacs"]
draft = false
linktitle = "Dotemacs"
toc = true
[menu.docs]
  identifier = "shrysr-s-dotemacs"
  parent = "Emacs"
  weight = 2001
+++

## Introduction {#introduction}

I've been using my own configuration on top of the excellent Scimax for
the past many years. This is a reboot to reverse the bias, and create my
very own emacs configuration. It obviously includes massive snippets of
code from scimax, as well as other configurations I come across, not to
mention the excellent advice often received from #emacs and other
geniuses lurking in irc channels, and of course the vast
internet.

> Note that this config is still under a great deal of flux at the
> moment and will be for the foreseeable future. I am learning elisp
> every (other) day and am rather obsessed like most Emacsers to
> optimise the entire toolset. This is an an opinionated setup.
>
> I would recommend studying the setup and using bits and pieces of it
> as you require, because one primary power of Emacs is being able to
> customise your tool to your needs. However, the eventual goal will
> also be to enable using this configuration as a whole for anybody
> interested.


### Overall setup {#overall-setup}

This file is `emacs-config.org`. This is the source of truth for the
entire config. It is tangled into 2 files, an init.el and a dotemacs.el.

The init.el file is included in the git commit as it will (eventually)
enable starting up emacs with basic libraries, and loading (and if
necessary tangling) this config if one is starting from scratch on a new
machine.

Due to the above - it is important to be careful with using header
arguments for source blocks. As per current Org mode features,
specifying the header arguments, even a `:tangle yes`, will over-ride
the file settings specified elsewhere and thus parts of the config will
never get inserted into the el files that are loaded during init.

The better method to disable tangling of specific blocks would be to
comment out Org headings. It should also be possible to have a setup
wherein headings with specific tags are not tangled, similar to the
noexport tag option with typical org exports. The caveat of using this
option is that these headings will be neglected in an export to say,
something like a Hugo document.

Package management is done via the interesting straight.el. There are
other approaches like borg, using quelpa and so on that I have not
tried. However, the point is that it is better to rely on git to draw
packages rather than MELPA, which can be frustrating at times.

The last 2 headlines contain a 'Testing Area' and 'Disabled'
headline. This contains all the packages that are yet to be a part of my
main setup, or packages that I use occasionally and activate when I
need to. These are available in the raw org file in the repository of
the configuration.

General notes:

-   I was initially using a single init.org file that tangled to an
    init.el file. This kind of setup makes it hard to make meaningful
    commits, especially if the init.el is also a part of the visible
    commits. After all one caveat here is still that ~some external
    library is necessary to tangle these org files into elisp files for
    loading emacs.
-   I would prefer not using git hooks for the tangling because my commit
    workflow is still erratic. Sometimes, there is no change in code, but
    just some additional notes to the configuration.


### Inspirations (and other literate configurations) {#inspirations--and-other-literate-configurations}

This is a growing and non-comprehensive list of configurations that I
admire and have liberally copied from in constructing my own.

-   [Bernt Hansen's very detailed Org-mode config](http://doc.norang.ca/org-mode.html)
-   [Sacha Chua](http://pages.sachachua.com/.emacs.d/Sacha.html)
-   [Mathieu Marques](https://github.com/angrybacon/dotemacs/blob/master/dotemacs.org)
-   [Lee Hinman](https://writequit.org/org/)
-   [Karl Voit](https://karl-voit.at/2017/06/03/emacs-org/)
-   [Dustin Lacewell](https://dustinlacewell.github.io/emacs.d/)
-   [GitHub - wasamasa/dotemacs: Literate Emacs configuration](https://github.com/wasamasa/dotemacs)
-   [GitHub - IvanMalison/dotfiles: Configuration files for XMonad, Emacs, NixOS, Taffybar and more.](https://github.com/IvanMalison/dotfiles)

In general - code and snippet source references are added as and when
possible though this is a tedius task for those with configurations
under a great rate of flux.


### <span class="org-todo todo TODO">TODO</span> Packages I've found very useful {#packages-i-ve-found-very-useful}

Though I'm using a huge number of packages - this list reflects the
absolute core that I consider to be essential to my current _daily_
workflow. This list is being formulated so that I can develop a minimal
Emacs config that can be used for a rapid setup on a headless server.

1.  org-download
2.  org-web-tools
3.  org-ref
4.  treemacs
5.  eyebrowse
6.  projectile
7.  org-projectile
8.  counsel + ivy + swiper
9.  Helm (some functions)
10. magit
11. hydra (and other variants)
12. straight.el


## Init setup {#init-setup}

This part of the config has to be tangled to init.el so that straight
and use-package can be setup. This is a separate init file as it is
expected to remain stable and will be the only .el file that is in git
commit.


### Lexical Scope and binding {#lexical-scope-and-binding}

A reasonable explanation of the importance of lexical binding is available [in the elisp manual](elisp#Lexical%20Binding). This is essentially similar to the quoted or unquoted variables in R.

> A lexically-bound variable has lexical scope, meaning that any reference to the variable must be located textually within the binding
> construct.

```emacs-lisp
;;; -*- lexical-binding: t -*-
(setq-default lexical-binding t)
```


### Garbage collection {#garbage-collection}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2020-04-02 Thu 22:11] </span></span> <br />
    This seems to have reduced my init time by 50% ! From ~7 seconds to
    3.5s at the moment. This is found from (emacs-init-time). This is
    probably the fastest init time I have ever had.

Reference: [dotemacs/init.org at master · wasamasa/dotemacs · GitHub](https://github.com/wasamasa/dotemacs/blob/master/init.org#memory-management)

-   [ ] There are additional options that can be tried on this
    subject. Like garbage collection when focus is lost from
    Emacs. However, this option should speed up init by reducing the
    number of times garbage collection takes place.

<!--listend-->

```emacs-lisp
(setq gc-cons-threshold 50000000)
```


### Package management {#package-management}


#### Straight {#straight}

This snippet essentially bootstraps straight.el, which has several advantages over use-package, along with the ability to seamlessly work with use-package as well.

By bootsrapping, this means that the straight package is downloaded to the user's emacs directory and compiled and installed. Unless set otherwise, the user's emacs directory is `~/.emacs.d`

```emacs-lisp
 (let ((bootstrap-file (concat user-emacs-directory "straight/repos/straight.el/bootstrap.el"))
 (bootstrap-version 3))
 (unless (file-exists-p bootstrap-file)
 (with-current-buffer
 (url-retrieve-synchronously
 "https://raw.githubusercontent.com/raxod502/straight.el/develop/install.el"
 'silent 'inhibit-cookies)
 (goto-char (point-max))
 (eval-print-last-sexp)))
 (load bootstrap-file nil 'nomessage))
```


#### Use-package integration with straight {#use-package-integration-with-straight}

```emacs-lisp
(setq straight-use-package-by-default t)
(straight-use-package 'use-package)
(use-package git) ;; ensure we can install from git sources

```


### Some basic directory definitions {#some-basic-directory-definitions}

```emacs-lisp
;; Base function to create the home directory
(defun sr/fun/homedir (foldername)
"Function to extract the home directory path"
  (expand-file-name foldername (getenv "HOME")))

;; Emacs directory defauling to .emacs.d
(defun sr/fun/emacs-dir (foldername)
"Function to prepend the project directory path to any folder. Starts from the home directory."
  (expand-file-name foldername (sr/fun/homedir ".emacs.d" )))
```


### Shorten yes or no {#shorten-yes-or-no}

It is infuriating that this is not a default in emacs. Therefore this minor snippet is included in the init.

```emacs-lisp
(fset 'yes-or-no-p 'y-or-n-p)
```


### Load main config {#load-main-config}

```emacs-lisp
(load (sr/fun/emacs-dir "dotemacs.el"))
```


## .gitignore {#dot-gitignore}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2020-03-26 Thu 11:38] </span></span> <br />
    In this process, I realised that as long as there is a .gitignore file present (and not in a commit) and the specified files have never been in a commit - git automatically ignores these files. i.e there is no need to commit a .gitignore file.

<!--listend-->

```txt
auto-save-list
autosaves
elpa
eshell
recentf
smex-items
sr-secrets.org.el
projectile-bookmarks.eld
bookmarks
ac-comphist.dat
.mc-lists.el
transient
elpy
tramp
url
```


## Tangle Emacs config on save {#tangle-emacs-config-on-save}


### <span class="org-todo todo TODO">TODO</span> Tangle on save without async {#tangle-on-save-without-async}

As such the tangling hardly takes any time. [Literate Emacs Configuration | Sean Miller: The Wandering Coder](https://thewanderingcoder.com/2015/02/literate-emacs-configuration/) provides an example of setting up a function. This uses the buffer file name to tangle for the emacs config file. A hook is added to the save function to check.

-   [ ] Add a force tangle option if files do not exist. This is because, if for troubleshooting purposes, the el files are deleted, and there is no change in the org file, then the tangling does not take place at all. In general, it may be better to ensure the el files are deleted and tangled again.

<!--listend-->

```emacs-lisp
(defun sr/fun/tangle-on-save-init ()
(when (string= buffer-file-name (file-truename "~/.emacs.d/emacs-config.org"))
(org-babel-tangle)))

(add-hook 'after-save-hook 'sr/fun/tangle-on-save-init)

```


### Local file variables {#local-file-variables}

One way to do this is via local file variables, adding the following to the init file (or any file). However, it seems that this is not 'activated' by default.

```text
# Local variables:
# eval: (add-hook 'after-save-hook (lambda () (org-babel-tangle)) t t)
# end:
```


### <span class="org-todo todo TODO">TODO</span> Async function to tangle org file on save. {#async-function-to-tangle-org-file-on-save-dot}

This is inspired from [Asynchronous tangle and compile of config.org(question/issue) : emacs](https://www.reddit.com/r/emacs/comments/5ej8by/asynchronous%5Ftangle%5Fand%5Fcompile%5Fof%5Fconfigorg/) on reddit and a work in progress. Since I am using straight.el, the byte compilation of packages is not necessary (or already taken care of). It is probably worth noting that the tangling process is almost instant and maybe this effort is not warranted.

(sr/fun/async-tangle-init)

```emacs-lisp
(defun sr/fun/async-tangle-init ()
  (async-start
   (lambda ()
     (org-babel-tangle))
(message "Tangle async done")))

```


## Various directories {#various-directories}

```emacs-lisp


(defun sr/fun/project-dir (foldername)
"Function to prepend the project directory path to any folder. Starts from the home directory."
  (expand-file-name foldername (sr/fun/homedir "my_projects" )))

(defun sr/fun/org-dir (foldername)
"Function to prepend the org directory path to any folder. Starts from the home directory."
  (expand-file-name foldername (sr/fun/homedir "my_org" )))

```


## Auto-save {#auto-save}

Copied from ldleworth's config. I think this makes sense for me at the moment. Here is a summary:

-   Setup auto-save for every file that is visited.
-   Set the auto-save directory explicitly to save all the auto-saves in a single location.
    -   The directory will be created if not available, and will be ignored for
        git.
-   Use the autosave directory for backups as well.
-   [ ] Save every ~~20~~ 60 seconds (experiment with the time frame)
    -   This causes too much lag and has been disabled.
-   [ ] Backup on each save.
    -   [ ] This uses a package. I am not sure whether this is necessary.
-   Backup files even if version controlled
-   [ ] Copy files to avoid various problems.
    -   [ ] check whether this causes any lag with operating emacs.
-   keep 10 versions of old backups and delete old backups.

<!--listend-->

```emacs-lisp
(setq auto-save-default t)
(setq auto-save-timeout 20
      auto-save-interval 60)

(defvar emacs-autosave-directory
(concat user-emacs-directory "autosaves/"))

(unless (file-exists-p emacs-autosave-directory)
(make-directory emacs-autosave-directory))

(setq auto-save-file-name-transforms
`((".*" ,emacs-autosave-directory t)))

(setq backup-directory-alist `((".*" . ,emacs-autosave-directory)))

(use-package backup-each-save
:straight t
:config (add-hook 'after-save-hook 'backup-each-save))

(setq vc-make-backup-files t)

(setq backup-by-copying t)

(setq kept-new-versions 10
kept-old-verisons 0
delete-old-versions t)

```


## OS Level variables {#os-level-variables}

Since I switch between a Linux machine and a Mac frequently, it is better to define variables that can be used to set other variables depending on the OS.

```emacs-lisp
;; Get current system's name
(defun insert-system-name()
  (interactive)
  "Get current system's name"
  (insert (format "%s" system-name))
  )

;; Get current system type
(defun insert-system-type()
  (interactive)
  "Get current system type"
  (insert (format "%s" system-type))
  )

;; Check if system is Darwin/Mac OS X
(defun system-type-is-darwin ()
  (interactive)
  "Return true if system is darwin-based (Mac OS X)"
  (string-equal system-type "darwin")
  )

;; Check if system is GNU/Linux
(defun system-type-is-gnu ()
  (interactive)
  "Return true if system is GNU/Linux-based"
  (string-equal system-type "gnu/linux")
  )

```


## Org-mode related {#org-mode-related}

These have packages and settings that are mostly related to org-mode though there may be other settings that bleed in. org-babel has been given it's own section though it is org-mode related.


### Installing org and org plus contrib via straight {#installing-org-and-org-plus-contrib-via-straight}


#### ldlework's alternative {#ldlework-s-alternative}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2020-03-30 Mon 20:24] </span></span> <br />
    The only addition is the installation of org-plus-contrib and setting the shortcuts for the agenda and link.

-    Fix org-git version

    ```emacs-lisp
    (defun fix-org-git-version ()
    "The Git version of org-mode.
    Inserted by installing org-mode or when a release is made."
    (require 'git)
    (let ((git-repo (expand-file-name
    "straight/repos/org/" user-emacs-directory)))
    (string-trim
    (git-run "describe"
    "--match=release\*"
    "--abbrev=6"
    "HEAD"))))
    ```

-    Fix org release

    ```emacs-lisp
    (defun fix-org-release ()
    "The release version of org-mode.
    Inserted by installing org-mode or when a release is made."
    (require 'git)
    (let ((git-repo (expand-file-name
    "straight/repos/org/" user-emacs-directory)))
    (string-trim
    (string-remove-prefix
    "release_"
    (git-run "describe"
    "--match=release\*"
    "--abbrev=0"
    "HEAD")))))
    ```

-    Install org

    ```emacs-lisp
    (use-package org
    :demand t
    :mode ("\\.org\\'" . org-mode)
    :config
    ;; these depend on the 'straight.el fixes' above
    (defalias #'org-git-version #'fix-org-git-version)
    (defalias #'org-release #'fix-org-release)
    (require 'org-habit)
    (require 'org-capture)
    (require 'org-tempo))

    (use-package org-plus-contrib
       :mode (("\\.org$" . org-mode))
       :bind
       ("C-c l" . org-store-link)
       ("C-c a" . org-agenda))
    ```


### Collection of hooks for org mode {#collection-of-hooks-for-org-mode}

This is intended to be a collection of hooks loaded after org mode. It may be more convenient to add such hooks in the package configurations since the hooks will not work if the package is not available.

However, hooks have the potential to slow down search, opening multiple files like in org-agenda, tramp files and so on. Therefore, the idea is to try collect the hooks here and include logic to discard hooks if the mode or package is not installed.

-   [ ] Maybe work on a method to switch off all the hooks after org mode since this mode is being used extensively.

List of hooks

-   [ ] Org indent mode
-   [ ] Flyspell mode
-   [ ]

<!--listend-->

```emacs-lisp
;; Indent by header level

(with-eval-after-load 'org
   (add-hook 'org-mode-hook #'org-indent-mode))

;; Enable flyspell mode

(add-hook 'org-mode-hook 'flyspell-mode)

```


### Exports {#exports}


#### Markdown export {#markdown-export}

```emacs-lisp
(require 'ox-md)
```


#### ox-pandoc {#ox-pandoc}

```emacs-lisp
(use-package ox-pandoc
  :ensure t
  :straight t
  :defer 5)
```


### Agenda mechanics {#agenda-mechanics}


#### Weekday starts on Monday {#weekday-starts-on-monday}

```emacs-lisp
(setq org-agenda-start-on-weekday 1)
```


#### Display heading tags farther to the right {#display-heading-tags-farther-to-the-right}

```emacs-lisp
(setq org-agenda-tags-column -150)
```


#### Default org directory and agenda file directory {#default-org-directory-and-agenda-file-directory}

```emacs-lisp
(setq
 org-directory "~/my_org/"
 org-agenda-files '("~/my_org/")
 )
```


#### <span class="org-todo todo TODO">TODO</span> Agenda customisation {#agenda-customisation}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2019-02-07 Thu 08:26]  </span></span>  <br />
    Need to clear up the search functions, enabling complete search in journal files. Archive and some external directories are included, since they are explictly in org mode.

<!--listend-->

```emacs-lisp

(setq org-agenda-custom-commands
      '(("c" "Simple agenda view"
         ((tags "recurr"
		((org-agenda-overriding-header "Recurring Tasks")))
          (agenda "")
          (todo "")))
        ("o" agenda "Office mode" ((org-agenda-tag-filter-preset '("-course" "-habit" "-someday" "-book" "-emacs"))))
        ("qc" tags "+commandment")
	("e" tags "+org")
	("w" agenda "Today" ((org-agenda-tag-filter-preset '("+work"))))
	("W" todo-tree "WAITING")
	("q" . "Custom queries") ;; gives label to "q"
	("d" . "ds related")	 ;; gives label to "d"
	("ds" agenda "Datascience" ((org-agenda-tag-filter-preset '("+datascience"))))
	("qw" agenda "MRPS" ((org-agenda-tag-filter-preset '("+canjs"))))
	("qa" "Archive tags search" org-tags-view ""
         ((org-agenda-files (file-expand-wildcards "~/my_org/*.org*"))))
        ("j" "Journal Search" search ""
         ''((org-agenda-text-search-extra-files (file-expand-wildcards "~/my_org/journal/"))))
        ("S" search ""
	 ((org-agenda-files '("~/my_org/"))
	  (org-agenda-text-search-extra-files )))
	)
      )
```


#### TEST Include gpg files in agenda generation {#test-include-gpg-files-in-agenda-generation}

Source: <https://emacs.stackexchange.com/questions/36542/include-org-gpg-files-in-org-agenda>
Note that this must be set first and then the agenda files specified.

```emacs-lisp
(unless (string-match-p "\\.gpg" org-agenda-file-regexp)
  (setq org-agenda-file-regexp
        (replace-regexp-in-string "\\\\\\.org" "\\\\.org\\\\(\\\\.gpg\\\\)?"
                                  org-agenda-file-regexp)))

;;(setq org-agenda-file-regexp "\\`\\\([^.].*\\.org\\\|[0-9]\\\{8\\\}\\\(\\.gpg\\\)?\\\)\\'")
```


#### TEST Expanding search locations {#test-expanding-search-locations}

I initially included my journal location to the agenda search. However it is very slow compared to using grep/rgrep/ag. Therefore, the agenda full text search is now limited to the project directory and the org-brain directory. The snippet below enables searching recursively within folders.

```emacs-lisp
(setq org-agenda-text-search-extra-files '(agenda-archives))

(setq org-agenda-text-search-extra-files (apply 'append
						(mapcar
						 (lambda (directory)
						   (directory-files-recursively
						    directory org-agenda-file-regexp))
						 '("~/my_projects/" "~/my_org/brain/"))))
```


#### <span class="org-todo todo TODO">TODO</span> Adding org archive for text search. Optimise this {#adding-org-archive-for-text-search-dot-optimise-this}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2020-02-22 Sat 13:25] </span></span> <br />
    I don't really use this anymore. I prefer grep or ag for searching through all my text files. The caveat is that the files have to under a single root directory.

<!--listend-->

```emacs-lisp
(setq org-agenda-text-search-extra-files '(agenda-archives))
```


#### Enable default fuzzy search like in google {#enable-default-fuzzy-search-like-in-google}

```emacs-lisp
(setq org-agenda-search-view-always-boolean t)
```


#### Hooks for org-agenda {#hooks-for-org-agenda}

```emacs-lisp
(add-hook 'org-agenda-mode-hook
          '(lambda ()
 	     (hl-line-mode 1)))
```


#### <span class="org-todo done DONE">DONE</span> org-habit {#org-habit}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2019-02-12 Tue 13:20] </span></span> <br />
    Adding a require has brought org-habit back on track.
-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2019-02-07 Thu 09:50] </span></span> <br />
    Appears the use-package config for org-habit is not correct and there is some issue in downloading it as a package.

I want to shift the org habit graph in the agenda further out right so as to leave enough room for the headings to be visible.

```emacs-lisp
(require 'org-habit)
(setq org-habit-graph-column 90)
```


### Archiving mechanics {#archiving-mechanics}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2020-04-06 Mon 23:27] </span></span> <br />
    I prefer to keep my archived files in a separate folder to promote a
    cleaner look and less files in the main org directory. The earlier
    archive file used to replicate the structure of the file where the entry
    was archived from. However, I have realised that the properties of
    archived entries provide all the information that I would need from an
    archived file.

    Projects may require a separate approach. Perhaps archived subtrees
    would help in that case. For general GTD based workflows, the simple
    approach of archiving under a 'Archive' heading seems sufficient. This
    will also mark the difference between using this approach and the
    earlier complete replication.

<!--listend-->

```emacs-lisp
(setq org-archive-mark-done nil)
(setq org-archive-location (sr/fun/org-dir "archive/%s_archive::* Archive"))
```


### <span class="org-todo todo TODO">TODO</span> Capture mechanics {#capture-mechanics}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2019-02-07 Thu 08:24]  </span></span>  <br />
    need to clean this up.


#### <span class="org-todo todo TODO">TODO</span> Doct for org capture templates {#doct-for-org-capture-templates}

[DOCT](https://github.com/progfolio/doct) makes it a lot easier to define capture templates in a clean manner. At the moment, I am interested in adding hooks to specific functions and improving the entire capture process.

-    Install doct

    ```emacs-lisp
    (straight-use-package 'doct)
    ```

-    doct functions

    ```emacs-lisp
    (defun sr/fun/todo-act-ask ()
    '("* %{todo-state} %?"
    ":PROPERTIES:"
    ":CREATED: %U"
    ":PLANNED: %^t"
    ":END:"))

    (defun sr/fun/todo-act-today ()
    '("* %{todo-state} %?"
    ":PROPERTIES:"
    ":CREATED: %U"
    ":PLANNED: %t"
    ":END:"))

    (defun sr/fun/todo-passive ()
    '("* %{todo-state} %?"
    ":PROPERTIES:"
    ":CREATED: %U"
    ":END:"))

    (defun sr/fun/todo-link-act-today ()
    '("* %{todo-state} %a"
    ":PROPERTIES:"
    ":CREATED: %U"
    ":PLANNED: %t"
    ":END:"
    "\n%?"))

    (defun sr/fun/todo-link-act-ask ()
    '("* %{todo-state} ?%a"
    ":PROPERTIES:"
    ":CREATED: %U"
    ":PLANNED: %^t"
    ":END:"
    "\n%?"))

    (defun sr/fun/todo-link-passive ()
    '("* %a"
    ":PROPERTIES:"
    ":CREATED: %U"
    ":END:"
    "\n%?"))

    (defun sr/fun/note-passive ()
    '("* %?"
    ":PROPERTIES:"
    ":CREATED: %U"
    ":END:"))

    ```

-    doct templates

    -   [X] Created inactive date for all entries
    -   [X] Mail : Active date + mu4e link
    -   [X] Mail : Passive date + mu4e link. Meant for general notes and archive.
    -   [X] Note : passive date. Generally not refiled.
    -   [ ] Note : With active date to be refiled or acted upon.
        -   I am not sure if this makes sense. If action is required, it should
            be a task.
    -   [ ] Link :
    -   [ ] Capture to today's journal
    -   [ ] Capture to tomorrow's journal
    -   [ ] Capture to current clocked task

    <!--listend-->

    ```emacs-lisp
    (setq org-capture-templates
          (doct '(("capture" :keys "c"
                   :file "~/my_org/todo-global.org"
    	       :template sr/fun/todo/passive
                   :prepend t
    	       :children (("inbox"
    			   :keys "t"
    			   :type entry
    	                   :file "~/my_org/refile.org"
    			   :headline "inbox"
    			   :todo-state "TODO"
    			   :template sr/fun/todo-passive)
    			  ("mail"
    			   :keys "m"
    			   :type entry
    	                   :file "~/my_org/refile.org"
    			   :todo-state "TODO"
    			   :headline "mail"
    			   :template sr/fun/todo-link-passive)
                              ("reading" :keys "r"
                               :headline   "reading"
                               :todo-state "TODO"
    			   :template sr/fun/todo-link-passive)
    			  ("emacs" :keys "e"
                               :headline   "emacs"
                               :todo-state "TODO"
    			   :template sr/fun/todo-link-passive)))
    	      ("Todo" :keys "t"
                   :file "~/my_org/todo-global.org"
    	       :template sr/fun/todo-act-today
                   :prepend t
    	       :children (("inbox"
    			   :keys "t"
    			   :type entry
    			   :headline "@inbox"
    			   :todo-state "TODO"
    			   :template sr/fun/todo-act-today)
    			  ("mail"
    			   :keys "m"
    			   :type entry
    			   :headline "@mail"
    			   :todo-state "TODO"
    			   :template sr/fun/todo-link-act-today)
    			  ("article"
    			   :keys "r"
    			   :type entry
    			   :headline "@reading"
    			   :todo-state "TODO"
    			   :template sr/fun/todo-link-act-today)))
    	      ("Notes" :keys "n"
                   :file "~/my_org/notes.org"
                   :prepend t
                   :template sr/fun/note-passive
                   :children (("Fast note"
    			   :keys "n"
    			   :type entry
    			   :headline   "@Notes"
    			   )
    			  ("Mail note"
    			   :template sr/fun/todo-link-passive
    			   :keys "m"
    			   :type entry
    			   :headline "@Mail archive"
    			   :file "~/my_org/notes.org")
    			  ("DS Link note"  :keys "d"
    			         :file "~/my_org/datascience.org"
                               :headline   "@Datascience @Notes"
                               :todo-state "TODO"
    			   :template sr/fun/todo-link-passive)))
    	      ;; ("Project" :keys "p"
                  ;;  :file "~/my_org/project-tasks.org"
                  ;;  :template sr/fun/todo-link-active)
    	      )))

    ```


#### Closing org-capture frame on abort {#closing-org-capture-frame-on-abort}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2019-03-13 Wed 07:35] </span></span> <br />
    This basically ensures a clean exit in case of aborting a capture, and
    also maintains buffer configuration on going ahead with the capture.
-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2019-02-07 Thu 08:53]  </span></span>  <br />
    Needs further review.

Source: [emacs - hook or advice when aborting org-capture before template selection? - Stack Overflow](http://stackoverflow.com/questions/23517372/hook-or-advice-when-aborting-org-capture-before-template-selection)

```emacs-lisp
(defadvice org-capture
    (after make-full-window-frame activate)
  "Advise capture to be the only window when used as a popup"
  (if (equal "emacs-capture" (frame-parameter nil 'name))
      (delete-other-windows)))

(defadvice org-capture-finalize
    (after delete-capture-frame activate)
  "Advise capture-finalize to close the frame"
  (if (equal "emacs-capture" (frame-parameter nil 'name))))

```


#### <span class="org-todo todo TODO">TODO</span> Controlling org-capture buffers {#controlling-org-capture-buffers}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2019-03-13 Wed 08:01] </span></span> <br />
    This interferes with org-journal's capture format.

I dislike the way org-capture disrupts my current window, and shows me
the capture buffer, and the target buffer as well. I would prefer a
small pop up window, and then a revert back to the existing windows once
the capture is completed or aborted. However this does not seem possible
without modifying Org-mode's source code. This is a workaround described
at
<https://stackoverflow.com/questions/54192239/open-org-capture-buffer-in-specific-Window>
,which partially resolves the issue by enabling just a single capture
buffer.

```emacs-lisp

(defun my-org-capture-place-template-dont-delete-windows (oldfun args)
  (cl-letf (((symbol-function 'delete-other-windows) 'ignore))
    (apply oldfun args)))

(with-eval-after-load "org-capture"
  (advice-add 'org-capture-place-template :around 'my-org-capture-place-template-dont-delete-windows))
```


### <span class="org-todo todo TODO">TODO</span> Refile mechanics {#refile-mechanics}


#### Refile target level {#refile-target-level}

```emacs-lisp
(setq org-refile-targets
      '((nil :maxlevel . 3)
        (org-agenda-files :maxlevel . 2)))
```


#### General refiling settings {#general-refiling-settings}

```emacs-lisp
(setq org-refile-use-outline-path 'file)
(setq org-outline-path-complete-in-steps nil)
(setq org-reverse-note-order t)
(setq org-refile-allow-creating-parent-nodes 'confirm)
```


### org-source-window split setup {#org-source-window-split-setup}

```emacs-lisp
(setq org-src-window-setup 'split-window-right)
```


### <span class="org-todo todo TODO">TODO</span> Shortcuts (to be replaced via hydra) {#shortcuts--to-be-replaced-via-hydra}

```emacs-lisp
(global-set-key (kbd "C-c d") 'org-time-stamp)
(global-set-key (kbd "M-s s") 'org-save-all-org-buffers)
```


## Temporary package list {#temporary-package-list}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2020-03-30 Mon 07:58] </span></span> <br />
    A lot of these are borrowed from scimax and will be slowly whittled down to the essentials.

<!--listend-->

```emacs-lisp
      ;; (use-package helm-bibtex)

      ;; (use-package helm-projectile)

      ;; Functions for working with hash tables
      (use-package ht)

      (use-package htmlize)

      (use-package hy-mode)

      (use-package hydra
        :init
        (setq hydra-is-helpful t)

        :config
        (require 'hydra-ox))

      (use-package ivy-hydra)

      (use-package jedi)

      (use-package jedi-direx)

      (use-package diminish)

      ;; (use-package avy)

    (use-package rainbow-mode)

    (use-package esup)

    ;; Provides functions for working with files
    (use-package f)

    (straight-use-package 'dash)
    (straight-use-package 'dash-functional)
    (straight-use-package 'ov)
  (straight-use-package 'flx)

    (use-package auto-complete
      :diminish auto-complete-mode
      :config (ac-config-default))

  (use-package google-this
    :config
    (google-this-mode 1))

  (straight-use-package 'ggtags)
  (straight-use-package 'ibuffer-projectile)
```


## Crypto {#crypto}


### Basic crypto {#basic-crypto}

```emacs-lisp
(setq epa-file-encrypt-to "shreyas@fastmail.com")
```


### TEST org-crypt {#test-org-crypt}

```emacs-lisp
(require 'org-crypt)
(add-to-list 'org-modules 'org-crypt)
                                        ; Encrypt all entries before saving
(org-crypt-use-before-save-magic)
;;(setq org-tags-exclude-from-inheritance (quote ("crypt")))
                                        ; GPG key to use for encryption. nil for symmetric encryption
;;(setq org-crypt-key nil)
(setq org-crypt-disable-auto-save t)
;;(setq org-crypt-tag-matcher "locked")

```


### Setting auth sources {#setting-auth-sources}

This was prompted by this discussion <https://emacs.stackexchange.com/questions/10207/how-to-get-org2blog-to-use-authinfo-gpg>

I have modified it to my own file names.

```emacs-lisp
(require 'auth-source)
(setq auth-sources
      '((:source "~/.authinfo.gpg"
		 "~/.bitly-access.token.gpg")))

(setq epa-file-cache-passphrase-for-symmetric-encryption t)

```


## git related {#git-related}


### <span class="org-todo todo TODO">TODO</span> Git gutter {#git-gutter}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2019-02-07 Thu 09:30]  </span></span>  <br />
    Started using this today. It is actually very convenient to quickly view the changes made in the document. There is a function to pop up the changes at that location. I need to learn more about using this tool effectively.

<!--listend-->

```emacs-lisp
  (use-package git-gutter
    :ensure t
    :config
    (global-git-gutter-mode 't)
    :diminish git-gutter-mode)
```


### magit settings {#magit-settings}

```emacs-lisp
  (use-package magit
    :init (setq magit-completing-read-function 'ivy-completing-read)
  :config
  (global-set-key (kbd "C-x g") 'magit-status)
  (setq magit-revert-buffers 'silent)
  (setq magit-process-find-password-functions '(magit-process-password-auth-source)))
```


### <span class="org-todo todo TODO">TODO</span> Time machine for git {#time-machine-for-git}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2019-02-08 Fri 13:21] </span></span> <br />
    Launched by `M-x git-timemachine`, this lets you navigate through the commit history with a single key press! This is especially awesome for tracking changes to a particular snippet of code.
-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2019-02-07 Thu 09:30]  </span></span>  <br />
    Need to evaluate this. The purpose is for stepping through the history of a file recorded in git. This should be very interesting.

<!--listend-->

```emacs-lisp
(use-package git-timemachine
  :ensure t)
```


## PDF related {#pdf-related}


### STABLE PDF Tools {#stable-pdf-tools}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2019-10-23 Wed 09:26] </span></span> <br />
    This appears to be setup via scimax already. Disabling for now.
-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2019-02-18 Mon 14:30] </span></span> <br />
    [osx - Install Pdf-Tools on Emacs MacOSX - Emacs Stack Exchange](https://emacs.stackexchange.com/questions/13314/install-pdf-tools-on-emacs-macosx)

<!--listend-->

```emacs-lisp
(use-package pdf-tools
  :ensure t
  :config
  (custom-set-variables
   '(pdf-tools-handle-upgrades nil)) ; Use brew upgrade pdf-tools instead in the mac
  (setq pdf-info-epdfinfo-program "/usr/local/bin/epdfinfo")
  (pdf-tools-install)
)

```


### org-noter {#org-noter}

> Org-noter's purpose is to let you create notes that are kept in sync when you scroll through the document, but that are external to it - the notes themselves live in an Org-mode file. As such, this leverages the power of Org-mode (the notes may have outlines, latex fragments, babel, etc) acting like notes that are made inside the document. Also, taking notes is very simple: just press i and annotate away!
>
> [Goncalo Santos](https://github.com/weirdNox)

```emacs-lisp
(use-package org-noter
  :ensure t
  :defer t
  :config
  (setq org-noter-set-auto-save-last-location t)
  )
```


## Window, frame and buffer management {#window-frame-and-buffer-management}


### winum {#winum}

This package makes it easy to switch between frames, and is particularly useful in a multi screen setup of emacs.

```emacs-lisp
(use-package winum
  :defer nil
  :init
  ;; ;;(define-key map (kbd "C-`") 'winum-select-window-by-number)
  ;; (define-key winum-keymap (kbd "C-0") 'winum-select-window-0-or-10)
  ;; (define-key winum-keymap (kbd "C-1") 'winum-select-window-1)
  ;; (define-key winum-keymap (kbd "C-2") 'winum-select-window-2)
  ;; (define-key winum-keymap (kbd "C-3") 'winum-select-window-3)
  ;; (define-key winum-keymap (kbd "C-4") 'winum-select-window-4)
  ;; (define-key winum-keymap (kbd "C-5") 'winum-select-window-5)
  ;; (define-key winum-keymap (kbd "C-6") 'winum-select-window-6)
  ;; (define-key winum-keymap (kbd "C-7") 'winum-select-window-7)
  ;; (define-key winum-keymap (kbd "C-8") 'winum-select-window-8)
  :ensure t
  :config
  ;;(winum-set-keymap-prefix (kbd "C-"))'
  (global-set-key (kbd "C-0") 'winum-select-window-0-or-10)
  (global-set-key (kbd "C-1") 'winum-select-window-1)
  (global-set-key (kbd "C-2") 'winum-select-window-2)
  (global-set-key (kbd "C-3") 'winum-select-window-3)
  (global-set-key (kbd "C-4") 'winum-select-window-4)
  (global-set-key (kbd "C-5") 'winum-select-window-5)
  (global-set-key (kbd "C-6") 'winum-select-window-6)
  (global-set-key (kbd "C-7") 'winum-select-window-7)
  (global-set-key (kbd "C-8") 'winum-select-window-8)
  (setq
   window-numbering-scope            'global
   winum-ignored-buffers             '(" *which-key*")
   winum-ignored-buffers-regexp      '(" \\*Treemacs-.*"))
  (winum-mode))
```


### Winner mode {#winner-mode}

Enabling winner mode. This is convenient to switch between temporary window configurations in conjunction with somewhat more permanent configurations in eyebrowse.

```emacs-lisp
(winner-mode)
```


### TEST eyebrowse {#test-eyebrowse}

This has to be combined with desktop.el or some other method to enable persistence across sessions. However, this does work well for a single session.

```emacs-lisp
(use-package eyebrowse
  :ensure t
  :config
  (setq eyebrowse-mode-line-separator " "
        eyebrowse-new-workspace t)
  (eyebrowse-mode 1)
  )
```


### <span class="org-todo todo TODO">TODO</span> Bufler {#bufler}

For the few occassions that I use the buffer-list command, I think the bufler
package provides a more functional interface.

-   [ ] explore the workspace configuration format. Can this restricted on a
    frame basis like eyebrowse? Does that even make sense?

<!--listend-->

```emacs-lisp
(use-package bufler
  :straight (bufler :host github :repo "alphapapa/bufler.el")
:bind ("C-x C-b" . bufler-list))
```


### Frame settings {#frame-settings}

I'm often running emacsclient with a daemon and have found that specific settings need to be set for each frame that is created, like the window size, and the visual fill column and line settings.

1.  [X] Full screen and windows on Mac OS
2.  [X] Enable global visual line mode and visual fill column mode. Apparently this was fixed without frame settings.

<!--listend-->

```emacs-lisp
(add-to-list 'default-frame-alist '(fullscreen . fullboth))
```


### crux {#crux}

Crux has a handle re-open and root function that will open a file as root if the permissions are set so.

```emacs-lisp
(use-package crux
  :straight t
  :defer 10
  :bind (("C-c C-s" . crux-sudo-edit)
         ("C-c C-r" . crux-eval-and-replace)
         ("C-c o" . crux-open-with))
  :config
  (progn
    (crux-reopen-as-root-mode)))

```


## Emacs information {#emacs-information}


### which key {#which-key}

```emacs-lisp
  (use-package which-key
    :defer 5
    :diminish which-key-mode
    :straight t
    :config
    (which-key-mode))
```


## Project management {#project-management}


### <span class="org-todo todo TODO">TODO</span> org-projectile {#org-projectile}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2019-02-07 Thu 08:42]  </span></span>  <br />
    need to optimise further and convert to use-package style. Also need a way to capture Notes from projects, in addition to tasks.

Starting off with the basic configuration posted in org-projectile github repo.

```emacs-lisp
(use-package org-projectile
  :straight t
  :bind (("C-c n p" . org-projectile-project-todo-completing-read)
         ("C-c c" . org-capture))
  :config
  (setq org-projectile-projects-file
        "~/my_org/project-tasks.org")
  ;; (setq org-agenda-files (append org-agenda-files (org-projectile-todo-files))) ;; Not necessary as my task projects are a part of the main org folder
  (push (org-projectile-project-todo-entry) org-capture-templates)
  (setq org-projectile-capture-template "* TODO %?\n:PROPERTIES:\n:CREATED: [%<%Y-%m-%d %a %H:%M>]\n:END:\n%l"))

```


### projectile {#projectile}

-   [ ] Add a variable for the emacs\_meta directory.

<!--listend-->

```emacs-lisp
;; https://github.com/bbatsov/projectile
(use-package projectile
  :init (setq projectile-cache-file
	      (expand-file-name "emacs_meta/projectile.cache" org-directory)
	      projectile-known-projects-file
	      (expand-file-name "emacs_meta/projectile-bookmarks.eld" org-directory))
  :bind
  ("C-c pp" . projectile-switch-project)
  ("C-c pb" . projectile-switch-to-buffer)
  ("C-c pf" . projectile-find-file)
  ("C-c pg" . projectile-grep)
  ("C-c pk" . projectile-kill-buffers)
  ;; nothing good in the modeline to keep.
  :diminish ""
  :config
  (define-key projectile-mode-map (kbd "H-p") 'projectile-command-map)
  (setq projectile-sort-order 'recently-active)
  (projectile-global-mode))

```


## Knowledge management {#knowledge-management}


### org-brain {#org-brain}

```emacs-lisp
  (use-package org-brain
    :straight (org-brain :type git :host github :repo "Kungsgeten/org-brain")
    ;; :straight (org-brain :type git :host github :repo "Kungsgeten/org-brain"
    ;; 			 :fork (:host github :repo "dustinlacewell/org-brain"))
    :bind ("M-s v" . org-brain-visualize)
    :config
    ;; this unbinds all default org-brain bindings
    ;; This is needed to use deflayer
    ;; (setcdr org-brain-visualize-mode-map nil)

    (setq
     ;; org-brain-path (f-join path-of-this-repo "brain")
     org-brain-path (sr/fun/org-dir "brain")
     org-brain-visualize-default-choices 'all
     org-brain-include-file-entries t
     org-brain-scan-for-header-entries t
     org-brain-file-entries-use-title t
     org-brain-show-full-entry t
     org-brain-show-text t
     org-id-track-globally t
     org-brain-vis-current-title-append-functions '(org-brain-entry-tags-string)
     org-brain-title-max-length 24))
;; This used to work earlier, but there seems to be an error in the configuration that has to be fixed
    ;; (push '("b" "Brain" plain (function org-brain-goto-end)
    ;;         "* %i%?\n:PROPERTIES:\n:CREATED: [%<%Y-%m-%d %a %H:%M>]\n:ID: [%(org-id-get-create)]\n:END:" :empty-lines 1
    ;;       org-capture-templates)))
    ;; (add-hook 'org-brain-refile 'org-id-get-create)))
```


#### Navigation Helpers {#navigation-helpers}

```emacs-lisp
  (defun my/org-brain-visualize-parent ()
    (interactive)
    (when (org-brain-parents (org-brain-entry-at-pt)) (org-brain-visualize-parent (org-brain-entry-at-pt))))

  (defun my/org-brain-visualize-child (entry &optional all)
    (interactive (list (org-brain-entry-at-pt)))
    (when (org-brain-children entry)
      (let* ((entries (if all (org-brain-children entry)
                      (org-brain--linked-property-entries
                       entry org-brain-children-property-name)))
           (child (cond
                   ((equal 1 (length entries)) (car-safe entries))
                   ((not entries) (error (concat entry " has no children")))
                   (t (org-brain-choose-entry "Goto child: " entries nil t)))))
        (org-brain-visualize child))))

  (defun my/next-button-with-category (category)
    (let ((original-point (point))
          (first-result (text-property-search-forward 'brain-category category t t)))
      (when first-result
            (goto-char (prop-match-beginning first-result)))
      (when (eq original-point (point))
        (beginning-of-buffer)
        (let ((second-result (text-property-search-forward 'brain-category category t t)))
          (when second-result
            (goto-char (prop-match-beginning second-result))))
        (when (eq 0 (point))
          (goto-char original-point))
        )
      ))

  (defun my/previous-button-with-category (category)
    (let ((result (text-property-search-backwards 'brain-category category nil t)))))

  (defun my/next-brain-child ()
    (interactive)
    (my/next-button-with-category 'child))

  (defun my/next-brain-history ()
    (interactive)
    (my/next-button-with-category 'history))

  (defun my/avy-brain-jump (category)
    (avy-jump "\\<." :pred (lambda () (and (eq category (get-text-property (point) 'brain-category))
                                      (eq (- (point) 1) (button-start (button-at (point))))))
              :action (lambda (p) (goto-char (+ 1 p)) (push-button))))

  (defun my/avy-brain-jump-history ()
    (interactive)
    (my/avy-brain-jump 'history))

  (defun my/avy-brain-jump-child ()
    (interactive)
    (my/avy-brain-jump 'child))

  (defun my/avy-brain-jump-parent ()
    (interactive)
    (my/avy-brain-jump 'parent))

  (defun my/avy-brain-jump-friend ()
    (interactive)
    (my/avy-brain-jump 'friend))

  (defun my/avy-brain-jump-sibling ()
    (interactive)
    (my/avy-brain-jump 'sibling))
```


### org-web-tools {#org-web-tools}

This package contains a bunch of useful tools which can cut down a lot of work

```emacs-lisp
(use-package org-web-tools
:defer 5
:ensure nil
:config
(global-set-key (kbd "H-y") 'org-web-tools-insert-link-for-url))
```


### org-download {#org-download}

```emacs-lisp
(use-package org-download
  :defer nil
  :ensure t
  ;;:after org
  :config
    ;; Drag-and-drop to `dired`
  (add-hook 'dired-mode-hook 'org-download-enable)
  ;; For some reason this still seems required, despite using defer nil
  (require 'org-download)
  )
```


## Dired {#dired}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2020-03-28 Sat 15:10] </span></span> <br />
    Apparently, dired is not available in to be installed via MELPA.

These are settings dervied from the configuration of [Angry Bacon](https://github.com/angrybacon/dotemacs/blob/master/dotemacs.org). Also adapted from a [pragmatic emacs article](http://pragmaticemacs.com/emacs/tree-style-directory-views-in-dired-with-dired-subtree/).

Note that `C-x C-q` for `dired-toggle-read` only.

```emacs-lisp
(use-package dired-subtree
:straight t
:config
(bind-keys :map dired-mode-map
           ("i" . dired-subtree-insert)
             (";" . dired-subtree-toggle)))

;; Show directories first
 (defun me/dired-directories-first ()
    "Sort dired listings with directories first before adding marks."
    (save-excursion
      (let (buffer-read-only)
        (forward-line 2)
        (sort-regexp-fields t "^.*$" "[ ]*." (point) (point-max)))
      (set-buffer-modified-p nil)))

(advice-add 'dired-readin :after #'me/dired-directories-first)

(add-hook 'dired-mode-hook (lambda () (dired-hide-details-mode)
			     (setq visual-fill-column-mode 'nil)))

(setq dired-auto-revert-buffer t
   dired-dwim-target t
   dired-hide-details-hide-symlink-targets nil
   dired-listing-switches "-alh"
   dired-ls-F-marks-symlinks nil
   dired-recursive-copies 'always)

```


## TEST Treemacs <code>[0/3]</code> {#test-treemacs}

-   [ ] Learn about treemacs projectile
-   [ ] Learn about treemacs-magit

As such most of these

```emacs-lisp
(use-package treemacs
  :ensure t

  :init
  (with-eval-after-load 'winum
    (define-key winum-keymap (kbd "M-0") #'treemacs-select-window))
  :config
  (progn
    (setq treemacs-collapse-dirs
          (if (executable-find "python3") 3 0)
          treemacs-deferred-git-apply-delay      0.5
          treemacs-display-in-side-window        t
          treemacs-eldoc-display                 t
          treemacs-file-event-delay              5000
          treemacs-file-follow-delay             0.2
          treemacs-follow-after-init             t
          treemacs-git-command-pipe              ""
          treemacs-goto-tag-strategy             'refetch-index
          treemacs-indentation                   2
          treemacs-indentation-string            " "
          treemacs-is-never-other-window         nil
          treemacs-max-git-entries               5000
          ttreemacs-no-png-images                 nil
          treemacs-no-delete-other-windows       t
          treemacs-project-follow-cleanup        nil
          treemacs-persist-file                  "~/my_org/emacs_meta/.treemacs-persist"
          treemacs-recenter-distance             0.1
          treemacs-recenter-after-file-follow    nil
          treemacs-recenter-after-tag-follow     nil
          treemacs-recenter-after-project-jump   'always
          treemacs-recenter-after-project-expand 'on-distance
          treemacs-show-cursor                   nil
          treemacs-show-hidden-files             t
          treemacs-silent-filewatch              nil
          treemacs-silent-refresh                nil
          treemacs-sorting                       'alphabetic-desc
          treemacs-space-between-root-nodes      t
          treemacs-tag-follow-cleanup            t
          treemacs-tag-follow-delay              1.5
          treemacs-width                         35)

    ;; The default width and height of the icons is 22 pixels. If you are
    ;; using a Hi-DPI display, uncomment this to double the icon size.
    ;;(treemacs-resize-icons 44)

    ;;(treemacs-follow-mode t)
    (treemacs-filewatch-mode t)
    (treemacs-fringe-indicator-mode t)
    (pcase (cons (not (null (executable-find "git")))
                 (not (null (executable-find "python3"))))
      (`(t . t)
       (treemacs-git-mode 'deferred))
      (`(t . _)
       (treemacs-git-mode 'simple))))
  :bind
  (:map global-map
        ("M-0"       . treemacs-select-window)
        ("M-s t t" . treemacs)
        ("M-s t w" . treemacs-switch-workspace)
        ;; ("C-x t 1"   . treemacs-delete-other-windows)
        ;; ("C-x t t"   . treemacs)
        ;; ("C-x t B"   . treemacs-bookmark)
        ;; ("C-x t C-t" . treemacs-find-file)
        ;; ("C-x t M-t" . treemacs-find-tag)
        )
  )

```

```emacs-lisp
;; (use-package treemacs-evil
;;   :after treemacs evil
;;   :ensure t)

(use-package treemacs-projectile
  :after treemacs projectile
  :ensure t)

(use-package treemacs-icons-dired
  :after treemacs dired
  :ensure t
  :config (treemacs-icons-dired-mode))

(use-package treemacs-magit
  :after treemacs magit
  :ensure t)
```


## Selection, search, bookmarks and jumps {#selection-search-bookmarks-and-jumps}


### smex {#smex}

```emacs-lisp
(straight-use-package 'smex)
```


### Counsel {#counsel}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2020-03-30 Mon 18:08] </span></span> <br />
    Apparently, swiper, counsel, ivy are contained in the same repository and not as separate packages. Though I would prefer using counsel for everything with the minibuffer style, rather than helm - there are undoubtedly several advantages and built-in features in helm whereas counsel would need these carefully constructed. For example, it appears that the multiple select and action operation has to be separately defined for `counsel-find-file` and `counsel-switch-buffer`. While `counsel-M-x` seems generally more responsive than `helm-M-x`, helm offers a useful partition of the results in general based on recent commands/files and others. `helm-apropos` offers a list of commands and variables

This configuration is picked up from scimax.

-   [X] Figure out which of these functions benefit from helm rather than counsel.
    -   [X] helm-switch-buffer
    -   [X] helm-find-file
    -   [X] helm-appropos

<!--listend-->

```emacs-lisp
  (use-package counsel
    :straight t
    :init
    (require 'ivy)
    (require 'smex)
    (setq projectile-completion-system 'ivy)
    (setq ivy-use-virtual-buffers t)
    (define-prefix-command 'counsel-prefix-map)
    (global-set-key (kbd "H-c") 'counsel-prefix-map)

    ;; default pattern ignores order.
    (setf (cdr (assoc t ivy-re-builders-alist))
          'ivy--regex-ignore-order)
    :bind
    (("M-x" . counsel-M-x)
     ;; ("C-x b" . ivy-switch-buffer)
     ;; ("C-x C-f" . counsel-find-file)
     ("C-x l" . counsel-locate)
     ;; ("C-h f" . counsel-describe-function)
     ("C-h v" . counsel-describe-variable)
     ("C-h i" . counsel-info-lookup-symbol)
     ("H-c r" . ivy-resume)
     ("H-c l" . counsel-load-library)
     ("H-c f" . counsel-git)
     ("H-c g" . counsel-git-grep)
     ("H-c a" . counsel-ag)
     ("H-c p" . counsel-pt))
    :diminish ""
    :config
    (progn
      (counsel-mode)
      (define-key minibuffer-local-map (kbd "C-r") 'counsel-minibuffer-history)
      (define-key ivy-minibuffer-map (kbd "M-<SPC>") 'ivy-dispatching-done)

      ;; C-RET call and go to next
      (define-key ivy-minibuffer-map (kbd "C-<return>")
        (lambda ()
          "Apply action and move to next/previous candidate."
          (interactive)
          (ivy-call)
          (ivy-next-line)))

      ;; M-RET calls action on all candidates to end.
      (define-key ivy-minibuffer-map (kbd "M-<return>")
        (lambda ()
          "Apply default action to all candidates."
          (interactive)
          (ivy-beginning-of-buffer)
          (loop for i from 0 to (- ivy--length 1)
                do
                (ivy-call)
                (ivy-next-line)
                (ivy--exhibit))
          (exit-minibuffer)))

      ;; s-RET to quit
      (define-key ivy-minibuffer-map (kbd "s-<return>")
        (lambda ()
          "Exit with no action."
          (interactive)
          (ivy-exit-with-action
           (lambda (x) nil))))

      ;; Show keys
      (define-key ivy-minibuffer-map (kbd "?")
        (lambda ()
          (interactive)
          (describe-keymap ivy-minibuffer-map)))

      (define-key ivy-minibuffer-map (kbd "<left>") 'ivy-backward-delete-char)
      (define-key ivy-minibuffer-map (kbd "<right>") 'ivy-alt-done)
      (define-key ivy-minibuffer-map (kbd "C-d") 'ivy-backward-delete-char)))
```


#### Temp {#temp}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2020-03-28 Sat 23:09] </span></span> <br />
    For some reason, this seems to be required at the moment.

<!--listend-->

```emacs-lisp
(straight-use-package 'counsel)
(counsel-mode)
```


### Expand region package {#expand-region-package}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2019-02-07 Thu 09:27]  </span></span>  <br />
    Explore how this works, and customise it.

This can be set to intelligently expand the selection of text. For example, Using the designated binding, the first expansionh would cover say the content between quotes, and then expand outwards.

```emacs-lisp
(use-package expand-region
  :ensure t
  :bind ("C-=" . er/expand-region))

(message "Loaded easier selection")
```


### Hippie Expand {#hippie-expand}

This is a nifty little package that makes expansion of selection at point more customised, and is handy for expanding into variable names and function names in the same buffer, especially for a long snippet of code.

```emacs-lisp
(global-set-key (kbd "M-/") (make-hippie-expand-function
			     '(try-expand-dabbrev-visible
			       try-expand-dabbrev
			       try-expand-dabbrev-all-buffers) t))
```


### Browse kill ring {#browse-kill-ring}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2020-03-30 Mon 18:20] </span></span> <br />
    This command allows an interactive browsing and insertion from the kill ring. However it does not allow a search. For enabling a search of the kill ring in addition to marking and insertion `helm-king-ring` can be used. However the latter method does not offer a preview of the material being yanked.

<!--listend-->

```emacs-lisp
(use-package browse-kill-ring
:bind ("M-y" . browse-kill-ring)
  :ensure t
)
```


### Multiple Cursors {#multiple-cursors}

```emacs-lisp
(use-package multiple-cursors
  :ensure t
  :config
  (global-set-key (kbd "C-S-c C-S-c") 'mc/edit-lines)
  (global-set-key (kbd "C->") 'mc/mark-next-like-this)
  (global-set-key (kbd "C-<") 'mc/mark-previous-like-this)
  (global-set-key (kbd "C-c C-<") 'mc/mark-all-like-this)
  )

(message "Loaded MC")
```


### Undo tree {#undo-tree}

Reference: <https://github.com/alhassy/emacs.d>
This is an indispensable tool. The additional options of showing the timestamp and diff would be.

```emacs-lisp
;; Allow tree-semantics for undo operations.
(use-package undo-tree
  :diminish undo-tree-mode                      ;; Don't show an icon in the modeline
  :config
    ;; Always have it on
    (global-undo-tree-mode)

    ;; Each node in the undo tree should have a timestamp.
    (setq undo-tree-visualizer-timestamps t)

    ;; Show a diff window displaying changes between undo nodes.
;; Execute (undo-tree-visualize) then navigate along the tree to witness
;; changes being made to your file live!
)
```


### yasnippet and ivy-yasnippet {#yasnippet-and-ivy-yasnippet}

-   [ ] setup the shortcut 'H-,' as desinged in scimax default for ivy-yasnippet

<!--listend-->

```emacs-lisp
  (use-package yasnippet
    :straight t
    :config
  (yas-global-mode 1))
    (use-package ivy-yasnippet
          :bind ("M-s i" . ivy-yasnippet))
```


### swiper {#swiper}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2020-03-30 Mon 18:05] </span></span> <br />
    I had this to counsel-swiper-or-grep. However at times, the grep result would show as a binary file even though the file was clearly not binary. I have switched to using only swiper without counsel.

<!--listend-->

```emacs-lisp
(use-package swiper
  :bind
  ("C-s" . swiper)
  ("H-s" . swiper-all)
  :diminish ivy-mode
  :config
  (ivy-mode))
```


### avy {#avy}

```emacs-lisp
(use-package avy)
```


### Super and Hyper key setting {#super-and-hyper-key-setting}

```emacs-lisp
(if (system-type-is-darwin)
    (progn
      (setq mac-left-command-modifier 'super)
      (setq mac-right-option-modifier 'hyper)))
```


### Helm packages and functions {#helm-packages-and-functions}


#### Setting helm for some basic functions {#setting-helm-for-some-basic-functions}

```emacs-lisp
(use-package helm
:config
(helm-mode 1)
(require 'helm-config)

(global-set-key (kbd "M-x") 'helm-M-x)
(global-set-key (kbd "C-h f") 'helm-apropos)
(global-set-key (kbd "C-x C-f") 'helm-find-files)
(global-set-key (kbd "C-x b") 'helm-mini)
(global-set-key (kbd "C-c y") 'helm-show-kill-ring)
(global-set-key (kbd "C-x C-r") 'helm-recentf))

```


#### General settings for helm {#general-settings-for-helm}

```emacs-lisp
;; Don't have helm do window management for me
(setq helm-display-function 'pop-to-buffer)

;; optimising highlight speed of token matches
(setq helm-mp-highlight-delay 0.3)
```


#### Helm bibtex and projectile {#helm-bibtex-and-projectile}

```emacs-lisp
(straight-use-package 'helm-bibtex)

(straight-use-package 'helm-projectile)
```


#### helm-ag {#helm-ag}

```emacs-lisp
(straight-use-package 'helm-ag)
```


#### helm-org-rifle {#helm-org-rifle}

```emacs-lisp
(use-package helm-org-rifle
  :straight t
  :config
  (global-set-key (kbd "C-c C-w") #'helm-org-rifle--refile))
```


#### Helm swoop {#helm-swoop}

```emacs-lisp
(use-package helm-swoop
  :ensure t
  :bind (("M-i" . helm-swoop)
         ("M-I" . helm-swoop-back-to-last-point)
         ("C-c M-i" . helm-multi-swoop))
  :config
  ;; When doing isearch, hand the word over to helm-swoop
  (define-key isearch-mode-map (kbd "M-i") 'helm-swoop-from-isearch)
  ;; From helm-swoop to helm-multi-swoop-all
  (define-key helm-swoop-map (kbd "M-i") 'helm-multi-swoop-all-from-helm-swoop)
  ;; Save buffer when helm-multi-swoop-edit complete
  (setq helm-multi-swoop-edit-save t
        ;; If this value is t, split window inside the current window
        helm-swoop-split-with-multiple-windows t
        ;; Split direcion. 'split-window-vertically or 'split-window-horizontally
        helm-swoop-split-direction 'split-window-vertically
        ;; If nil, you can slightly boost invoke speed in exchange for text color
        helm-swoop-speed-or-color nil))
```


### ace-isearch {#ace-isearch}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2020-04-04 Sat 16:46] </span></span> <br />
    While the concept is clear, I am not yet sure how the function is
    getting activated or whether it will work as I think it might. I am
    generally more comfortable using a specific function for a specific
    purpose. THis requires further investigation.

<!--listend-->

```emacs-lisp
(use-package ace-isearch
:after helm-swoop avy
:config
(global-ace-isearch-mode +1))
```


## Email {#email}


### <span class="org-todo todo TODO">TODO</span> mu4e via use-package {#mu4e-via-use-package}

-   [ ] Transfer all the settings for mu4e into a use-package layout with hooks.

<!--listend-->

```emacs-lisp
(use-package mu4e
:straight t
:ensure nil
:hook
  ((mu4e-compose-mode . (lambda ()
                          (visual-line-mode)
                          (use-hard-newlines -1)
                          (flyspell-mode)))
   (mu4e-view-mode . (lambda() ;; try to emulate some of the eww key-bindings
                       (local-set-key (kbd "<tab>") 'shr-next-link)
                       (local-set-key (kbd "<backtab>") 'shr-previous-link)
		       (fill-paragraph)
		       (visual-line-mode)))
   (mu4e-headers-mode . (lambda ()
                          (interactive)
                          (setq mu4e-headers-fields
                                `((:human-date . 25) ;; alternatively, use :date
                                  (:flags . 6)
                                  (:from . 22)
                                  (:thread-subject . ,(- (window-body-width) 70)) ;; alternatively, use :subject
                                  (:size . 7))))))
  :config
  (require 'mu4e)
  (require 'mu4e-contrib)
  (require 'org-mu4e)

  (setq
   mail-user-agent 'mu4e-user-agent
   mue4e-headers-skip-duplicates  t
   mu4e-view-show-images t
   mu4e-view-show-addresses 't
   mu4e-compose-format-flowed t
   ;;mu4e-update-interval 200
   message-ignored-cited-headers 'nil
   mu4e-date-format "%y/%m/%d"
   mu4e-headers-date-format "%Y/%m/%d"
   mu4e-change-filenames-when-moving t
   mu4e-attachments-dir "~/Downloads/Mail-Attachments/"
   mu4e-maildir (expand-file-name "~/my_mail/fmail")
   message-citation-line-format "On %Y-%m-%d at %R %Z, %f wrote..."
   mu4e-index-lazy-check t
   ;; After Years. I've finally found you.
   mu4e-compose-dont-reply-to-self t
   mu4e-headers-auto-update t
   message-kill-buffer-on-exit t
   mu4e-update-interval 300
   )

  ;; mu4e email refiling loations
  (setq
   mu4e-refile-folder "/Archive"
   mu4e-trash-folder  "/Trash"
   mu4e-sent-folder   "/Sent"
   mu4e-drafts-folder "/Drafts")

  ;; setup some handy shortcuts
  (setq mu4e-maildir-shortcuts
	'(("/INBOX"   . ?i)
	  ("/Sent"    . ?s)
	  ("/Archive" . ?a)
	  ("/Trash"   . ?t)))

  ;;store link to message if in header view, not to header query
  (setq org-mu4e-link-query-in-headers-mode nil
	org-mu4e-convert-to-html t) ;; org -> html


  (autoload 'mu4e "mu4e" "mu for Emacs." t)

  ;; Earlier Config for sending email
  ;; (setq
  ;;  message-send-mail-function 'message-send-mail-with-sendmail
  ;;  send-mail-function 'sendmail-send-it
  ;;  message-kill-buffer-on-exit t
  ;;  )

  ;; allow for updating mail using 'U' in the main view:
  (setq mu4e-get-mail-command  "mbsync -q fins")

  ;; Stolen from https://github.com/djcb/mu/issues/1431 and found thanks to parsnip in #emacs
  (defun my-mu4e-mbsync-current-maildir (msg)
    (interactive)
    (let* ((maildir (downcase (substring (plist-get msg :maildir) 1)))
	   (mu4e-get-mail-command (format "mbsync %s" maildir)))
      (mu4e-update-mail-and-index t)))

  ;; Enabling view in browser for HTML heavy emails that don't render well
  (add-to-list 'mu4e-view-actions
	       '("ViewInBrowser" . mu4e-action-view-in-browser) t)
  (add-to-list 'mu4e-view-actions
	       '("mbsync maildir of mail at point" . my-mu4e-mbsync-current-maildir) t)

  (setq mu4e-view-use-gnus t)

  ;; Don't keep asking for confirmation for every action
  (defun my-mu4e-mark-execute-all-no-confirm ()
    "Execute all marks without confirmation."
    (interactive)
    (mu4e-mark-execute-all 'no-confirm))
  ;; mapping x to above function
  (define-key mu4e-headers-mode-map "x" #'my-mu4e-mark-execute-all-no-confirm)

  ;; source: http://matt.hackinghistory.ca/2016/11/18/sending-html-mail-with-mu4e/

  ;; this is stolen from John but it didn't work for me until I
  ;; made those changes to mu4e-compose.el
  (defun htmlize-and-send ()
    "When in an org-mu4e-compose-org-mode message, htmlize and send it."
    (interactive)
    (when
	(member 'org~mu4e-mime-switch-headers-or-body post-command-hook)
      (org-mime-htmlize)
      (org-mu4e-compose-org-mode)
      (mu4e-compose-mode)
      (message-send-and-exit)))

  ;; This overloads the amazing C-c C-c commands in org-mode with one more function
  ;; namely the htmlize-and-send, above.
  (add-hook 'org-ctrl-c-ctrl-c-hook 'htmlize-and-send t)


  ;; Config for queued sending of emails
  ;; Reference  :https://vxlabs.com/2017/02/07/mu4e-0-9-18-e-mailing-with-emacs-now-even-better/https://vxlabs.com/2017/02/07/mu4e-0-9-18-e-mailing-with-emacs-now-even-better/

  ;; when switch off queue mode, I still prefer async sending
  (use-package async
    :ensure t
    :defer nil
    :config (require 'smtpmail-async))

  (setq
   send-mail-function 'async-smtpmail-send-it
   message-send-mail-function 'async-smtpmail-send-it
   ;; replace with your email provider's settings
   smtpmail-smtp-server "smtp.fastmail.com"
   smtpmail-smtp-service 465
   smtpmail-stream-type 'ssl
   ;; if you need offline mode, set to true -- and create the queue dir
   ;; with 'mu mkdir', i.e:
   ;; mu mkdir /home/user/Mail/queue && touch ~/Maildir/queue/.noindex
   ;; https://www.djcbsoftware.nl/code/mu/mu4e/Queuing-mail.html
   smtpmail-queue-mail  nil
   smtpmail-queue-dir  (expand-file-name "~/my_mail/fmail/Queue/cur")))

```


### TEST org-msg {#test-org-msg}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2020-04-08 Wed 20:54] </span></span> <br />
    org-msg is a nice alternative to mime for sending out email that
    hopefully looks good even on outlook based browsers. In my
    correspondence, a lot of people probably use webmail or some client like
    Outlook to view their emails. There is still a lot of rough edges,
    particularly with respect to forwarding and replying to chains of
    emails. However, it still serves the purpose rather well at the moment.


#### Basic setup {#basic-setup}

```emacs-lisp
(use-package org-msg
  :ensure t
  :defer 5
  :config

  (require 'org-msg)
  (setq org-msg-options "html-postamble:nil H:5 num:nil ^:{} toc:nil"
	org-msg-startup "hidestars indent inlineimages"
	org-msg-greeting-fmt "\nHi %s,\n\n"
	org-msg-greeting-name-limit 3
	org-msg-signature "

 Regards,

 #+begin_signature
 -- \\\\
 *Shreyas Ragavan* \\\\
 E: shreyas@fastmail.com \\\\
 W: https://shreyas.ragavan.co \\\\
 M: +1 647-671-1851 \\\\
 #+end_signature")
  (org-msg-mode))
;; Attempt to solve the problem of forwarding emails especailly with attachments.
;(advice-add '(org-msg-mode) :after #'mu4e-compose-forward))
```


#### Compose CSS {#compose-css}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2020-03-25 Wed 23:33] </span></span> <br />
    For some reason, the basic CSS does not look good. Even though some customisation is done below, it does not appear the font choice is respected. In any case, the size and line height are now acceptable.

<!--listend-->

```emacs-lisp
(defconst sr/org-msg-style
  (let* ((font-family '(font-family . "\"Calibri\""))
	 (font-size '(font-size . "12pt"))
	 (font `(,font-family ,font-size))
	 (line-height '(line-height . "1.5em"))
	 (bold '(font-weight . "bold"))
	 (theme-color "#0071c5")
	 (color `(color . ,theme-color))
	 (table `(,@font (margin-top . "0px")))
	 (ftl-number `(,@font ,color ,bold (text-align . "left")))
	 (inline-modes '(asl c c++ conf cpp csv diff ditaa emacs-lisp
			     fundamental ini json makefile man org plantuml
			     python sh xml R))
	 (inline-src `((color . ,(face-foreground 'default))
		       (background-color . ,(face-background 'default))))
	 (code-src
	  (mapcar (lambda (mode)
		    `(code ,(intern (concat "src src-" (symbol-name mode)))
			   ,inline-src))
		  inline-modes)))
  `((del nil (,@font (color . "grey") (border-left . "none")
	      (text-decoration . "line-through") (margin-bottom . "0px")
	      (margin-top . "10px") (line-height . "11pt")))
    (a nil (,color))
    (a reply-header ((color . "black") (text-decoration . "none")))
    (div reply-header ((padding . "3.0pt 0in 0in 0in")
		       (border-top . "solid #e1e1e1 1.0pt")
		       (margin-bottom . "20px")))
    (span underline ((text-decoration . "underline")))
    (li nil (,@font ,line-height (margin-bottom . "0px")
	     (margin-top . "2px")))
    (nil org-ul ((list-style-type . "square")))
    (nil org-ol (,@font ,line-height (margin-bottom . "0px")
		 (margin-top . "0px") (margin-left . "30px")
		 (padding-top . "0px") (padding-left . "5px")))
    (nil signature (,@font (margin-bottom . "20px")))
    (blockquote nil ((padding-left . "5px") (margin-left . "10px")
		     (margin-top . "20px") (margin-bottom . "0")
		     (border-left . "3px solid #ccc") (font-style . "italic")
		     (background . "#f9f9f9")))
    (code nil (,font-size (font-family . "monospace") (background . "#f9f9f9")))
    ,@code-src
    (nil linenr ((padding-right . "1em")
		 (color . "black")
		 (background-color . "#aaaaaa")))
    (pre nil ((line-height . "12pt")
	      ,@inline-src
	      (margin . "0px")
	      (font-size . "9pt")
	      (font-family . "monospace")))
    (div org-src-container ((margin-top . "10px")))
    (nil figure-number ,ftl-number)
    (nil table-number)
    (caption nil ((text-align . "left")
		  (background . ,theme-color)
		  (color . "white")
		  ,bold))
    (nil t-above ((caption-side . "top")))
    (nil t-bottom ((caption-side . "bottom")))
    (nil listing-number ,ftl-number)
    (nil figure ,ftl-number)
    (nil org-src-name ,ftl-number)

    (table nil (,@table ,line-height (border-collapse . "collapse")))
    (th nil ((border . "1px solid white")
	     (background-color . ,theme-color)
	     (color . "white")
	     (padding-left . "10px") (padding-right . "10px")))
    (td nil (,@table (padding-left . "10px") (padding-right . "10px")
		     (background-color . "#f9f9f9") (border . "1px solid white")))
    (td org-left ((text-align . "left")))
    (td org-right ((text-align . "right")))
    (td org-center ((text-align . "center")))

    (div outline-text-4 ((margin-left . "15px")))
    (div outline-4 ((margin-left . "10px")))
    (h4 nil ((margin-bottom . "0px") (font-size . "11pt")
	     ,font-family))
    (h3 nil ((margin-bottom . "0px") (text-decoration . "underline")
	     ,color (font-size . "12pt")
	     ,font-family))
    (h2 nil ((margin-top . "20px") (margin-bottom . "20px")
	     (font-style . "italic") ,color (font-size . "13pt")
	     ,font-family))
    (h1 nil ((margin-top . "20px")
	     (margin-bottom . "0px") ,color (font-size . "12pt")
	     ,font-family))
    (p nil ((text-decoration . "none") (margin-bottom . "0px")
	    (margin-top . "10px") (line-height . "11pt") ,font-size
	    ,font-family (max-width . "100ch")))
    (div nil (,@font (line-height . "11pt"))))))
```


#### Set the css to the above custom function {#set-the-css-to-the-above-custom-function}

```emacs-lisp
(setq org-msg-enforce-css 'sr/org-msg-style)
```


## Programming customisations {#programming-customisations}


### emmet-mode {#emmet-mode}

```emacs-lisp
(use-package emmet-mode
:straight t
:config

;; Auto-start on any markup modes
(add-hook 'sgml-mode-hook 'emmet-mode)
;; enable Emmet's css abbreviation.
(add-hook 'css-mode-hook  'emmet-mode)
;; enable HTML
(add-hook 'html-mode-hook  'emmet-mode)
;; Enable cursor to be placed within quotes
(setq emmet-move-cursor-between-quotes t))

```


### ESS configuration {#ess-configuration}

```emacs-lisp
(use-package ess
  :ensure t
  :config
  (require 'ess)
  (show-paren-mode)
  (use-package ess-R-data-view)
  (use-package polymode)
  (setq ess-describe-at-point-method nil)
  (setq ess-switch-to-end-of-proc-buffer t)
  (setq ess-rutils-keys +1)
  (setq ess-eval-visibly 'nil)
  (setq ess-use-flymake "lintr::default_linters()")
   (setq ess-use-company t)
  (setq ess-history-file "~/.Rhistory")
  (setq ess-use-ido t)
  (setq ess-roxy-hide-show-p t)
  ;;(speedbar-add-supported-extension ".R")
  (setq comint-scroll-to-bottom-on-input t)
  (setq comint-scroll-to-bottom-on-output t)
  (setq comint-move-point-for-output t)

;;setting up eldoc
(setq ess-use-eldoc t)
(setq ess-eldoc-show-on-symbol t)
(setq ess-doc-abbreviation-style 'aggresive)
  )

;; The following chunk is taken from: https://github.com/syl20bnr/spacemacs/blob/master/layers/%2Blang/ess/packages.el
;;; Follow Hadley Wickham's R style guide
(setq ess-first-continued-statement-offset 2
      ess-continued-statement-offset 4
      ess-expression-offset 4
      ess-nuke-trailing-whitespace-p t
      ess-default-style 'DEFAULT)


;; Adding Poly-R package

(use-package poly-R
  :ensure t
  )
;; The following chunk is taken from antonio's answer from https://stackoverflow.com/questions/16172345/how-can-i-use-emacs-ess-mode-with-r-markdown
(defun rmd-mode ()
  "ESS Markdown mode for rmd files."
  (interactive)
  (require 'poly-R)
  (require 'poly-markdown)
  (poly-markdown+r-mode))

(use-package ess-view
  :ensure t
  :config
  (require 'ess-view)
  (if (system-type-is-darwin)
      (setq ess-view--spreadsheet-program
            "/Applications/Tad.app/Contents/MacOS/Tad"
            )
    )
  (if (system-type-is-gnu)
      (setq ess-view--spreadsheet-program
            "tad"
            )
    )
  )

;; This is taken and slightly modified from the ESS manual
;; The display config is similar to that of Rstudio

(setq display-buffer-alist
      `(("*R Dired"
         (display-buffer-reuse-window display-buffer-in-side-window)
         (side . right)
         (slot . -1)
         (window-width . 0.33)
         (reusable-frames . nil))
        ("*R"
         (display-buffer-reuse-window display-buffer-at-bottom)
         (window-width . 0.35)
         (reusable-frames . nil))
        ("*Help"
         (display-buffer-reuse-window display-buffer-in-side-window)
         (side . right)
         (slot . 1)
         (window-width . 0.33)
         (reusable-frames . nil))))

(message "Loaded ESS configuration")
```


### lispy {#lispy}

```emacs-lisp
;; Superior lisp editing
(use-package lispy
  :config
  (dolist (hook '(emacs-lisp-mode-hook
		  hy-mode-hook))
    (add-hook hook
	      (lambda ()
		(lispy-mode)
		(eldoc-mode)))))
```


### flycheck {#flycheck}

```emacs-lisp
(straight-use-package 'flycheck)
```


### <span class="org-todo todo TODO">TODO</span> Python <code>[0/2]</code> {#python}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2020-03-23 Mon 18:10] </span></span> <br />
    For now I will disable this as it appears logical to use pyenv and other packages to set the correct interpreter. However, since shims are being used, one would assume that the correct environment will be used anyway.

At the moment, [Scimax packages](.emacs.d::init.org::#MY Scimax packages) require pydoc, elpy and jedi, which are already installed. These packages have to be grouped here.

[Emacs: The Best Python Editor? Real Python](https://realpython.com/emacs-the-best-python-editor/) is a good guide towards setting up Emacs and python. [Managing a Python development environment in Emacs - Analytics Vidhya - Medium](https://medium.com/analytics-vidhya/managing-a-python-development-environment-in-emacs-43897fd48c6a) provides a satisfyingly detailed configuration with customisations for python. The latter guide is worth following.

```emacs-lisp
;; Enabling python 3 to be the default interpreter.
(setq python-shell-interpreter "python3")
(setq org-babel-python-command "python3")
(setq flycheck-python-pycompile-executable "python3")

;; Enabling flycheck for elpy mode

(when (require 'flycheck nil t)
  (setq elpy-modules (delq 'elpy-module-flymake elpy-modules))
  (add-hook 'elpy-mode-hook 'flycheck-mode))

```

-   [ ] pyment
-   [ ] isort
-   [ ] pyenv version alias and activating on a per buffer basis
-   [ ] pyvenv
-   [ ] pydoc
-   [ ] elpy
-   [ ] blacken


#### EIN notebooks {#ein-notebooks}

-   [ ] enable visual line mode?
-   [ ] Enable pictures by default
-   [ ] possible for better latex rendering?

<!--listend-->

```emacs-lisp
(use-package ein
:defer t
:ensure t
:config
(package-initialize)
(require 'ein)
(require 'ein-notebook)
(require 'ein-subpackages)
)
```


#### emacs-lsp {#emacs-lsp}

```emacs-lisp
(use-package lsp-python-ms
  :ensure t
  :hook (python-mode . (lambda ()
                          (require 'lsp-python-ms)
                          (lsp))))  ; or lsp-deferred
```


#### pyvenv, pydoc and elpy {#pyvenv-pydoc-and-elpy}

```emacs-lisp
(straight-use-package 'pyvenv)
(straight-use-package 'pydoc)

(use-package elpy
  :straight t
  :config
  (elpy-enable))
```


#### Blacken {#blacken}

The black library will re-format the code on a save. Elpy will automatically use black, as long as the elisp package installed, along with the python black package which can be installed using pip

```sh
pip3 install black
```

```emacs-lisp
(use-package blacken
:straight t
:hook (python-mode . blacken-mode))
```


## <span class="org-todo todo TODO">TODO</span> Custom search functions <code>[0/1]</code> {#custom-search-functions}

This section contains sections to search in specific directories, with customised options.

-   [ ] Incorporate these functions into a hydra.
    -   [ ] Explore ldlework's hera and nougat hydra packages for this. Perhaps include into scimax under the applications menu.


### Episteme search {#episteme-search}

Adapted from ldlework

```emacs-lisp
(defun episteme-search ()
  (interactive)
  (helm-do-ag (sr/fun/project-dir "episteme/brain"))
  (let* ((p (point))
         (f (org-brain-first-headline-position))
         (adjusted-point (max 0 (- p f))))
    (org-brain-visualize (file-name-sans-extension (buffer-name)))
    (with-current-buffer "*org-brain*"
      (let ((minmax (polybrain--get-point-min-max)))
        (goto-char (+ (car minmax) adjusted-point))))))(require 'f)
```


### Projects search <code>[0/6]</code> {#projects-search}

-   [ ] Exclude git files
-   [ ] Exclude csv files
-   [ ] Exclude html and related files
-   [ ] decide between helm-ag and counsel-ag and the method to jump between files.
-   [ ] Decide about plugging in arguments to activate different kinds of search.
-   [ ] Find if multiple paths can be included or not.

<!--listend-->

```emacs-lisp
(defun sr/fun/proj-search ()
  (interactive)
  (helm-do-ag (sr/fun/project-dir "")))
```


### Org files search {#org-files-search}

```emacs-lisp
(defun sr/fun/org-search ()
  (interactive)
  (helm-do-ag (sr/fun/org-dir "")))
```


## <span class="org-todo todo TODO">TODO</span> Hydra Hera and nougat {#hydra-hera-and-nougat}

This hydra setup is based off hera and nougat, which are packages
available in [ldlework's init.el](https://dustinlacewell.github.io/emacs.d/). I've adapted, modified and expanded his
setup. These cool packages make defining hydras a little easier,
especially in a stack.


### hera {#hera}

ldlework's package that provides an API for defining a stack of hydras.

```emacs-lisp
(use-package hera
:demand t
:straight (hera :type git :host github :repo "dustinlacewell/hera"))
```


### nougat-hydra {#nougat-hydra}

```emacs-lisp
(defun nougat--inject-hint (symbol hint)
(-let* ((name (symbol-name symbol))
(hint-symbol (intern (format "%s/hint" name)))
(format-form (eval hint-symbol))
(string-cdr (nthcdr 1 format-form))
(format-string (string-trim (car string-cdr)))
(amended-string (format "%s\n\n%s" format-string hint)))
(setcar string-cdr amended-string)))

(defun nougat--make-head-hint (head default-color)
(-let (((key _ hint . rest) head))
(when key
(-let* (((&plist :color color) rest)
(color (or color default-color))
(face (intern (format "hydra-face-%s" color)))
(propertized-key (propertize key 'face face)))
(format " [%s]: %s" propertized-key hint)))))

(defun nougat--make-hint (heads default-color)
(string-join
(cl-loop for head in heads
for hint = (nougat--make-head-hint head default-color)
do (pp hint)
collect hint) "\n"))

(defun nougat--clear-hint (head)
(-let* (((key form _ . rest) head))
`(,key ,form nil ,@rest)))

(defun nougat--add-exit-head (heads)
(let ((exit-head '("SPC" (hera-pop) "to exit" :color blue)))
(append heads `(,exit-head))))

(defun nougat--add-heads (columns extra-heads)
(let* ((cell (nthcdr 1 columns))
(heads (car cell))
(extra-heads (mapcar 'nougat--clear-hint extra-heads)))
(setcar cell (append heads extra-heads))))

(defmacro nougat-hydra (name body columns &optional extra-heads)
(declare (indent defun))
(-let* (((&plist :color default-color :major-mode mode) body)
(extra-heads (nougat--add-exit-head extra-heads))
(extra-hint (nougat--make-hint extra-heads default-color))
(body (plist-put body :hint nil))
(body-name (format "%s/body" (symbol-name name)))
(body-symbol (intern body-name))
(mode-support
`(when ',mode
(setq major-mode-hydra--body-cache
(a-assoc major-mode-hydra--body-cache ',mode ',body-symbol)))))
(nougat--add-heads columns extra-heads)
(when mode
(remf body :major-mode))
`(progn
(pretty-hydra-define ,name ,body ,columns)
(nougat--inject-hint ',name ,extra-hint)
,mode-support)))

;; (nougat-hydra hydra-test (:color red :major-mode fundamental-mode)
;; ("First"
;; (("a" (message "first - a") "msg a" :color blue)
;; ("b" (message "first - b") "msg b"))
;; "Second"
;; (("c" (message "second - c") "msg c" :color blue)
;; ("d" (message "second - d") "msg d"))))
```


### hydra-dwim {#hydra-dwim}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2020-04-04 Sat 17:17] </span></span> <br />
    I still need to integrate these hydras with scimax hydras and figure out
    a good key for the exit.

<!--listend-->

```emacs-lisp
(defun my/hydra-dwim ()
(interactive)
(-let (((&alist major-mode mode) major-mode-hydra--body-cache))
(if mode (major-mode-hydra)
(hera-start 'hydra-default/body))))

(setq kbd-hera-pop "Q")
(global-set-key (kbd "M-s p") 'my/hydra-dwim)
(global-set-key (kbd "M-s p") (lambda () (interactive) (hera-start 'hydra-default/body)))

```


### hydra-default {#hydra-default}

```emacs-lisp
(defhydra hydra-default (:color blue :hint nil)
"

Entrypoint Hydra

"
("a" (org-agenda nil "a") "agenda" :column "Open")
;; ("p" (hera-push 'hydra-projectile/body) "projectile")
("c" (org-capture) "capture")
("t" (hera-push 'hydra-treemacs/body))
("b" (hera-push 'hydra-bookmarks/body) "bookmarks")
("h" (hera-push 'hydra-help/body) "help" :column "Emacs")
("m" (hera-push 'hydra-mu4e/body) "mail")
("w" (hera-push 'hydra-window/body) "windows")
("z" (hera-push 'hydra-zoom/body) "zoom")
("R" (hera-push 'hydra-registers/body) "registers")
("n" (hera-push 'hydra-notes/body) "notes" :column "Misc")
("S" (hera-push 'hydra-straight/body) "Straight")
("s" (call-interactively 'helm-imenu) "semantic")
("g" (hera-push 'hydra-gist/body) "gist")
("p" (hera-push 'hydra-pyvenv/body) "pyvenv" :column "python"))

```


### hydra-straight {#hydra-straight}

```emacs-lisp
(defun sr/fun/straight-pull-rebuild-combo (&optional package)
  "Function to select a package, and then -> pull and rebuild using straight."
  (interactive)
  (let ((package (or package
                     (straight--select-package "Pull & Rebuild package" 'for-build 'installed))))
    (message package)
    (straight-pull-package package)
    (straight-rebuild-package package)))


(nougat-hydra hydra-straight (:color red)
  ("Straight" (("P" (call-interactively 'straight-pull-package)
		"Pull one")
	       ("p" (call-interactively 'sr/fun/straight-pull-rebuild-combo)
		"Pull and Rebuild one package" :column "Pull")
	       ("C-a" (straight-pull-all) "Pull ALL")
	       ("f" (call-interactively 'straight-fetch-package)
		"Fetch one")
	       ("F" (straight-fetch-all) "Fetch ALL")
	       ("w" (call-interactively 'straight-visit-package-website) "visit package Website")
	       ("g" (call-interactively 'straight-get-recipe)
		"Get recipe")
	     ("r" (call-interactively 'straight-rebuild-package)
		"rebuild package")
	       )))
```


### hydra-mu4e {#hydra-mu4e}

```emacs-lisp
(nougat-hydra hydra-mu4e (:color blue)
("mu4e" (("m" (mu4e) "mail")
	     ("u" (mu4e-update-mail-and-index) "Update mail and index"))))
```


### hydra-pyvenv {#hydra-pyvenv}

```emacs-lisp
(nougat-hydra hydra-pyvenv (:color red)
  ("pyvenv - virtualenv" (("c" (call-interactively 'pyvenv-create)
		"create")
	       ("w" (call-interactively 'pyvenv-workon) "work on")
	       ("a" (call-interactively 'pyvenv-activate)	"activate")
	       ("d" (call-interactively 'pyvenv-deactivate) "deactivate")
	       ("t" (call-interactively 'pyvenv-tracking-mode) "tracking mode")
	       ("r" (call-interactively 'pyvenv-restart-python) "restart python")
	       )))
```


### hydra-window {#hydra-window}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2020-04-08 Wed 12:34] </span></span> <br />
    For some reason, ace commands for windows ask for a 2nd number even with
    only 2 windows in the frame. This may be because the buffer is open in
    another frame as well. THis has to be fixed.

<!--listend-->

```emacs-lisp
(use-package ace-window)
(winner-mode 1)

(nougat-hydra hydra-window (:color red)
("Jump"
(("h" windmove-left "left")
("l" windmove-right "right")
("k" windmove-up "up")
("j" windmove-down "down")
("a" ace-select-window "ace")
("s" ace-swap-window "ace-swap"))
"Split"
(("q" split-window-right "left")
("r" (progn (split-window-right) (call-interactively 'other-window)) "right")
("e" split-window-below "up")
("w" (progn (split-window-below) (call-interactively 'other-window)) "down"))
"Do"
(("d" delete-window "delete")
("o" delete-other-windows "delete others")
("u" winner-undo "undo")
("R" winner-redo "redo")
("t" nougat-hydra-toggle-window "toggle"))))
```

Toggle window split

```emacs-lisp
(defun my/toggle-window-split (&optional arg)
"Switch between 2 windows split horizontally or vertically.
With ARG, swap them instead."
(interactive "P")
(unless (= (count-windows) 2)
(user-error "Not two windows"))
;; Swap two windows
(if arg
(let ((this-win-buffer (window-buffer))
(next-win-buffer (window-buffer (next-window))))
(set-window-buffer (selected-window) next-win-buffer)
(set-window-buffer (next-window) this-win-buffer))
;; Swap between horizontal and vertical splits
(let* ((this-win-buffer (window-buffer))
(next-win-buffer (window-buffer (next-window)))
(this-win-edges (window-edges (selected-window)))
(next-win-edges (window-edges (next-window)))
(this-win-2nd (not (and (<= (car this-win-edges)
(car next-win-edges))
(<= (cadr this-win-edges)
(cadr next-win-edges)))))
(splitter
(if (= (car this-win-edges)
(car (window-edges (next-window))))
'split-window-horizontally
'split-window-vertically)))
(delete-other-windows)
(let ((first-win (selected-window)))
(funcall splitter)
(if this-win-2nd (other-window 1))
(set-window-buffer (selected-window) this-win-buffer)
(set-window-buffer (next-window) next-win-buffer)
(select-window first-win)
(if this-win-2nd (other-window 1))))))
```


### hydra-treemacs {#hydra-treemacs}

```emacs-lisp
(nougat-hydra hydra-treemacs (:color red)
("Workspace"
(("t" treemacs "Treemacs buffer")
("o" treemacs-switch-workspace "open")
("n" treemacs-create-workspace "new")
("k" treemacs-delete-workspace "kill")
("r" treemacs-rename-workspace "rename"))))
```


## Pastes {#pastes}


### Webpaste {#webpaste}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2020-03-29 Sun 11:18] </span></span> <br />
    This package is useful to use multiple paste services with a fallback. dpaste has a pleasant format and therefore chosen as the first priority. The advantage of using github gists is that org mode exports can be directly rendered. This package can also be configured to use a custom paste service.

<!--listend-->

```emacs-lisp
(use-package webpaste
  :ensure t
  :config
  (progn
    (setq webpaste-provider-priority '("dpaste.org" "ix.io"))))
```


### github gists {#github-gists}

Gists posted right from emacs.

```emacs-lisp
(use-package gist
:straight (gist :type git :host github :repo "defunkt/gist.el"))


(nougat-hydra hydra-gist (:color blue)
("Gist" (("p" (gist-region-or-buffer) "public")
("P" (gist-region-or-buffer-private) "private")
("b" (browse-url "https://gist.github.com/shrysr") "browse"))))
```


## <span class="org-todo todo TODO">TODO</span> org-id {#org-id}

Using the org-id for reference to headings ensures that even if the
heading changes, the links will still work.

In addition, I would like an org id to be created every time the capture
is used. This facilitates using packages like org-brain which rely
extensively on org-id's.

```emacs-lisp
  (require 'org-id)
  ;; (setq org-id-link-to-org-use-id t)
(setq org-id-link-to-org-use-id 'create-if-interactive-and-no-custom-id)
  ;; (org-link-set-parameters "id" :store nil)
  ;; (org-link-set-parameters "nb" :store nil)
  (org-link-set-parameters 'nil)
  ;; (org-link-set-parameters "nb" :store nil)
  ;; ;; Update ID file .org-id-locations on startup
  ;; ;; This adds too much time to startup
  ;; ;; (org-id-update-id-locations)

  (setq org-id-method (quote uuidgen))
  (setq org-id-track-globally t)
  (setq org-id-locations-file "~/my_org/emacs_meta/.org-id-locations")
  ;; (add-hook 'org-capture-prepare-finalize-hook 'org-id-get-create)
```


## eww {#eww}


#### Default browser to be eww and basic settings {#default-browser-to-be-eww-and-basic-settings}

```emacs-lisp
(setq browse-url-browser-function 'eww-browse-url)
```


#### Keyboard map for default external browser {#keyboard-map-for-default-external-browser}

```emacs-lisp
;; Open the current URL in the default external browser
(eval-after-load 'eww
  '(progn
     (define-key eww-mode-map "o" 'eww-browse-with-external-browser)
     ))
```


#### Wikipedia search {#wikipedia-search}

```emacs-lisp
(defun wikipedia-search (search-term)
  "Search for SEARCH-TERM on wikipedia"
  (interactive
   (let ((term (if mark-active
                   (buffer-substring (region-beginning) (region-end))
                 (word-at-point))))
     (list
      (read-string
       (format "Wikipedia (%s):" term) nil nil term)))
   )
  (browse-url
   (concat
    "http://en.m.wikipedia.org/w/index.php?search="
    search-term
    ))
  )
```


#### Access Hacker News {#access-hacker-news}

```emacs-lisp
(defun hn ()
  (interactive)
  (browse-url "http://news.ycombinator.com"))
```


#### <span class="org-todo todo TODO">TODO</span> Open specific browser depending on the URL {#open-specific-browser-depending-on-the-url}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2019-03-07 Thu 11:59] </span></span> <br />
    This is worth setting up. It would be convenient for frequently visited websites like reddit and others, to open in the external browser, especially as they do not render well within w3m.

Source : <http://ergoemacs.org/emacs/emacs%5Fset%5Fdefault%5Fbrowser.Html>

```emacs-lisp
;; use browser depending on url

(setq
 browse-url-browser-function
 '(
  ("wikipedia\\.org" . eww-browse-url)
  ("github" . eww-browse-url)
  ("thefreedictionary\\.com" . eww-browse-url)
 ("mode\\.com" . browse-url-default-macosx-browser)
  ("." . browse-url-default-browser)
  ))
```


## New Scimax port {#new-scimax-port}


### org-ref {#org-ref}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2020-03-11 Wed 23:18] </span></span> <br />
    Apparently, the scimax org-ref module required the gitter package. This is strange because it is pulled in as a git submodule. However, the issue was resolved  when org-ref was pulled in from it's own repo.

<!--listend-->

```emacs-lisp
  (use-package org-ref
    :straight (org-ref :host github :repo "jkitchin/org-ref")
:config
(require 'doi-utils)
(require 'org-ref-wos)
(require 'org-ref-pubmed)
(require 'org-ref-arxiv)
(require 'org-ref-bibtex)
(require 'org-ref-pdf)
(require 'org-ref-url-utils)
(require 'org-ref-helm)
(require 'org-ref-isbn)

(setq org-ref-completion-library 'org-ref-ivy-cite)
;; note and bib location

(setq org-ref-bibliography-notes "~/my_org/references/references.org"
      org-ref-bibliography-notes "~/my_org/references/research_notes.org"
      org-ref-default-bibliography '("~/my_org/references/references.bib")
      org-ref-pdf-directory "~/my_org/references/pdfs/")

;; setting up helm-bibtex
(setq helm-bibtex-bibliography "~/my_org/references/references.bib"
      helm-bibtex-library-path "~/my_org/org/references/pdfs"
      helm-bibtex-notes-path "~/my_org/references/research_notes.org")

(setq bibtex-autokey-year-length 4
	bibtex-autokey-name-year-separator "-"
	bibtex-autokey-year-title-separator "-"
	bibtex-autokey-titleword-separator "-"
	bibtex-autokey-titlewords 2
	bibtex-autokey-titlewords-stretch 1
	bibtex-autokey-titleword-length 5
	org-ref-bibtex-hydra-key-binding (kbd "H-b")))
```


### scimax-org port {#scimax-org-port}


#### General Org mode related {#general-org-mode-related}

```emacs-lisp
(require 'org-inlinetask)
(require 'org-mouse)

;; Make editing invisible regions smart
(setq org-catch-invisible-edits 'smart)

;; allow lists with letters in them.
(setq org-list-allow-alphabetical t)

(setq org-src-tab-acts-natively t)

(setq org-use-speed-commands t)

(add-to-list 'org-speed-commands-user (cons "P" 'org-set-property))
(add-to-list 'org-speed-commands-user (cons "d" 'org-deadline))

;; Mark a subtree
(add-to-list 'org-speed-commands-user (cons "m" 'org-mark-subtree))

;; Widen
(add-to-list 'org-speed-commands-user (cons "S" 'widen))

;; kill a subtree
(add-to-list 'org-speed-commands-user (cons "k" (lambda ()
						  (org-mark-subtree)
						  (kill-region
						   (region-beginning)
						   (region-end)))))

;; Jump to headline
(add-to-list 'org-speed-commands-user
	     (cons "q" (lambda ()
			 (avy-with avy-goto-line
			   (avy--generic-jump "^\\*+" nil avy-style)))))

```


#### Babel settings {#babel-settings}

```emacs-lisp
;; * Babel settings
;; enable prompt-free code running
(setq org-confirm-babel-evaluate nil
      org-confirm-elisp-link-function nil
      org-confirm-shell-link-function nil)

;; register languages in org-mode
(org-babel-do-load-languages
 'org-babel-load-languages
 '((emacs-lisp . t)
   (latex . t)
   (python . t)
   (shell . t)
   (matlab . nil)
   (sqlite . t)
   (ruby . nil)
   (perl . t)
   (org . t)
   (dot . t)
   (plantuml . t)
   (R . t)
   (fortran . nil)
   (C . t)))

;; no extra indentation in the source blocks
(setq org-src-preserve-indentation t)

;; use syntax highlighting in org-file code blocks
(setq org-src-fontify-natively t)

(setq org-babel-default-header-args:python
      '((:results . "output replace")
	(:session . "none")
	(:exports . "both")
	(:cache .   "no")
	(:noweb . "no")
	(:hlines . "no")
	(:tangle . "no")
	(:eval . "never-export")))

(setq org-startup-with-inline-images "inlineimages")

;; default with images open
(setq org-startup-with-inline-images "inlineimages")

;; default width
(setq org-image-actual-width nil)
;; redisplay figures when you run a block so they are always current.
(add-hook 'org-babel-after-execute-hook
	  'org-display-inline-images)

;; This automatically aligns tables, which is nice if you use code to generate
;; tables.
(defun scimax-align-result-table ()
  "Align tables in the subtree."
  (save-restriction
    (save-excursion
      (unless (org-before-first-heading-p) (org-narrow-to-subtree))
      (org-element-map (org-element-parse-buffer) 'table
	(lambda (tbl)
	  (goto-char (org-element-property :post-affiliated tbl))
	  (org-table-align))))))

(add-hook 'org-babel-after-execute-hook
	  'scimax-align-result-table)
```


#### Org formatting functions {#org-formatting-functions}

```emacs-lisp
;; * Markup commands for org-mode


(defun org-markup-region-or-point (type beginning-marker end-marker)
  "Apply the markup TYPE with BEGINNING-MARKER and END-MARKER to region, word or point.
This is a generic function used to apply markups. It is mostly
the same for the markups, but there are some special cases for
subscripts and superscripts."
  (cond
   ;; We have an active region we want to apply
   ((region-active-p)
    (let* ((bounds (list (region-beginning) (region-end)))
	   (start (apply 'min bounds))
	   (end (apply 'max bounds))
	   (lines))
      (unless (memq type '(subscript superscript))
	(save-excursion
	  (goto-char start)
	  (unless (looking-at " \\|\\<")
	    (backward-word)
	    (setq start (point)))
	  (goto-char end)
	  (unless (or (looking-at " \\|\\>")
		      (looking-back "\\>" 1))
	    (forward-word)
	    (setq end (point)))))
      (setq lines
	    (s-join "\n" (mapcar
			  (lambda (s)
			    (if (not (string= (s-trim s) ""))
				(concat beginning-marker
					(s-trim s)
					end-marker)
			      s))
			  (split-string
			   (buffer-substring start end) "\n"))))
      (setf (buffer-substring start end) lines)
      (forward-char (length lines))))
   ;; We are on a word with no region selected
   ((thing-at-point 'word)
    (cond
     ;; beginning of a word
     ((looking-back " " 1)
      (insert beginning-marker)
      (re-search-forward "\\>")
      (insert end-marker))
     ;; end of a word
     ((looking-back "\\>" 1)
      (insert (concat beginning-marker end-marker))
      (backward-char (length end-marker)))
     ;; not at start or end so we just sub/sup the character at point
     ((memq type '(subscript superscript))
      (insert beginning-marker)
      (forward-char (- (length beginning-marker) 1))
      (insert end-marker))
     ;; somewhere else in a word and handled sub/sup. mark up the
     ;; whole word.
     (t
      (re-search-backward "\\<")
      (insert beginning-marker)
      (re-search-forward "\\>")
      (insert end-marker))))
   ;; not at a word or region insert markers and put point between
   ;; them.
   (t
    (insert (concat beginning-marker end-marker))
    (backward-char (length end-marker)))))


(defun org-italics-region-or-point ()
  "Italicize the region, word or character at point.
This function tries to do what you mean:
1. If you select a region, markup the region.
2. If in a word, markup the word.
3. Otherwise wrap the character at point in the markup."
  (interactive)
  (org-markup-region-or-point 'italics "/" "/"))


(defun org-bold-region-or-point ()
  "Bold the region, word or character at point.
This function tries to do what you mean:
1. If you select a region, markup the region.
2. If in a word, markup the word.
3. Otherwise wrap the character at point in the markup."
  (interactive)
  (org-markup-region-or-point 'bold "*" "*"))


(defun org-underline-region-or-point ()
  "Underline the region, word or character at point.
This function tries to do what you mean:
1. If you select a region, markup the region.
2. If in a word, markup the word.
3. Otherwise wrap the character at point in the markup."
  (interactive)
  (org-markup-region-or-point 'underline "_" "_"))


(defun org-code-region-or-point ()
  "Mark the region, word or character at point as code.
This function tries to do what you mean:
1. If you select a region, markup the region.
2. If in a word, markup the word.
3. Otherwise wrap the character at point in the markup."
  (interactive)
  (org-markup-region-or-point 'underline "~" "~"))


(defun org-verbatim-region-or-point ()
  "Mark the region, word or character at point as verbatim.
This function tries to do what you mean:
1. If you select a region, markup the region.
2. If in a word, markup the word.
3. Otherwise wrap the character at point in the markup."
  (interactive)
  (org-markup-region-or-point 'underline "=" "="))


(defun org-strikethrough-region-or-point ()
  "Mark the region, word or character at point as strikethrough.
This function tries to do what you mean:
1. If you select a region, markup the region.
2. If in a word, markup the word.
3. Otherwise wrap the character at point in the markup."
  (interactive)
  (org-markup-region-or-point 'strikethrough "+" "+"))


(defun org-subscript-region-or-point ()
  "Mark the region, word or character at point as a subscript.
This function tries to do what you mean:
1. If you select a region, markup the region.
2. If in a word, markup the word.
3. Otherwise wrap the character at point in the markup."
  (interactive)
  (org-markup-region-or-point 'subscript "_{" "}"))


(defun org-superscript-region-or-point ()
  "Mark the region, word or character at point as superscript.
This function tries to do what you mean:
1. If you select a region, markup the region.
2. If in a word, markup the word.
3. Otherwise wrap the character at point in the markup."
  (interactive)
  (org-markup-region-or-point 'superscript "^{" "}"))

```


#### Links and Jumping functions {#links-and-jumping-functions}

```emacs-lisp
;; * New org links

(if (fboundp 'org-link-set-parameters)
    (org-link-set-parameters
     "pydoc"
     :follow (lambda (path)
	       (pydoc path))
     :export (lambda (path desc format)
	       "Generate a url"
	       (let (url)
		 (setq url (cond
			    ((s-starts-with? "scipy" path)
			     (format
			      "https://docs.scipy.org/doc/scipy/reference/generated/%s.html"
			      path))
			    ((s-starts-with? "numpy" path)
			     (format
			      "https://docs.scipy.org/doc/numpy/reference/generated/%s.html"
			      path))
			    (t
			     (format
			      "https://www.google.com/#safe=off&q=%s"
			      path))))


		 (cond
		  ((eq format 'md)
		   (format "[%s](%s)" (or desc path) url))))))
  (org-add-link-type
   "pydoc"
   (lambda (path)
     (pydoc path))))

(if (fboundp 'org-link-set-parameters)
    (org-link-set-parameters
     "attachfile"
     :follow (lambda (link-string) (org-open-file link-string))
     :export (lambda (keyword desc format)
	       (cond
		((eq format 'html) (format ""))	; no output for html
		((eq format 'latex)
		 ;; write out the latex command
		 (format "\\attachfile{%s}" keyword)))))

  (org-add-link-type
   "attachfile"
   (lambda (link-string) (org-open-file link-string))
   ;; formatting
   (lambda (keyword desc format)
     (cond
      ((eq format 'html) (format ""))	; no output for html
      ((eq format 'latex)
       ;; write out the latex command
       (format "\\attachfile{%s}" keyword))))))

(if (fboundp 'org-link-set-parameters)
    (org-link-set-parameters
     "altmetric"
     :follow (lambda (doi)
	       (browse-url (format  "http://dx.doi.org/%s" doi)))
     :export (lambda (keyword desc format)
	       (cond
		((eq format 'html)
		 (format "<script type='text/javascript' src='https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js'></script>
<div data-badge-type='medium-donut' class='altmetric-embed' data-badge-details='right' data-doi='%s'></div>" keyword))
		((eq format 'latex)
		 ""))))

  (org-add-link-type
   "altmetric"
   (lambda (doi)
     (browse-url (format  "http://dx.doi.org/%s" doi)))
   (lambda (keyword desc format)
     (cond
      ((eq format 'html)
       (format "<script type='text/javascript' src='https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js'></script>
<div data-badge-type='medium-donut' class='altmetric-embed' data-badge-details='right' data-doi='%s'></div>" keyword))
      ((eq format 'latex)
       "")))))


(defun org-man-store-link ()
  "Store a link to a man page."
  (when (memq major-mode '(Man-mode woman-mode))
    (let* ((page (save-excursion
		   (goto-char (point-min))
		   (re-search-forward " ")
		   (buffer-substring (point-min) (point))))
	   (link (concat "man:" page))
	   (description (format "Manpage for %s" page)))
      (org-store-link-props
       :type "man"
       :link link
       :description description))))

(if (fboundp 'org-link-set-parameters)
    (org-link-set-parameters
     "man"
     :follow (lambda (path)
	       (man path))
     :store 'org-man-store-link))


;; * ivy navigation
(defun ivy-org-jump-to-visible-headline ()
  "Jump to visible headline in the buffer."
  (interactive)
  (org-mark-ring-push)
  (avy-with avy-goto-line (avy--generic-jump "^\\*+" nil avy-style)))


(defun ivy-jump-to-visible-sentence ()
  "Jump to visible sentence in the buffer."
  (interactive)
  (org-mark-ring-push)
  (avy-with avy-goto-line (avy--generic-jump (sentence-end) nil avy-style))
  (forward-sentence))


(defun ivy-org-jump-to-heading ()
  "Jump to heading in the current buffer."
  (interactive)
  (let ((headlines '()))
    (save-excursion
      (goto-char (point-min))
      (while (re-search-forward
	      ;; this matches org headings in elisp too.
	      "^\\(;; \\)?\\(\\*+\\)\\(?: +\\(.*?\\)\\)?[ 	]*$"  nil t)
	(cl-pushnew (list
		     (format "%-80s"
			     (match-string 0))
		     (cons 'position (match-beginning 0)))
		    headlines)))
    (ivy-read "Headline: "
	      (reverse headlines)
	      :action (lambda (candidate)
			(org-mark-ring-push)
			(goto-char (cdr (assoc 'position candidate)))
			(outline-show-entry)))))


(defun ivy-org-jump-to-agenda-heading ()
  "Jump to a heading in an agenda file."
  (interactive)
  (let ((headlines '()))
    ;; these files should be open already since they are agenda files.
    (loop for file in (org-agenda-files) do
	  (with-current-buffer (find-file-noselect file)
	    (save-excursion
	      (goto-char (point-min))
	      (while (re-search-forward org-heading-regexp nil t)
		(cl-pushnew (list
			     (format "%-80s (%s)"
				     (match-string 0)
				     (file-name-nondirectory file))
			     :file file
			     :position (match-beginning 0))
			    headlines)))))
    (ivy-read "Headline: "
	      (reverse headlines)
	      :action (lambda (candidate)
			(org-mark-ring-push)
			(find-file (plist-get (cdr candidate) :file))
			(goto-char (plist-get (cdr candidate) :position))
			(outline-show-entry)))))


(defun ivy-org-jump-to-heading-in-files (files &optional fontify)
  "Jump to org heading in FILES.
Optional FONTIFY colors the headlines. It might slow things down
a lot with large numbers of org-files or long org-files. This
function does not open the files."
  (let ((headlines '()))
    (loop for file in files do
	  (when (file-exists-p file)
	    (with-temp-buffer
	      (insert-file-contents file)
	      (when fontify
		(org-mode)
		(font-lock-fontify-buffer))
	      (goto-char (point-min))
	      (while (re-search-forward org-heading-regexp nil t)
		(cl-pushnew (list
			     (format "%-80s (%s)"
				     (match-string 0)
				     (file-name-nondirectory file))
			     :file file
			     :position (match-beginning 0))
			    headlines)))))
    (ivy-read "Headline: "
	      (reverse headlines)
	      :action (lambda (candidate)
			(org-mark-ring-push)
			(find-file (plist-get (cdr candidate) :file))
			(goto-char (plist-get (cdr candidate) :position))
			(outline-show-entry)))))


(defun ivy-org-jump-to-heading-in-directory (&optional recursive)
  "Jump to heading in an org file in the current directory.
Use a prefix arg to make it RECURSIVE.
Use a double prefix to make it recursive and fontified."
  (interactive "P")
  (let ((fontify nil))
    (when (equal recursive '(16))
      (setq fontify t))
    (ivy-org-jump-to-heading-in-files
     (f-entries "."
		(lambda (f)
		  (and
		   (f-ext? f "org")
		   (not (s-contains? "#" f))))
		recursive)
     fontify)))


(defun ivy-org-jump-to-project-headline (&optional fontify)
  "Jump to a headline in an org-file in the current project.
The project is defined by projectile. Use a prefix arg FONTIFY
for colored headlines."
  (interactive "P")
  (ivy-org-jump-to-heading-in-files
   (mapcar
    (lambda (f) (expand-file-name f (projectile-project-root)))
    (-filter (lambda (f)
	       (and
		(f-ext? f "org")
		(not (s-contains? "#" f))))
	     (projectile-current-project-files)))
   fontify))


(defun ivy-org-jump-to-open-headline (&optional fontify)
  "Jump to a headline in an open org-file.
Use a prefix arg FONTIFY for colored headlines."
  (interactive "P")
  (ivy-org-jump-to-heading-in-files
   (mapcar 'buffer-file-name
	   (-filter (lambda (b)
		      (-when-let (f (buffer-file-name b))
			(f-ext? f "org")))
		    (buffer-list)))
   fontify))


(defun ivy-org-jump-to-recent-headline (&optional fontify)
  "Jump to a headline in an org-file in `recentf-list'."
  (interactive)
  (ivy-org-jump-to-heading-in-files
   (-filter (lambda (f) (f-ext? f "org")) recentf-list)
   fontify))


(defcustom scimax-ivy-jump-functions
  '((heading . ivy-org-jump-to-heading)
    (visible . ivy-org-jump-to-visible-headline)
    (sentence . ivy-jump-to-visible-sentence)
    (recent-org ivy-org-jump-to-recent-headline)
    (directory . ivy-org-jump-to-heading-in-directory)
    (project . ivy-org-jump-to-project-headline )
    (agenda ivy-org-jump-to-agenda-heading))
  "alist of jump functions. The first one is the default.")


(defun ivy-org-jump (&optional arg)
  "Jump to a location in org file. The default is the first entry
in `scimax-ivy-jump-functions'. With a prefix arg, you can choose
the scope."
  (interactive "P")
  (let ((jumpfn (if arg (cdr (assoc (intern-soft (ivy-read "Scope: " scimax-ivy-jump-functions)) scimax-ivy-jump-functions))
		  ;; the default choice.
		  (cdr (car scimax-ivy-jump-functions)))))
    (funcall jumpfn)))

```


#### Better return {#better-return}

```emacs-lisp
;; * A better return

(defun scimax/org-return (&optional ignore)
  "Add new list item, heading or table row with RET.
A double return on an empty element deletes it.
Use a prefix arg to get regular RET. "
  (interactive "P")
  (if ignore
      (org-return)
    (cond

     ((eq 'line-break (car (org-element-context)))
      (org-return-indent))

     ;; Open links like usual, unless point is at the end of a line.
     ;; and if at beginning of line, just press enter.
     ((or (and (eq 'link (car (org-element-context))) (not (eolp)))
	  (bolp))
      (org-return))

     ;; It doesn't make sense to add headings in inline tasks. Thanks Anders
     ;; Johansson!
     ((org-inlinetask-in-task-p)
      (org-return))

     ;; checkboxes - add new or delete empty
     ((org-at-item-checkbox-p)
      (cond
       ;; at the end of a line.
       ((and (eolp)
	     (not (eq 'item (car (org-element-context)))))
	(org-insert-todo-heading nil))
       ;; no content, delete
       ((and (eolp) (eq 'item (car (org-element-context))))
	(setf (buffer-substring (line-beginning-position) (point)) ""))
       ((eq 'paragraph (car (org-element-context)))
	(goto-char (org-element-property :end (org-element-context)))
	(org-insert-todo-heading nil))
       (t
	(org-return))))

     ;; lists end with two blank lines, so we need to make sure we are also not
     ;; at the beginning of a line to avoid a loop where a new entry gets
     ;; created with only one blank line.
     ((org-in-item-p)
      (cond
       ;; empty definition list
       ((and (looking-at " ::")
	     (looking-back "- " 3))
	(beginning-of-line)
	(delete-region (line-beginning-position) (line-end-position)))
       ;; empty item
       ((and (looking-at "$")
	     (looking-back "- " 3))
	(beginning-of-line)
	(delete-region (line-beginning-position) (line-end-position)))
       ;; numbered list
       ((and (looking-at "$")
	     (looking-back "[0-9]+. " (line-beginning-position)))
	(beginning-of-line)
	(delete-region (line-beginning-position) (line-end-position)))
       ;; insert new item
       (t
	(end-of-line)
	(org-insert-item))))

     ;; org-heading
     ((org-at-heading-p)
      (if (not (string= "" (org-element-property :title (org-element-context))))
	  (progn
	    ;; Go to end of subtree suggested by Pablo GG on Disqus post.
	    (org-end-of-subtree)
	    (org-insert-heading-respect-content)
	    (outline-show-entry))
	;; The heading was empty, so we delete it
	(beginning-of-line)
	(setf (buffer-substring
	       (line-beginning-position) (line-end-position)) "")))

     ;; tables
     ((org-at-table-p)
      (if (-any?
	   (lambda (x) (not (string= "" x)))
	   (nth
	    (- (org-table-current-dline) 1)
	    (remove 'hline (org-table-to-lisp))))
	  (org-return)
	;; empty row
	(beginning-of-line)
	(setf (buffer-substring
	       (line-beginning-position) (line-end-position)) "")
	(org-return)))

     ;; fall-through case
     (t
      (org-return)))))


(defcustom scimax-return-dwim t
  "When t redefine the Ret behavior to add items, headings and table rows."
  :group 'scimax)


(when scimax-return-dwim
  (define-key org-mode-map (kbd "RET")
    'scimax/org-return))

```


#### <span class="org-todo todo TODO">TODO</span> Numbered headings and overlays {#numbered-headings-and-overlays}


#### <span class="org-todo todo TODO">TODO</span> PDF and EPS images in org mode {#pdf-and-eps-images-in-org-mode}


### scimax-ivy {#scimax-ivy}

```emacs-lisp
  (use-package scimax-ivy
    :straight (scimax-ivy :local-repo "scimax-subset" :files ("scimax-ivy.el")))
(require 'scimax-ivy)
```


### scimax-apps {#scimax-apps}

```emacs-lisp
  (use-package scimax-apps
    :after scimax-org
    :straight (scimax-apps :local-repo "scimax-subset" :files ("scimax-apps.el")))
(require 'scimax-apps)
```


### <span class="org-todo todo TODO">TODO</span> scimax-hydra {#scimax-hydra}

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2020-03-24 Tue 10:38] </span></span> <br />
    For some reason, the scimax-hydra package will not byte compile.

<!--listend-->

```emacs-lisp
(load-file (concat (sr/fun/emacs-dir "straight/repos/scimax-subset/scimax-hydras.el")))

;; (use-package scimax-hydra
;;   :straight (scimax-hydra :local-repo "scimax-subset" :files ("scimax-hydras.el"))
;;   :bind ("<f12>" . scimax/body))
;; (require 'scimax-hydras)
```


### scimax-notebook {#scimax-notebook}

```emacs-lisp

(use-package scimax-notebook
  :straight (scimax-notebook :local-repo "scimax-subset" :files ("scimax-notebook.el"))
  :bind ("M-s n" . 'nb-hydra/body)
  :config
(setq nb-notebook-directory "~/my_projects/"))
;; (global-set-key (kbd "M-s n") 'nb-hydra/body))
(require 'scimax-notebook)
```


### scimax-journal {#scimax-journal}

```emacs-lisp
(use-package scimax-journal
  :init (setq scimax-journal-root-dir "~/my_org/journal/")
  :bind ("H-j" . scimax-journal/body)
  :straight (scimax-journal :local-repo "scimax-subset" :files ("scimax-journal.el")))
(require 'scimax-journal)
```


### scimax-ipython {#scimax-ipython}

-   [X] use the file keyword to add the client.py file as a symlink. Note here that the entire list of files have to be provided.

<!--listend-->

```emacs-lisp
    (use-package ob-ipython
      :straight (ob-ipython :host github :repo "gregsexton/ob-ipython" :files ("client.py" "ob-ipython.el"))
      :config
      (require 'ob-ipython))

  ;;; * Applying John's customisations and monkeypatches
  ;;; These are related to ipython kernel management
  ;;; * These  are related mostly to org-babel customisations
    (use-package scimax-ob
      :straight (scimax-ob :local-repo "scimax-subset" :files ("scimax-ob.el")))

    (use-package scimax-org-babel-ipython-upstream
          :straight (scimax-org-babel-ipython-upstream  :local-repo "scimax-subset" :files ("scimax-org-babel-ipython-upstream.el")))


```

scimax-ipython upstream

```emacs-lisp
(require 'scimax-org-babel-ipython-upstream)
(require 'scimax-ob)
```


## Aesthetics {#aesthetics}


### Setting custom themes to be safe {#setting-custom-themes-to-be-safe}

```emacs-lisp
(setq custom-safe-themes t)
```


### Theme : modus {#theme-modus}


#### modus operandi {#modus-operandi}

```emacs-lisp
(straight-use-package 'modus-operandi-theme)

(use-package modus-operandi-theme
:straight t
:config
(setq modus-operandi-theme-scale-headings t)
(setq modus-operandi-theme-proportional-fonts t)
(setq modus-operandi-theme-slanted-constructs t)
(setq modus-operandi-theme-visible-fringes t)
(setq modus-operandi-theme-distinct-org-blocks t)
(load-theme 'modus-operandi t))

;; These are placed here for ready reference
;; (setq modus-operandi-theme-scale-1 1.05)
;; (setq modus-operandi-theme-scale-2 1.1)
;; (setq modus-operandi-theme-scale-3 1.15)
;; (setq modus-operandi-theme-scale-4 1.2)

```


### Font and other aesthetics {#font-and-other-aesthetics}


#### Fixed pitch and variable pitch fonts {#fixed-pitch-and-variable-pitch-fonts}

```emacs-lisp
(custom-theme-set-faces
 'user
 '(variable-pitch ((t (:family "iA Writer Mono V"))))
 '(fixed-pitch ((t ( :family "Iosevka term"
			     :slant normal
			     :weight normal
			     :height 1.1
			     :width normal)))))

;; Setting the default general font
(set-face-attribute 'default nil
		    :family "iA Writer Mono V"
		    :height 130
		    )

```


#### Faces for specific org elements {#faces-for-specific-org-elements}

```emacs-lisp
(custom-theme-set-faces
 'user
 '(org-block ((t (:inherit fixed-pitch))))
 '(org-code ((t (:inherit (shadow variable-pitch)))))
 '(org-document-info ((t (:foreground "dark orange"))))
 '(org-document-info-keyword ((t (:inherit (shadow fixed-pitch)))))
 '(org-indent ((t (:inherit (org-hide variable-pitch)))))
 '(org-link ((t (:foreground "royal blue" :underline t))))
 '(org-meta-line ((t (:inherit (font-lock-comment-face -pitch)))))
 '(org-property-value ((t (:inherit fixed-pitch))) t)
 '(org-special-keyword ((t (:inherit (font-lock-comment-face fixed-pitch)))))
 '(org-table ((t (:inherit fixed-pitch :foreground "#83a598"))))
 '(org-tag ((t (:inherit (shadow fixed-pitch) :weight bold :height 0.8))))
 '(org-verbatim ((t (:inherit (shadow variable-pitch))))))

```


### Fill column and auto fill {#fill-column-and-auto-fill}

```emacs-lisp
(setq-default fill-column 72)
(global-visual-line-mode 1)
(add-hook 'text-mode-hook 'auto-fill-mode)
```


### <span class="org-todo todo TODO">TODO</span> Spaceline : modeline configuration {#spaceline-modeline-configuration}

-   [X] [Get that spacemacs look without spacemacs | Pragmatic Emacs](http://pragmaticemacs.com/emacs/get-that-spacemacs-look-without-spacemacs/) - this provides a bare bones setup
-   [ ] [Amit's Thoughts: Emacs spaceline mode line](http://amitp.blogspot.com/2017/01/emacs-spaceline-mode-line.html) : This is an excellent guide covering a lot of possibilities to customise so many aspects of the modeline and make it look great.
-   [ ] It seems that spaceline adds a few extra seconds to the init time. I wonder if there are lighter packages that achieve the same effect.

<!--listend-->

```emacs-lisp
(use-package spaceline
  :straight t
  :init
  (setq powerline-default-separator 'arrow-fade)
  :config
  (disable-theme 'smart-mode-line-light)
  (require 'spaceline-config)
  (spaceline-spacemacs-theme)
  (spaceline-toggle-buffer-position-off)
  (spaceline-toggle-hud-off)
  (setq spaceline-python-pyvenv-on 1)
  (spaceline-toggle-minor-modes-off))
```


### Striking out Done headlines {#striking-out-done-headlines}

source: Sacha Chua

```emacs-lisp
(setq org-fontify-done-headline t)
(custom-set-faces
 '(org-done ((t (:foreground "DarkGreen"
			     :weight normal
			     :strike-through t))))
 '(org-headline-done
   ((((class color) (min-colors 16) (background dark))
     (:foreground "LightSalmon" :strike-through t)))))
```


### keywords as boxes with inverted colors {#keywords-as-boxes-with-inverted-colors}

Source : SO [link](https://stackoverflow.com/questions/12707492/add-custom-markers-to-emacs-org-mode) ,

```emacs-lisp
(set-face-attribute 'org-todo nil
                    :box '(:line-width 2
                           :color "black"
                           :style released-button)
                    :inverse-video t
                    )
(set-face-attribute 'org-done nil
                    :box '(:line-width 2
                           :color "black"
                           :style released-button)
                    :inverse-video t
                    )
(set-face-attribute 'org-priority nil
                    :inherit font-lock-keyword-face
                    :inverse-video t
                    :box '(:line-width 2
                           :color "black"
                           :style released-button)
                    )
```


### Remove the bars and startup messages {#remove-the-bars-and-startup-messages}

```emacs-lisp
;; Removing all the bars
(menu-bar-mode -1)
(tool-bar-mode -1)
(scroll-bar-mode -1)

;; No start up message and nothing to pollute the scratch buffer
(setq inhibit-startup-message t initial-scratch-message nil)
```


## Loading secret config {#loading-secret-config}

```emacs-lisp
;; Loading secret config containing personal information
(org-babel-load-file (sr/fun/emacs-dir "sr-secrets.org.gpg"))
```
