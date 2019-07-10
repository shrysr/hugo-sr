+++
title = "Using ESS for Data Science"
author = ["Shreyas Ragavan"]
date = 2019-03-15T11:43:00-06:00
lastmod = 2019-07-10T13:54:12-06:00
tags = ["Emacs", "ESS", "R", "Data-Science"]
categories = ["Emacs", "Data-Science", "R"]
draft = false
weight = 2001
linktitle = "ESS & Data Science"
toc = "True"
[menu.docs]
  weight = 2001
  identifier = "using-ess-for-data-science"
+++

RStudio is a formidable IDE to work with and offers an environment to seamlessly work with multiple languages beyond R. It is especially convenient for tasks involving frequent visualisation of data frames and plots, and for use with Shiny app development.

However, the text (i.e code) editing capabalities are still significantly lacking compared to the likes of Emacs and Vim. Besides this, it does not offer a seamless interface integrating task, time management and multi-language programming environments to the extent available within Org-mode via Emacs. Enter ESS !

This is an evolving document of how I use ESS  and will be a useful guide to anybody starting out with ESS especially for R based workflows. My ESS configuration is mostly available in my Dotemacs documentation. However this is a deeper dive into ESS workflows for data science projects.

> Emacs Speaks Statistics (ESS) is an add-on package for GNU Emacs. It is designed to support editing of scripts and interaction with various statistical analysis programs such as R, S-Plus, SAS, Stata and OpenBUGS/JAGS. Although all users of these statistical analysis programs are welcome to apply ESS, advanced users or professionals who regularly work with text-based statistical analysis scripts, with various statistical languages/programs, or with different operating systems might benefit from it the most.
>
> The rationale for developing ESS is that most statistical analysis systems provide a more or less sophisticated graphical user interface (GUI). However, their full power is only available using their scripting language. Furthermore, complex statistical analysis projects require a high degree of automation and documentation which can only be handled by creating statistical analysis scripts. Unfortunately, many statistics packages provide only weak text editor functionality and show major differences between them. Without a unified text editor user interface additional effort is required from the user to cope with limited functionality and with text editor differences.
>
> [ESS website](https://ess.r-project.org/)

[Different versions of the ESS manual](https://ess.r-project.org/index.php?Section=documentation&subSection=manuals) are available online and it is worth a frequent read to aid familiarisation with the commands and features available. The ESS mailing list is also worth subscribing to.


## Resources {#resources}

While it seems that ESS is reasonably popular, it was surprising to find relatively few examples of configurations on the web. The [Emacs ESS wikipage](https://www.emacswiki.org/emacs/EmacsSpeaksStatistics) and [Yi Tang's Emacs configuration](https://emacs.readthedocs.io/en/latest/ess%5F%5Femacs%5Fspeaks%5Fstatistics.html) are among the few useful resources I've been able to find.


## Starting a new project {#starting-a-new-project}

Typically, I start with a fresh Org-mode document for a new project in a repository of its own. This is as easy as `M-x nb-new` in Scimax. This initialises a new git repository in the designated projects folder. Currently, I have each such project as a submodule of the main project repo.

It may seem convenient to include libraries and a variety of other customisations in the .Rrofile startup. However, as mentioned in the initial comments of this [SO Discussion](https://stackoverflow.com/questions/1189759/expert-r-users-whats-in-your-rprofile), in the interest of reproducibility - it is better to have a script run commands at the beginning of each session. Alternately, one could use a package like YASnippet to insert snippets of frequently used code.


## Org documents for literate programming {#org-documents-for-literate-programming}

Being a fan of literate programming, my code is usually embedded into Org-babel source blocks in line with the explanations or analysis.

For longer projects, I often define a Yasnippet extension for the source code blocks specifying a unique session name to cater to that project. This prevents mixing up of variables and environments between projects as I switch, and I can search and insert snippets with the handy `ivy-yasnippet` package that allows previews of snippets before insertion.

Typically, I enter the major mode from the Org-Babel source block (`C-c '` inside a source block) to enable access to mode specific features like command completion, variable access and so on.

> It is worth noting that when entering a major mode from a source block, the correct or desired ESS process has to be attached, especially if you are simultaneously using multiple sessions. This can be done with the `C-c C-s` command after entering the major mode buffer.


## Frequently used ESS commands {#frequently-used-ess-commands}

Though there are many commands available - the ones listed below are worth noting. Going through the ESS manual is definitely worth the effort to understand detailed descriptions of these commands. Another simple way to search for commands within ESS is using the `M-x` command and type in 'ess' to view the commands available.

1.  `M-p`, `M-n` : Previous and next command in comint input history.
2.  `M-r`      : Regex search of input history
3.  `C-c C-x`  : List of objects in the environment. Prepend `C-u` to print to console. Note that it is possible to list commands of libraries by prepending numbers to `C-c C-x`. The default prefix is the global environment, which is a prefix of 1, i.e `C-1 C-c C-x`.
4.  `C-c C-v`  : Help at point.
5.  `C-c C-q`  : Ess-quit. This is important to use when exiting an R session. Using this makes sure that temporary buffers are quit. Such buffers can pile up very easily as you use the help documentation.
6.  `C-c C-z`  : Switch between the R script and the process buffer. This is a nifty feature especially when when using
7.  `C-M-x`    : Sends the current selected region or function or paragraph.
8.  `C-c C-d v`: (ess-display-vignettes) this is a handy method to browse all the available vignettes. This opens up a buffer, which contains links to vignettes in multiple formats (PDF, Rmd, Rnw). Note that the vignettes of a newsly installed package is loaded only after being loaded with the library function.
9.  `C-e w` : Resizing the display to adapt to a buffer that has changed dimension. i.e if I split the R terminal buffer which changes it's size - this command will enable the output to be better adjusted to the buffer size and thus enable better readability.


## Window configuration {#window-configuration}

The ESS manual has a helpful snippet if you prefer your window arrangement similar to Rstudio's, which is quite sensible as such. The width values can be modified as required.

```emacs-lisp
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
```


## Rmarkdown : Polymode {#rmarkdown-polymode}

Polymode makes it easy to work with Rmd, Rnw, Snw format documents within Emacs. The only configuration necessary for this Is

```emacs-lisp
(require 'poly-markdown)
(require 'poly-R)

;; MARKDOWN
(add-to-list 'auto-mode-alist '("\\.md" . poly-markdown-mode))

;; R modes
(add-to-list 'auto-mode-alist '("\\.Snw" . poly-noweb+r-mode))
(add-to-list 'auto-mode-alist '("\\.Rnw" . poly-noweb+r-mode))
(add-to-list 'auto-mode-alist '("\\.Rmd" . poly-markdown+r-mode))

```


## <span class="org-todo todo TODO">TODO</span> Exporting {#exporting}

When sharing documents, it is necessary to convert to a format non-Emacs users can user. My current approach is to use `ox-ipynb` package to export to as a jupyter notebook, and then the excellent jupytext package to convert to Rmd.
