+++
title = "The howm manual is out and left me with mixed feelings"
author = ["Shreyas Ragavan"]
date = 2023-12-27T17:42:00-08:00
tags = ["MoodJournal", "PhilosophyJournal", "LifeJournal", "HowmNotes", "EmacsWiki", "EmacsStuff", "CodeJournal", "SocialJournal"]
draft = false
profile = false
toc = true
+++

Recently a manual for EmacsWiki:HowmMode was [posted](https://github.com/Emacs101/howm-manual/tree/main). This was excellent work, and had been published in English and in Russian. It was appreciated by the community and also by the author of the package himself. Anybody who uses the howm package would appreciate the level of detail in that 86 page manual, and well, the things left out in the documentation existing before that.

It made me reflect about many things. For instance, I had not contributed more than a few lines and re-organisation of the howm page on the EmacsWiki, despite being an active user of the package. Somehow, the idea of a manual did not really cross my head either, and I was more intent on documenting the code and less known functions, as well as contributing to the code base. But it's not like I did much progress there other than some custom functions and hydras.

It was also a bit disappointing that the EmacsWiki was neglected completely, both by the package author and the manual as well. I wonder, what prevented the author from documenting on the wiki? One reason could be that it is difficult to manage images, and additional tinkering would be needed for a PDF output. Another reason.. well the Wiki is a bit dead and nobody enjoys editing the wiki much, but hey - the wiki is closely linked to how Howm works and in some ways a good place for howm documentation.

There were several tidbits of interesting information in the manual, about the package itself, as well as the motivation behind the design and background information on the package author. The author of howm himself supported it by adding a link to the page on his README. The amount of screenshots, taking the pain to explain basic things was also impressive.

It would have been so much nicer if the source of the manual was also posted, and so I posted that as an issue on the repo. Having the source would make it easier to collaborate and add notes. It would actually be even more ideal to distribute some form of an Info file along with the package, which can be read in Emacs. That would be devoid of pictures, but seems a PotentiallyWorthyProject.

For example, I was thinking that the manual did not cover some additional tips, like using org-super-links along with say org capture in order to link howm notes to tasks; tasks which are separately noted in a bunch of org files which are part of the agenda list. There is also an example of a workflow on the Emacs wiki about using the 'G' key to filter through search results.

Another interesting note from the manual is about howm taking 25 seconds to list all notes in the case of 10,000 notes. It is not clear whether that is using the grep based on elisp, or the gnu tool or by using ripgrep.

My notes folder currently has around 3500 files, which is inclusive of text, pdf, images, html and so on, but mostly text files. There is some lag in using howm to list all my notes, and it should be noted that not all notes begin with an ISO date for howm to read in. However, ripgrep through all these notes, and thus howm's search is still almost instant at the moment for me. I think a note tool that takes 25 seconds for anything would not work very well for me.

The slowness in finding entries would be my chief worry in terms of using howm, but that is faced less when one is searching through all the notes with a keyword. Eventually, the solution for that may have to be a database, similar to org-roam, but it would be an interesting experiment to see where that point is reached.

This made me think that a manual is different from a cookbook, and perhaps I could put together a cookbook instead. This cookbook could be driven with HowmNotes, using the OrgMode format and synced to either the EmacsWiki or my own Wiki. It would be an exercise to document and understand how well I can seamlessly publish from HowmNotes notes to an Oddmuse Wiki. I'm already partially there this wiki. This could be a PotentiallyWorthyProject

I was also reflecting that it was instances like this where the wiki method was superior to using only git. One could quickly edit a wiki entry without any specialised tools or knowledge, and contribution would have already started. There's certainly classes of documentation, like an unofficial manual or a cookbook which deserve a wiki, more than a static book. That being said - is it actually more convenient to read though? I'm not sure. Perhaps the best way is to publish in a way that is conducive to multiple exports. OrgMode qualifies for that. An #OddmuseWiki page? I'm not so sure. There are other wikis, like the AmuseWiki which is focused towards making it easy to publish wiki content in different format.s

All this being said - it is excellent that the howm package has a manual. I hope it results in more users and more development. I really enjoy the howm philosophy and it is currently a key player in my ZettelkastenNotes system.
