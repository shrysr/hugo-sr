+++
title = "Notes - What they forgot to teach you about R"
author = ["Shreyas Ragavan"]
date = 2020-01-20T09:08:00-08:00
tags = ["R"]
categories = ["DataScience"]
draft = false
profile = false
+++

The [book](https://rstats.wtf/), 'What they forgot to teach you about R' being co-authored by
<https://twitter.com/JennyBryan%20@JennyBryan> is not finished at the time
of this post, however I was still compelled to go through the existing
material as it was an engaging read.

These are some notes captured from the book. Verbatim quotes from the
book are encapsulated. My notes and observations are added in plain
text.

> I recommend you cultivate a workflow in which you treat R processes (a.k.a. “sessions”) like livestock. Any individual R process and the associated workspace is disposable.

The general recommendation is not to rely on Rdata or RDS objects to load the environment each time the code has to be resumed. Every important object or source code relevant to the project should be amenable to being built from source whenever required.

> All important objects or figures should be explicitly saved to file, in a granular way. This is in contrast to storing them implicitly or explicitly, as part of an entire workspace, or saving them via the mouse.

Happily enough the mouse is strict no-no for people for Emacs + ESS nerds, which is mentioned as a popular IDE choice (yay!).

> Sometimes people resist advice because it’s hard to incorporate into their current workflow and dismiss it as something “for experts only”. But this gets the direction of causality backwards: long-time and professional coders don’t do these things because they use an IDE. They use an IDE because it makes it so much easier to follow best practices.

This is an interesting quote talking about the developer driving the process using tools like an IDE.

> Restart R often during development - timeless troubleshooting wisdom

Indeed. This has solved problems many times for many people, including myself. Somehow I fancy that using ESS is actually more stable than using Rstudio because I do not seem to face the problem of needing to restart R often at all.

> The problem with `rm(list = ls())` is that, given the intent, it does not go far enough. All it does is delete user-created objects from the global workspace.

Several reasons and provided supporting further scenarios including the problems caused by using the above approach which should be avoided. Removing a user made object does not remove the underlying libraries and other meta objects that R has created in the background.

> The solution is to write every script assuming it will be run in a fresh R process. The best way to do that is … develop scripts in a fresh R process!

Note: Use object storage for the objects that take a long time to develop. Have the controlling R script to use a new process each time it is run. This is good to note because my controlling document is usually the Org mode based Readme, and it is usually easy to re-run bunched of source blocks as described/recommended.

-   [ ] Article on project oriented workflow [link](https://www.tidyverse.org/blog/2017/12/workflow-vs-script/)
-   [ ] Mention is made of Drake. I need to restart my earlier efforts in mastering Drake.
-   [ ] The book will be updated with an example of an API. This should be checked down the line.

Bookmark:  This article covers upto Section 1.8 as of today <span class="timestamp-wrapper"><span class="timestamp">[2020-01-19 Sun]</span></span>.
