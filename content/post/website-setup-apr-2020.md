+++
title = "How this website is (currently) deployed"
author = ["Shreyas Ragavan"]
lastmod = 2020-04-09T10:29:11-07:00
tags = ["hugo", "wordpress", "website", "emacs", "orgmode"]
categories = ["General"]
draft = true
+++

This website is based off Hugo. The entire source is available as a Git
repo at shrysr/sr-hugo.

The website is hosted on a Linode VPS running Debian. Since I started
off with a self-hosted Wordpress setup, I have a LAMP stack set
up.

> While a LAMP stack is not necessary for running a static hugo website,
> it is still useful for other purposes like hosting multiple wikis or
> blogs and websites or apps on the same server. Nginx is an alternative
> to the 'A' (in LAMP) for Apache. In case of using Nginx, the general
> acronym is replaced by an E (as in LEMP). It is also not really
> necessary to have the 'P' (PHP) or M (MySQL) setup if one is not using
> Wordpress (or other applications that need these) for a Hugo site. Both
> Linode and Digital Ocean have nice tutorials that take you through the
> setup step by step.

The idea here is that the website development (including generating
content) and testing the website will take place locally and the VPS is
only meant to serve the website. i.e direct development of the website
on the server will be avoided unless necessary. In a way this mimics
production environments, though there are better technical ways to do
so.  For example, using git branches, or adding additional steps in
between like a fetch and a compare and a final test. This is being
eschewed at the moment, since I will test the website locally before
deploying changes.


## Summary of the steps: {#summary-of-the-steps}

1.  Clone the website repo to the machine I am working on. This is
    usually a local machine.
2.  Implement the desired changes while testing that the website works
    using the `hugo serve` command in the root of the hugo site
    directory.
3.  Once satisfied, the changes are consolidated in useful commits and
    pushed to the github repo. It makes no difference whether the repo is
    on github or any other git system.
4.  A cron job is setup on the VPS, as _root_ to pull in the git changes
    and deploy the website to the location set up with the Apache configuration.
    1.  The reason a root job is required is that the directory exposed to
        the internet is root controlled.
    2.  The git pull using _root_ has to be specified as to be run under
        the specified user unless one is willing to install necessary SSH
        keys for the root as well.
    3.  The cron job actually calls a script every 10 minutes, because it
        is easier to edit a script.

The cron job is created for root using `sudo crontab -e`, and it looks
like this:

```sh
*/10 * * * * sh /home/username/src/hugo-pull-deploy.sh
```

```sh
#!/usr/bin/env zsh

# Script to git pull hugo site repo and deploy. This script is called by
# a cron job. Replace username with your username Note that I have
# compiled go from the source to obtain the latest version which was
# necessary for my theme and also to maintain parity with my local hugo
# version. This can be added to my path if desired. Since only limited
# commands are run using hugo at the moment, I am not doing so.

cd /home/username/hugo-sr
sudo -u username git pull
/home/username/go/bin/hugo -d /var/www/html/website.name/public_html/
```

<div class="src-block-caption">
  <span class="src-block-number">Code Snippet 1</span>:
  The script that is run by cron to pull in latest changes to the hugo repository and construct the website. This script is referred to as hugo-pull-deploy.sh
</div>

Here's a picture of how my local setup looks right now in Emacs:

{{< figure src="/ox-hugo/2020-04-09_09-28-19_CleanShot 2020-04-09 at 09.28.06.png" caption="Figure 1: The window on the left is the Org document where I type content. The top right window is a file explorer in case I want to inspect the markdown export. The bottom right window is the on-going Hugo server. Alternatively, I can eschew the file explorer windows a nice Treemacs workspace (which is usually how I roll)." >}}

> I use the excellent ox-hugo package to maintain my entire blog in a
> single Org file. Any screenshots or pictures are simply added via drag
> and drop (org-web-tools and org-download) and ox-hugo takes care of
> exporting the pictures the correct directory.


## Some alternative approaches: {#some-alternative-approaches}

-   The hugo server alone could be used instead of (or in parallel to) the
    Apache server and made to monitor a specific location and deploy when
    it detects changes. This could be run as a process that is monitored
    via tmux and actually works well. However, it also means a constantly
    running hugo process which was deemed unnecessary and perhaps
    inefficient with an Apache server already setup. Some additional
    configuration is also required to use Hugo standalone without
    Apache. Considering that other applications can be run on the same
    server, an Apache /Nginx setup is worth the effort.

-   A git post commit or pull hook could be used to deploy hugo and
    generate the website. However, I think this approach has more strings
    attached than using a simple cron job, in the sense that, I want the
    website generation to be independent of a git commit.


## Planned updates {#planned-updates}

It is inefficient to have hugo generate the website every 10 minutes,
even if there is no change to the files. I need to introduce a
pre-condition check for the hugo command to check whether there have
been any changes in the file. One way of doing this is described well at
[bash - Check if pull needed in Git - Stack Overflow](https://stackoverflow.com/questions/3258243/check-if-pull-needed-in-git), however, I would
like something a little simpler, as in checking the output message of
git pull.
