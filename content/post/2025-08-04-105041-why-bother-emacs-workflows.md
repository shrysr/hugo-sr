+++
title = "Why bother with Emacs and workflows?"
author = ["Shreyas Ragavan"]
date = 2019-01-25T14:57:00-08:00
tags = ["EmacsStuff", "CodeJournal", "CareerJournal", "ProductivityJournal"]
draft = false
profile = false
+++

-   Note taken on <span class="timestamp-wrapper"><span class="timestamp">[2023-08-07 Mon 01:27]</span></span> <br />
    published to oddmuse. This requires a link the dev.to article as well.

I've written [several posts](https://shrysr.github.io/tags/emacs/) on different ways and tools available to aid productivity, and probably a lot about Emacs. My background is in computational physics, and not in programming, and yet Emacs has been an indispensable driver of my daily workflow for the past 3 years.

The fact is that knowing Emacs (or Vim), or having a custom configuration is [not a wildly marketable skill](https://www.reddit.com/r/emacs/comments/9ghpb4/was_anyone_ever_impressed_by_your_emacs_skills/), nor is it mandatory to achieve spectacular results. An Emacs configuration suits personal workflows and style, which may be borderline peculiar to another person. Such a dependence on customised tools would also drastically reduces your speed while using a new IDE or text editor.

So : why add Emacs to the ever-growing to-do list? The question is more pertinent considering that mastery of a 'text editor' is not something you can freely talk about and frequently expect empathetic responses or even a spark like connection. Emacs would be considered by many to be an esoteric and archaic software with a steep learning curve that is not beginner friendly.

However .....

[This article](https://blog.fugue.co/2015-11-11-guide-to-emacs.html) elucidates many points where Emacs can help PHB's (Pointy Haired Boss). The internet abounds with [several](https://news.ycombinator.com/item?id=11386590) [examples](https://news.ycombinator.com/item?id=6094610) on how org-mode and Emacs have changed lives for the better. Here is another [cool article by Howard Abrams](http://www.howardism.org/Technical/Emacs/new-window-manager.html) on using Emacs as his (only) window manager, in place of a desktop environment.

Watching an experienced person handle his tools emphasises the potential art form behind it, especially when compared to the bumbling of an amateur. Yes, the amateur may get the job done given enough time, and depending on his capabilities - even match the experienced professional's output (eventually).

However, as experience is gained, the workflows and steps to achieve an optimal result become more lucid. I've experienced an exponentially increasing and compelling need to implement specific preferences to achieve the required optimized results faster and with fewer mistakes.

It is therefore obvious that the workflow and tools used must allow the provision to evolve, customise and automate. This is particularly true with respect to the world of data science and programming. I don't think there is anything better than Emacs with respect to customisation.

Imagine the following:

-   having a combination of scripts or snippets in different languages to jumpstart a project, which is available with a few keypresses? (Yasnippet)[^fn:1]
-   Maintaining a blog with a single document, with articles updated automatically on a status change. (ox-hugo)
-   working with multiple R environments in a single document. (Org-babel, ESS)[^fn:2]
-   Different Window configurations and processes for different projects that can be called with a few keypresses (hint : keyboard macros)
-   An integrated git porcelain that can actually help you learn git so much faster (magit)
-   Intimately integrating email with tasks, projects, documentation and workflows (mu4e, Org-mode)
-   A customised text editor available right in your terminal (Use Emacsclient launched off a daemon within a terminal)
-   Not requiring to use the mouse for navigation![^fn:3]

Now : imagine the consolidated effect of having all the above at your disposal, in a reasonably streamlined state. Then, considering the cumulative effect over multiple projects! The above is just a shallow overview of the possibilities with Emacs.

Investing in learning Emacs, has the serious potential to spawn exponential results in the long run.

[^fn:1]: Articles on using Yasnippet: --- [Using Emacs Yasnippet against repetitive boileplate code](http://blog.refu.co/?p=1355) || [Tweaking Emacs Yasnippet](https://jpace.wordpress.com/2012/10/20/tweaking-emacs-snippets/) || [Expanding snippets](https://joaotavora.github.io/yasnippet/snippet-expansion.html)
[^fn:2]: Links to using R with Emacs: [Using R with Emacs and ESS](https://www.r-bloggers.com/using-r-with-emacs-and-ess/) || [Using R with
    Emacs](https://lucidmanager.org/using-r-with-emacs/) || [Tips from R Coders who use ESS](https://www.reddit.com/r/emacs/comments/8gr6jt/looking_for_tips_from_r_coders_who_use_ess/) || [Why I use Emacs for R programming](https://thescientificshrimper.wordpress.com/2018/12/12/soapbox-rant-why-i-use-emacs-for-r-programming/)
[^fn:3]: See this [article of a non-technical user's experiment](http://rss.slashdot.org/~r/Slashdot/slashdot/~3/7iykh9HdS5U/i-stopped-using-a-computer-mouse-for-a-week-and-it-was-amazing) with not using the
    mouse, reporting significant gains in speed and productivity. I've experienced
    this myself after gaining basic proficiency in moving around Emacs.
