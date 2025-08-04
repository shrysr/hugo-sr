+++
title = "On Data Unicorns, Shiny and other things"
author = ["Shreyas Ragavan"]
date = 2023-06-24T22:21:00-07:00
tags = ["MyCommentary", "DataScienceJournal", "BlogPublished", "RNotes", "PythonNotes", "CodeJournal"]
draft = false
+++

Recently, I came across a question in a forum about the difference between data scientists and MLOps folks.

The gist of the popular response was that the definition would vary across companies, depending on the team size, culture and needs; and that if one could both model as well as deploy models into production - that would adding great value and would increase opportunities. It was also proffered that knowing how to use 'Shiny'(a framework in R to create web applications) would set one apart from other data scientists. Being a support forum dedicated to R/Shiny courses - such a view was not entirely unexpected.

I do agree on the first point about the definition depending on the company size, environment, needs and so on, which creates a shifting and ambiguous line dividing data engineering and MLOps work. Usually, the folks focused on Ops-ish work would not be experts in data modelling, but would know enough in terms of refactoring models and deploying them into production. In the case of the data engineer - their focus would be more on building robust pipelines, to enable reliable access to data and less on the model itself.

However, a single person doing the modelling as well as deployment, i.e a one-man army is is aligned to the MentalModel of what is often referred to as a 'Data Unicorn', or a 'full stack data scientist'.

In my opinion, if at all a Data Unicorn is discovered - they should be treated as magical creatures (as the name implies) and treasured and never let go. So, Yes, in an ideal world - such creatures would be excellent. However, I think it is impractical and requires a special combination of circumstances; both for the formation of a Data Unicorn and the ability of said Data Unicorn to consistently deliver on **all aspects**.

Over time the complexity of developing, maintaining and monitoring data model(s) including their business impact tends to become higher, and it is relatively difficult to manage without special tools that enable managing experiments and data. If one were being serious - there a number of other aspects to consider like bias and fairness, data governance, model governance and so on. It would be stretch to think a single person could deliver all the above.

I think being able to build an interactive (web) application to convey your results is what sets the data 'person' apart. While this could be achieved using different tools including R/Shiny - if one is travelling down the open source route - they are still better off building applications using Dash, or streamlit or other options based on Python and code that can eventually get plugged into a Flask application that is **known** to be able to scale, in traditional ways. Python based code can also run on platforms like Google Cloud (GCP) on many services, as opposed to R which will always need a custom image.

The only 'easy' way to scale Shiny applications is by using a 'complex' Enterprise service that will run off Docker. The Shiny framework relies on having a state, And this is unlikely to change for a while. A self-maintained route is hard to setup, manage and maintain.

Now, the notion of Ops 'abilities' adding value to the profile of a Data Scientist is excellent. Arguably the experience of deploying and considering 'Operations', i.e reliability and other aspects like code quality, CI/CD and testing bring a much needed awareness to the data scientist about the 'world' of things that they typically do not think about (and ideally should).

For example, at its roots R is not a performant language, and it is definitely not a good choice when it comes to building API's where performance matters. Lets not forget that non-performant API's cost money. The other avenues being explored to improve R's performance have not exactly taken off, both in terms of development as well as mainstream adoption.

Folks who postulate 'Shiny' as a brilliant solution, and ignore the rest typically do not talk about application security, scale and modularity of code. They will also likely lose an argument with a seasoned Java/Python developer.

The majority of folks who make Shiny apps, make it for a purpose where it will be accessed by a small number of people, and very few concurrent users. They're often looking for quick wins to demonstrate value and garner support.

Indeed, the best use case of Shiny - is making fast PoC's and such apps which will Not be accessed by a huge lot of people concurrently. For such use cases - it is certainly of good value in any tool stack involving R (atleast as an option). Well, a tool stack supported by Enterprise software would still be a win for data science focused work.

The problem with PoC's is that they grow. There is a certain thrill in being able to build an interactive app that does some analysis for you; one that takes you a lot more time to do without said Shiny app. If the app manages to tickle the taste buds of end users - that is when the requests will start flowing in - like 'Can you change the shade of this little corner of your shiny app to a lighter blue?', 'Why is this so darned slow?', 'I want to add on 100 users tomorrow'. Many of these requests would detract focus from the 'modelling' side to maintenance and operations.

Most software engineering processes will not necessarily prefer making a PoC in one framework or language and then switching to another when the PoC is approved. One can easily argue a number of points, like : Where do things go from there? How does the code itself scale? What about the development process for a 'larger' Shiny app with multiple 1000 lines of code? How many times does one plan to hit 'refresh' on the browser to re-load a large application just for testing the smallest change? How does the process scale? (That is different from the code).

What about the notion of modules and re-using of code? I bet the majority of folks who use Shiny, do not use a framework like Golem to make it modular and easier to manage. Hey, it's hard enough to create a working web application, even with Shiny.

What about tests? And I'm talking about complete application and regression tests, and not just a handful of testthat chunks.

What about the separation of business logic and programming backend? This is the typical way many other frameworks are built, called the MVC framework. Shiny and Dash weave both both together into a single framework.

And what about scaling .. erm everything? Are you willing to extend yourself to maintain, not only the Shiny app, but a full fledged Docker driven deployment system? Are you ready to maintain that nightmare on your own, especially if you do not have access to an enterprise framework like RStudio? Let's keep in mind that Docker and Kubernetes are fairly complex frameworks that are better handled with some level of expertise.

And do all that - for what? An R based app that can never hope to rival the performance of other competing frameworks?

With respect to Shiny, in my opinion it is smarter to present upfront that this is a Proof of Concept which will Not scale without taking specific action, which are likely to entail investment in the form of the time and effort in a complete re-write and possibly engaging enterprise services to support deployment and maintenance. Such suggestions are often absent in statements from Shiny proponents, and depending on the situation - may significantly detract from the value of working with Shiny.

Are there examples of people making very good Shiny apps? Yes, but not all that many public accounts of apps with large user bases. Appsilon is an example of consultants focused on Shiny apps. The have their own framework of deploying Shiny at scale (called Revolver, and based off docker), and it is Not open sourced; probably with good reason because that may change the game with respect to the popularity of Shiny.

The simple fact of the matter is that the subject of Data Science and machine learning is vast, multi-disciplinary and complex. An over-worked faux-Data-unicorn in most cases means that the poor Unicorn's knowledge and technical debt is growing at a pace that is not sustainably resolved, and the quality of work is likely suffering because of it. Probably - if you are not that tech savvy : you are riding on a state of 'ignorance is bliss', i.e. you do not even know what you do not know.

Any ignorance or lack of knowledge by itself is not a crime. However, not acknowledging the gap in an analysis or evaluation of a framework or solution is sub-optimal. Not providing this kind of insight to somebody new in the field is also irresponsible in my opinion. That being said, sometimes I wonder - does any of it even matter? Folks will learn what they have to, when they must.

On the other hand, if you happen to be a true Data Unicorn and never felt any stress being solely responsible for 'everything Data Science', from development to refreshes and deployment - then **hats off to you**. Drop me a line and I would love to meet you.
