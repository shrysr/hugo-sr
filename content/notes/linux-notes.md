+++
title = "Linux notes"
author = ["Shreyas Ragavan"]
lastmod = 2019-07-06T19:53:16-06:00
tags = ["Linux"]
categories = ["Linux"]
draft = false
linktitle = "Linux - notes"
toc = true
[menu.docs]
  identifier = "linux-notes"
  weight = 2001
+++

## Installing the Iosevka font {#installing-the-iosevka-font}


### On Debian distros {#on-debian-distros}

There appear to be no packages for iosevka for debian. The prescribed method is to add the fonts to the fonts folder. The github issues point towards a PPA which can be added. However, this did not work for me, and I had to resort to manual means.

Downloading the specified font version from github into a temp folder

```shell
cd ~/temp
wget "https://github.com/be5invis/Iosevka/releases/download/v2.2.1/01-iosevka-2.2.1.zip"
```

Extracting the contents of the downloaded zip file to a folder named iosevka.

```shell
cd ~/temp
unzip -u 01-iosevka-2.2.1.zip -d iosevka
```

For system wide recognition, the ttf files have to be placed in  `usr/share/fonts`  as per the debian wiki. Sudo permission is required for writing to this location. Optionally, the font folder can also be copied to `~/.local/share/fonts/`, for a user specific setting.

```shell
sudo cp -r ~/temp/iosevka /usr/share/fonts/
```

Finally, it is a good idea to refresh the font cache

```shell
fc-cache -fv
```

To set the font in Emacs:

```emacs-lisp
(set-face-attribute 'default nil :family "ttf-iosevka" :height 140)
```

Note: The file permissions for the ttf files have to be set to `644` to be usable. This should be checked if the above does not work.


### <span class="org-todo todo TODO">TODO</span> On Arch / Antergos {#on-arch-antergos}

Use AUR to install iosevka in Antergos / Arch as the package is already available.

```shell
yay -S ttf-iosevka
```

Setting the font in Emacs. This should be added to the init. The font height could vary based on the monitor size.

```emacs-lisp
(set-face-attribute 'default nil :family "ttf-iosevka" :height 120)
```

Installing iosevka in Debian:

The font files have to be downloaded and placed in to the location `/usr/local/share/Fonts` for system wide access.


## Setup gpg-agent to be running whenever gpg is called {#setup-gpg-agent-to-be-running-whenever-gpg-is-called}

For some reason, it appears though the gpg-agent is shown to be running, this configuration is required to make sure that the entered keys are stored in the keyring.

```shell
cat >> ~/.gnupg/gpg.conf <<EOF
no-greeting
no-permission-warning
lock-never
keyserver-options timeout=10
use-agent
EOF
```


## Install tk especially for being able to select the CRAN mirrors in R {#install-tk-especially-for-being-able-to-select-the-cran-mirrors-in-r}

This is pertinent to Arch based distros.

```shell
sudo pacman -S tk
```


## Git global config {#git-global-config}

```shell
git config --global user.email "abcs@gmail.com"
git config --global user.name "Mad Max"
```


## Upgrading a debian distro {#upgrading-a-debian-distro}

```shell
sudo apt-get update
sudo apt-get dist-upgrade
```


## App installation in debian using flatpak {#app-installation-in-debian-using-flatpak}

Some apps are not available in the so called stable debian software archives. Therefore alternative sources have to be established for the same.

Installing flatpak on debian and adding the flatpak repository:

```shell
sudo apt-get install flatpak
sudo flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
```

Reboot after the above commands.

Note: Calling a flatpak based app is rather verbose, and is better served by defining appropriate aliases.


### Franz: Multi-network messenger {#franz-multi-network-messenger}

This app covers Slack and Whatsap and other networks. It still takes up about 1GB of RAM and the app itself is about 500MB, but it atleast covers all the platforms in one go and should be useful in the office.

In addition, the `org.freedesktop.Platform` package has to be installed. The latter gets installed automatically, when executed in the terminal.

Pre-requisites for debian/ubuntu

```shell
sudo apt install libx11-dev libxext-dev libxss-dev libxkbfile-dev
```

```shell
flatpak install flathub com.meetfranz.Franz
```


### Slack: {#slack}

The Slack app takes up a lot of memory.

```shell
flatpak install flathub com.slack.Slack
```


## Swapping control and Capslock {#swapping-control-and-capslock}

