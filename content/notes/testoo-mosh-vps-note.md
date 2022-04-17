+++
title = "moshY - for better access to my VPS"
author = ["Shreyas Ragavan"]
date = 2019-08-01T08:42:00-07:00
tags = ["mosh", "linux", "vps", "ufw"]
draft = false
profile = false
type = "notes"
+++

[Mosh](https://mosh.org/) is short for mobile shell, and is useful as an alternative to SSH, especially for poor network conditions, and where one has to frequently switch networks. It works via the UDP port, which has to be specifically enabled. I learnt of mosh through the guys in the #emacs.

I've faced frequent trouble due to network issues over SSH connections, with the lag hampering my ability to type, in general, and it is particularly inconvenient to respond on IRC/Weechat. I'm hoping mosh will alleviate the issue.

UDP needs to be enabled for mosh to work. I used UFW on the ports 60000:61000 for this.

```shell
sudo ufw allow 60000:61000/udp
```

-   Essentially, a mosh server runs on both the machines (VPS and local machine), and these perform the background job of syncing commands and output with each other. This reduces the lag in typing, among other advantages. The initial connection of Mosh, including authentication is via SSH, after which the UDP protocol is used.

Installing Mosh:

On debian - mosh is directly available as a package. Run `apt-get update` and then install mosh.

```shell
apt-get install "mosh"
```

The `mosh-server` has to be run on both the machines. It may be a good idea to include this in `.bashrc`, or in the list of start-up programs. This command will start up the mosh-server and detach the process (into the background).

```shell
mosh-server
```

This is where I ran into trouble. A UTF-8 environment has to be specified for mosh to run, and it appears that the locales of the two connecting machines have to match (?). On Debian, this is relatively easy with `dpkg`

```shell
sudo dpkg-reconfigure locales
```

I chose the `en_USA.UTF-8` option. The existing locale configuration can be viewed with `locale`.

```shell
locale
```

```text
LANG="en_CA.UTF-8"
LC_COLLATE="en_CA.UTF-8"
LC_CTYPE="en_CA.UTF-8"
LC_MESSAGES="en_CA.UTF-8"
LC_MONETARY="en_CA.UTF-8"
LC_NUMERIC="en_CA.UTF-8"
LC_TIME="en_CA.UTF-8"
LC_ALL=
```

Sometimes, additional settings for the locale are defined in locations like `~/.bashrc`. This should be something like :

```shell
export LANGUAGE=en_US.UTF-8
export LANG=en_US.UTF-8
# export LC_ALL=en_US.UTF-8
```

The above can be used for explicitly setting the preference. The [Debian wiki](https://wiki.debian.org/Locale) dissuades end-users from using `LC_ALL`, but that is easiest way. My initial settings were with `en_CA.UTF-8`. While this is also UTF-8, for some reason, mosh still threw out locale errors. In any case, I wanted all my computers to uniformly use the `en_US` version.


## Did mosh make a difference? {#did-mosh-make-a-difference}

It's only been a few hours, but the difference can already be felt. Mosh clearly indicates when the connection has been lost and there is no lag in typing. Further experimentation is necessary to understand its behavior, but atleast, I can type out a message in peace without lag.

<span class="timestamp-wrapper"><span class="timestamp">[2019-07-31 Wed] </span></span> After 3+ days of using mosh, I am happy to note that the experience of engaging with my vps over a terminal has significantly improved. There were few instances of really poor network connection, and mosh would clearly indicate the disconnection, and also allow a safe exit if required. I can switch computers and jump right in, without bothering to restore the SSH connection.
