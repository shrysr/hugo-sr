+++
title = "A graphic overview of the 'binary' with respect to R packages"
author = ["Shreyas Ragavan"]
date = 2020-01-18T20:28:00-08:00
tags = ["DataScience", "R"]
categories = ["DataScience"]
draft = false
profile = false
toc = true
+++

Recently there was a question as to what a Binary is, building off a question [posted on the Rstudio community forum](https://community.rstudio.com/t/meaning-of-common-message-when-install-a-package-there-are-binary-versions-available-but-the-source-versions-are-later/2431). I've always found these aspects interesting, and a little hard to keep track of the connections and flow - So I've made a flowchart that will help me remember and hopefully explain what is happening to a noob.

In this process, I was able to remember [One of the first](http://www.tldp.org/HOWTO/Unix-and-Internet-Fundamentals-HOWTO/) documents I really enjoyed reading when I started learning how to use Linux. I would recommend that article for anybody starting out. The document is meant for people with a non-technical background, but I think it is technical enough.

So: Lets pretend the binary is a capsule to be swallowed by the computer to gain superpowers :D : The capsule is in a sense off-the-shelf and made for your System. When the capsule is not available, it has to be manufactured (compiled) by your machine locally for which it needs certain tools and dependencies, etc and this varies from package to package, and possibly between hardware architectures as well and more. Please feel free to let me know if there are any discrepancies in the flowchart !

Binaries can be built and maintained if you desire. There should be people maintaining their own binaries or frozen versions as well. The question is - who is going to maintain them and how many binaries can you build.

{{< figure src="/img/binaries-source-code-11.jpg" >}}
