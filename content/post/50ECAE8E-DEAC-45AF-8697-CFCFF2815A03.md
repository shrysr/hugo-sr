+++
title = "Oddmuse-curl exploration"
author = ["Shreyas Ragavan"]
date = 2020-01-20T09:11:00-08:00
tags = ["oddmuse", "wiki", "blog"]
categories = ["Emacs"]
draft = false
profile = false
+++

[oddmuse-curl](https://www.google.com/url?q=https://github.com/kensanata/oddmuse-curl/) is kensanata's tool to use Emacs to edit oddmuse wikis. I think it works rather well for my needs. Alternatively, I can also use the org exporter to export org mode content and manually copy this into a wiki page via the web browser. CLI options also exist to update the wiki, but I don't think I need that functionality.

Borrowing off the documentation of oddmuse-curl, I was able to set this up, with some additional settings. It always helps to read the source code, and I'm finding of late that elisp code often seem to have a detailed explanation, comments and etc that make the code a pleasure to read.

One always hears - keep the code well commented, and to use caution in describing the idea rather than the syntax. However, it is not often to find such examples. It is probably also worth noting that most of them also seem to prefer to not have their readme's tangling the source code. The .el files are probably edited directly in Emacs. This is not surprising because the lispy mode (and etc) provide very good support for writing lisp in Emacs.

So to begin with : Clone kensanata's package from github to the desired location:

```sh
git clone https://github.com/kensanata/oddmuse-curl.git ~/scimax/user/external_packages/
```

Next here is my config. There are some additional options that kensanata's readme does not mention, however all these options can be found by reading the source code.

```emacs-lisp
(use-package oddmuse-curl
:load-path "~/scimax-personal/external_packages/oddmuse-curl/"
:defer nil
:ensure t
:config
;; user name
(setq oddmuse-username "shrysr")

;; Wiki names
(setq oddmuse-wikis
      '(("EmacsWiki" "https://www.emacswiki.org/emacs" utf-8 "abcd" nil)
	("sr" "https://shrysr.ragavan.co" utf-8 nil nil)))

;; Directory where files will be downloaded from the wiki for editing.
(setq oddmuse-directory "~/my_org/01_wiki/oddmuse/")

;; adding an oddmuse-odd for files in the fiki directory
(add-to-list 'auto-mode-alist '("~/my_org/01_wiki/oddmuse" . oddmuse-mode))

;; autoload modes
(autoload 'oddmuse-edit "oddmuse-curl"
  "Edit a page on an Oddmuse wiki." t)

;; Not yet sure what this does and how it related to version control.
(add-to-list 'vc-handled-backends 'oddmuse)
(defun vc-oddmuse-registered (file)
  "Handle files in `oddmuse-directory'."
  (string-match (concat "^" (expand-file-name oddmuse-directory))
                (file-name-directory file)))

;; Since I work primarily with org before the wiki - I would rather note have the mode initialised.
;; (oddmuse-mode-initialize)

;; I would like to be able to call the wiki when desired and so the curl package is initialised.
(require 'oddmuse-curl)
)


```

All I have to do is use `M-x` `oddmuse-go` to select the wiki I want and then start editing the page required. In the beginning it is a little intimidating to consider that a page has to be selected. However the search option can be easily used for anything relevant. It might also make sense to place useful links within a single page like the page which can be visited as a bookmark.
