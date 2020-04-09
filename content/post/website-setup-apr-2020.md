+++
title = "Automating the deployment of my Hugo site"
author = ["Shreyas Ragavan"]
lastmod = 2020-04-09T11:29:24-07:00
tags = ["hugo", "wordpress", "website", "emacs", "org-mode"]
categories = ["General"]
draft = false
+++

This website is based off [Hugo](https://gohugo.io). The complete source is available as a
Git repo at [shrysr/sr-hugo](https://github.com/shrysr/hugo-sr). Currently, my only actions are to make
changes to an Org source file and export the same via ox-hugo.

> Even the export of the subtree or the file via [ox-hugo](https://ox-hugo.scripter.co/) can be automated
> via the TODO/DONE states. I currently prefer not to do so, but intent to
> gravitate to that soon.

The website is hosted on a Linode VPS running a Debian OS. Since I started
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
4.  A cron job is setup on the VPS, as _root_ to call a script. The
    script starts the hugo process with an additional _watch_ flag in the
    background. Next it pulls in the git changes and the watch process
    will deploy the website to the location set up being served via the
    Apache configuration.
    1.  The reason a root job is required is that the directory exposed to
        the internet is owned by _root_ .
    2.  The git pull using _root_ has to be specified as to be run under
        the specified user unless one is willing to install necessary SSH
        keys for the root as well.
    3.  The cron job actually calls a script every 10 minutes, because it
        is easier to edit a script.
    4.  The trick of exiting a background process started by the script is
        to use a _trap_ as described in <sup id="5aad1e5e2d44edaa5749175e011f528c"><a href="#nil-2017-scrip-start-stop" title="@misc{nil-2017-scrip-start-stop,
          author =	 {nil},
          howpublished =
                          {https://spin.atomicobject.com/2017/08/24/start-stop-bash-background-process/},
          note =	 {Online; accessed 09 April 2020},
          title =	 {A Script to Start (and Stop!) Background Processes in
                          Bash},
          year =	 2017,
        }">nil-2017-scrip-start-stop</a></sup>.
    5.  My understanding is that the _watch_ process builds the website,
        compares it with the destination and will sync only the updates in
        any case. If the `-d` flag was used alone, it means the website is
        essentially re-constructed from scratch and pushed each time.

The cron job is created for root using `sudo crontab -e`, and it looks
like this:

```sh
*/10 * * * * sh /home/username/src/hugo-pull-deploy.sh
```

```sh
#!/usr/bin/env zsh

# Script to git pull hugo site repo and deploy. This script is called by
# a cron job. Replace username with your username. Note that I have
# compiled go from the source to obtain a specific version which was
# necessary for my theme and also to maintain parity with my local hugo
# version. This can be added to my path if desired. Since only limited
# commands are run using hugo at the moment, I have not yet done so.

# Setup the trap. This will ensure the background process is killed when
# the script is finished.
trap "kill 0" EXIT

# Hugo project root directory. It's easier to work from here.
cd /home/username/hugo-sr

# Start the hugo watch process in the background to monitor the hugo
# root directory and send updates to the destination, if any.
/home/username/go/bin/hugo -w -d /var/www/html/website.name/public_html/ &

# Pull in the latest from the remote
sudo -u username git pull

# Sleep for good measure though hugo generates the site in seconds
sleep 2m

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
> exporting the pictures the correct directory. I doubt it can get too
> much easier than it is right now. The only thing that would make it
> easier if I just commit an Org source file, and have an automated
> process to check whether the site builds as expected or not.


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


## Conclusions {#conclusions}

I've tested the above and it works satisfactorily. The deployment is
automated, and is reasonably efficient, though there is always scope to
make it better.

-   [ ] Perhaps introduce a pre-condition check for the hugo command to
    check whether there have been any changes in the pull at all. One way of
    doing this is described well at [bash - Check if pull needed in Git -
    Stack Overflow](https://stackoverflow.com/questions/3258243/check-if-pull-needed-in-git).

-   [ ] Enable website deployment with only the commit of an Org file,
    along with appropriate tests and checks that the website does
    build. Perhaps this will need the integration of a CI service, or I
    wonder if I could have a simple email or message dropped from my VPS,
    using something like [Gotify](https://gotify.net/docs/).

# Bibliography
<a id="nil-2017-scrip-start-stop"></a>[nil-2017-scrip-start-stop] @miscnil-2017-scrip-start-stop,
  author =	 nil,
  howpublished =
                  https://spin.atomicobject.com/2017/08/24/start-stop-bash-background-process/,
  note =	 Online; accessed 09 April 2020,
  title =	 A Script to Start (and Stop!) Background Processes in
                  Bash,
  year =	 2017,
 [↩](#5aad1e5e2d44edaa5749175e011f528c)