Creating xmodmap script : Swapping control and capslock keys
Source: [link](https://www.emacswiki.org/emacs/MovingTheCtrlKey#toc8)

```shell
cat > ~/.xmodmap <<EOF
!
! Swap Caps_Lock and Control_L
!
remove Lock = Caps_Lock
remove Control = Control_L
keysym Control_L = Caps_Lock
keysym Caps_Lock = Control_L
add Lock = Caps_Lock
add Control = Control_L
EOF

```

Executing xmodmap on the configuration above

```shell
xmodmap ~/.xmodmap
```


### <span class="org-todo todo TODO">TODO</span> The above command should be added as the last command in the autostart option of ~/.config {#the-above-command-should-be-added-as-the-last-command-in-the-autostart-option-of-dot-config}

```sh
cat > ~/.config/
```


## Installing Firefox developer edition {#installing-firefox-developer-edition}

The developer edition of Firefox contains interesting features, and it appears to perform better. The developer edition is available as a package on Arch Linux (AUR). For Debian, the procedure is a little round-about.

The following procedure using flatpak is picked up from the [Debian wiki page](https://wiki.debian.org/Firefox).

Using flatpak

Unofficial builds are provided by Fedora at <https://firefox-flatpak.mojefedora.Cz/>

```shell
sudo apt install flatpak
sudo flatpak remote-add --from gnome https://sdk.gnome.org/gnome.flatpakrepo
sudo flatpak remote-add --from org.mozilla.FirefoxRepo https://firefox-flatpak.mojefedora.cz/org.mozilla.FirefoxRepo.flatpakrepo
```

Then for "developer edition" (aka "Beta"):

```shell
flatpak install org.mozilla.FirefoxRepo org.mozilla.FirefoxDevEdition
```

and Running:

```shell
flatpak run org.mozilla.FirefoxRepo org.mozilla.FirefoxNightly
```

The Debian wiki also describes  a method to add the flatpak installations to the Path. However, this is a newer feature and is unavailable at the moment on my machine.

```shell
echo 'export PATH=$PATH:/var/lib/flatpak/exports/bin' >> ~/.zshrc
```


## Emacs can be installed via Conda {#emacs-can-be-installed-via-conda}

The advantage of using conda is being able to quickly install reasonably recent versions of Emacs quickly on Debian type OS's which often reference older (stable) versions of software packages by default. Using conda would avoid adding PPA's or hunting for binaries or even compiling from source. Another advantage is that this approach can be used cross platform.

One disadvantage of this method is that the package is installed into the miniconda / anaconda package installation path. Though the instillation script of miniconda adds the path for bash, it has to be manually set for any other shell like zsh. However, once this is done - there appear to be no issues in using Emacs.

```shell
conda install -c conda-forge emacs
```


## Virtualbox: resizing virtual disk image - vdi {#virtualbox-resizing-virtual-disk-image-vdi}

Reference: <http://derekmolloy.ie/resize-a-virtualbox-disk>

It does not appear to be possible to expand the size of a fixed format vdi. The floating format has a disadvantage of a read-write overhead for expanding the disk image as it is utilised.

However, as per the documentation, after the hard disk size reaches a stable stage, this overhead becomes negligible on an average.

Therefore the vdi has to be copied (or cloned), and the floating format has to be selected. This is done using the copy option in the virtualbox media manager. Once copied, the expanded vdi image has to be attached to the guest OS.

When the attachment is complete, the hardisk will show up in the virtualbox media manager app. Now the vdi size can be adjusted to the desired value.

The next step is to download the live iso of gparted. This should be loaded as a storage device with the live CD option selected. With this loaded, the existing partitions have to be changed appropriately[^fn:1]. This step has to be done to enable Linux to recognise the expanded harddisk.

Once this has been, the gparted iso can be removed and the guest OS can be booted as usual. However, the UUID of the paritions have to be changed appropriately. If not changed, there will be delay during boot, especially if the swap partition has been modified.

The actual partition setup and the UUIDs can be viewed with:

```shell
lsblk -f
```

The appropriate UUID has to be replaced in the file `/etc/fstab`. Technically, the fstab file is generated by the command `mkinitcpio`, but sometimes a manual change is necessary.


## Downgrading a single package in Arch linux {#downgrading-a-single-package-in-arch-linux}

From the [Arch linux wiki : archive](https://wiki.archlinux.org/index.php/Arch%5FLinux%5FArchive) : downgrading via downloading the Package from URL. Find the package you want under /packages and let pacman fetch it for installation. For example:

```shell
pacman -U https://archive.archlinux.org/packages/ ... packagename.pkg.tar.xz
```

Downgrading via local cache

```shell
pacman -U /var/cache/pacman/pkg/<package-name>
```

It seems to be a very good idea to maintain a few older versions of packages in the cache, even at the expense of Harddisk space.

Further options are provided at this [Unix stack exchange discussion](https://unix.stackexchange.com/questions/103859/arch-linux-pacman-specifying-package-version).

[^fn:1]: It is likely that the swap partition is the last partition, and the previous partition is the root which has to be extended. In this case, the swap has to be deleted and the root partiion should be expanded to the desired size, leaving behind room for the swap partition. The final unallocated space has to be used for a new extension partition and then a logical partition to create the linux-swap. _For some reason, there is a space of 1MB preceding the swap partition_.
