+++
title = "Implementing HTTPS : Let's Encrypt"
author = ["Shreyas Ragavan"]
date = 2019-07-24T16:13:00-06:00
lastmod = 2019-11-03T06:14:47-07:00
tags = ["https", "encryption"]
categories = ["https"]
draft = false
profile = false
+++

## What is Let's Encrypt? {#what-is-let-s-encrypt}

Let's Encrypt is a Certificate Authority (CA). A certificate from a CA is required to enable HTTPS.

Certbot's documentation summarises it well:

> Certbot is part of EFF’s effort to encrypt the entire Internet. Secure communication over the Web relies on HTTPS, which requires the use of a digital certificate that lets browsers verify the identity of web servers (e.g., is that really google.com?). Web servers obtain their certificates from trusted third parties called certificate authorities (CAs).


## How Let's Encrypt works {#how-let-s-encrypt-works}

-   To certify my domain, I need to demonstrate control over my domain. i.e one has to run a software tool to generate this certificate (periodically) on the server. being able to do this demonstratesa  control over the domain.
    -   Similar to domain control, there are other certificates for different purposes as well. See the excerpt from the ACME protocol below:

> Different types of certificates reflect different kinds of CA verification of information about the certificate subject.  "Domain Validation" (DV) certificates are by far the most common type.  For DV validation, the CA merely verifies that the requester has effective control of the web server and/or DNS server for the domain, but does not explicitly attempt to verify their real-world identity. (This is as opposed to "Organization Validation" (OV) and "Extended Validation" (EV) certificates, where the process is intended to also verify the real-world identity of the requester.)

