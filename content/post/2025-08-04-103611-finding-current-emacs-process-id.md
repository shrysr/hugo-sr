+++
title = "Finding your current emacs process id"
author = ["Shreyas Ragavan"]
date = 2020-01-19T17:59:00-08:00
tags = ["CodeJournal", "EmacsStuff"]
draft = false
+++

I had two Emacs GUI's open today, one from a daemon and one from a process and I wanted to know which one belonged to which! The simple solution is

```emacs-lisp
(emacs-pid)
```

This gives you the current Emacs process ID. Then identify the process in top. I like `helm-top`.