-   Let's Encrypt's [documentation](https://letsencrypt.org/getting-started/) mentions that the software above will use the [ACME](https://ietf-wg-acme.github.io/acme/draft-ietf-acme-acme.txt) protocols to generate the cert, and there are different approaches to do so, depending on the availability of shell access (or not) to the server.
-   ACME stands for Automatic Certificate Management Environment : The [introduction](https://tools.ietf.org/html/draft-ietf-acme-acme-03#section-1) in the RFC demonstrates how ACME automates a significantly manual procedure combining ad-hoc protocols.

> ...protocol that a certificate authority (CA) and an applicant can use to automate the process of verification and certificate issuance.  The protocol also provides facilities for other certificate management functions, such as certificate revocation.

-   Since I have shell access to my VPS, I will focus on this approach.
-   There are [multiple ACME clients](https://letsencrypt.org/docs/client-options/) to choose from, and [Certbot](https://certbot.eff.org/) is 'recommended' (by the EFF). On a superficial glance, [GetSSL](https://github.com/srvrco/getssl/tree/APIv2) looks  interesting as an alternative.

> At this point, I will proceed with Certbot, because I've not yet found any particular reason not to.


## On Certbot <code>[0/1]</code> {#on-certbot}

The [Certbot website](https://certbot.eff.org/all-instructions) provides customized instructions for the OS and server. The main requirement(s) is having an online HTTP website with an open port 80, hosted on a server. I can go ahead since I've got these.

> Certbot will run on the web server (not locally) periodically and will help in automating the process of certificate management.

Setting up Certbot (on debian)

```shell
wget https://dl.eff.org/certbot-auto
sudo mv certbot-auto /usr/local/bin/certbot-auto
sudo chown root /usr/local/bin/certbot-auto
sudo chmod 0755 /usr/local/bin/certbot-auto
```

Checking that the above was actually done with a simple:

```shell
ls -al /usr/local/bin/cert*
```

Next, a one-command certificate setup is possible (with nginx)

> Note that this command may require additional dependencies to be installed, and will need a bunch of user input as well, and so should not be run in a dumb terminal.

```shell
sudo /usr/local/bin/certbot-auto --nginx
```

This will:

-   Install necessary dependencies and the certbot plugins (authenticator, installer) for nginx.

> Noted the option of `--no-boostrap` for debian. I'm not sure, but this probably has to do with addressing the dependencies for different debian versions.

For reference, the following packages were checked/installed:

```text
ca-certificates is already the newest version (20190110).
ca-certificates set to manually installed.
gcc is already the newest version (4:8.3.0-1).
libffi-dev is already the newest version (3.2.1-9).
libffi-dev set to manually installed.
libssl-dev is already the newest version (1.1.1c-1).
openssl is already the newest version (1.1.1c-1).
openssl set to manually installed.
python is already the newest version (2.7.16-1).
python-dev is already the newest version (2.7.16-1).
python-virtualenv is already the newest version (15.1.0+ds-2).
virtualenv is already the newest version (15.1.0+ds-2).
virtualenv set to manually installed.

Suggested packages:

augeas-doc augeas-tools
The following NEW packages will be installed:
  augeas-lenses libaugeas0
```

An email address has to be entered for 'urgent' communication regarding the certificate, and optionally can be shared with the EFF (which was a trifle annoying (as a part of an installation process), though I said yes).

> I had to enable https with UFW to complete the test successfully. `sudo ufw allow https`. Earlier, only HTTP had been enabled.

Automatic certificate renewal by setting up a cron job.

```shell
echo "0 0,12 * * * root python -c 'import random; import time; time.sleep(random.random() * 3600)' && /usr/local/bin/certbot-auto renew" | sudo tee -a /etc/crontab > /dev/null
```

-   [ ] deciphering the cron job, and verifying it is as expected. For now, I've not run this command because I want to know what it is doing first.

As an alternative to a 'one-step' installation, getting just the certificate will mean nginx's configuration will have to done manually. This is probably a good choice to 'learn more'.

```shell
sudo /usr/local/bin/certbot-auto certonly --nginx
```

> I need to verify this, but it appears nginx's main configuration is at `/etc/nginx/nginx.conf` , and a quick peek showed me that the user was still set as 'www-data', which was used as the initial setup of the nginx test website. This was changed subsequently. Perhaps this is why I am unable to get Wordpress plugins write access.

At the end of it all, I received a [link](https://www.ssllabs.com/ssltest/analyze.html?d=s.ragavan.co), through which it appears I can get a detailed 'SSL Report'.

```text
Congratulations! You have successfully enabled https://s.ragavan.co

You should test your configuration at:
https://www.ssllabs.com/ssltest/analyze.html?d=s.ragavan.co
```

> This report appears to be quite important, but I could not make much sense of it, and it needs to be re-visited. As such, I see that the [ACME](https://tools.ietf.org/html/draft-ietf-acme-acme-03#section-7) challenges need to be understood to comprehend these results.


## Short Peek under the hood. {#short-peek-under-the-hood-dot}

A skim of the extensive [documentation of Certbot](https://certbot.eff.org/docs/) shows that certbot relies on [2 types of plugins](https://certbot.eff.org/docs/using.html#plugins) to function.

1.  authenticators: plugins to obtain a certificate, but not install (i.e edit the server configuration). Used with the `certonly` command.
2.  Installers: used to modify the server's configuration. Used with the `install` command.
3.  Authenticators + installers : can be used with the `certbot run` command.

These plugins use '[ACME Protocol challenges](https://tools.ietf.org/html/draft-ietf-acme-acme-03#section-7)' to prove domain ownership. Section 7 (as of today) of the internet draft of the standard provides an overview, and the challenges are described in detail in the draft.

> There are few types of identifiers in the world for which there is a standardized mechanism to prove possession of a given identifier.  In
> all practical cases, CAs rely on a variety of means to test whether
> an entity applying for a certificate with a given identifier actually
>  controls that identifier.
>
> Challenges provide the server with assurance that an account key
> holder is also the entity that controls an identifier.  For each type
> of challenge, it must be the case that in order for an entity to
> successfully complete the challenge the entity must both:
>
> -   Hold the private key of the account key pair used to respond to
>     the challenge
>
> -   Control the identifier in question


## Conclusions {#conclusions}

-   HTTPS via Let's Encrypt is setup for my website. Come visit at <https://s.ragavan.co>
-   Had a brief introduction into the methodology/philosophy behind Let's Encrypt.
-   Brief exploration of ACME and it was quite interesting to go through the draft standard, though it will take a lot more effort to fully comprehend all the tests. I think it is likely that I have visit this in more detail as I make progress in learning about encryption.
-   Learned about the existence of '[Internet Standards](https://en.wikipedia.org/wiki/Internet%5FStandard)'. These are documented by one or more documents called RFC's (Request for Comments) and revised until deemed satisfactory to become a standard.
