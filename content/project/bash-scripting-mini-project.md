+++
title = "Bash scripting to compare chat logs of an IRC channel"
author = ["Shreyas Ragavan"]
date = 2019-09-22T08:43:00-06:00
lastmod = 2019-11-03T06:37:53-07:00
tags = ["Linux", "bash", "project", "shell"]
categories = ["Linux", "bash", "project"]
draft = false
weight = 1002
profile = false
+++

<div class="ox-hugo-toc toc">
<div></div>

<div class="heading">Table of Contents</div>

- [Summary](#summary)
- [Preliminary notes:](#preliminary-notes)
- [Plan](#plan)
- [Simple case](#simple-case)
- [Including variables for url prefix, start id and end id](#including-variables-for-url-prefix-start-id-and-end-id)
- [Figuring out a larger range](#figuring-out-a-larger-range)
    - [Implementing a simple conditional statement](#implementing-a-simple-conditional-statement)
    - [Implementing the for loop for a range > 500](#implementing-the-for-loop-for-a-range-500)
    - [Adding some functions and other minor streamlining](#adding-some-functions-and-other-minor-streamlining)
- [Enabling the script to be called with parameters](#enabling-the-script-to-be-called-with-parameters)
- [Comparing logs for range 9998683 to 1000000](#comparing-logs-for-range-9998683-to-1000000)
- [Concluding remarks](#concluding-remarks)
- [References](#references)

</div>
<!--endtoc-->


## Summary {#summary}

This project is an exploration of BASH scripting utilising `cURL` and `diff` to extract chat logs of an IRC channel and quickly compare the contents to check for any discrepancies. Several new concepts were learned, including defining variables, for loops, conditionals and making temporary files. The gradual build up in complexity is shown and has the benefit that that report can serve as a simple tutorial in BASH scripting.


## Preliminary notes: {#preliminary-notes}

-   The raw knob can be used to extract the text of the logs. The raw mechanism will spit out a maximum of 500 lines.
    -   i.e if a user provides a large range of id's - this will have to be split into batches of 500 lines.
-   W.r.t diff the focus will be on id < 1000,000.
-   My initial idea to use R and connect to the db snapshot was an example of an unnecessarily bloated solution when readily available bash + curl + diff can do the job.


## Plan {#plan}

1.  Create a simple case:
    1.  Use curl on raw knob links from each box > write this to a text file.
    2.  Use diff to compare the text files.
2.  Include variables to substitute start id and end id.
3.  Strategy for a id range above 500
4.  Enable providing arguments (url(s), startid and endid) to supply to the bash script so it can be invoked easily from the command line.


## Simple case {#simple-case}

Beginning with manually using curl.

```bash
#!bin/bash

curl "http://logs.ossasepia.com/log-raw/ossasepia?istart=999600&iend=999700" > ~/temp/log-test.txt

curl "http://logs.nosuchlabs.com/log-raw/ossasepia?istart=999600&iend=999700" > ~/temp/log2-test.txt

diff -uNr ~/temp/log-test.txt ~/temp/log2-test.txt > ~/temp/hololo.txt
```

Quick test of diffing post 1,000,000 id's.

```shell
#!bin/bash

curl "http://logs.ossasepia.com/log-raw/ossasepia?istart=1000000&iend=1000400" > ~/temp/log-test.txt

curl "http://logs.nosuchlabs.com/log-raw/ossasepia?istart=1000000&iend=1000400" > ~/temp/log2-test.txt

diff -uNr ~/temp/log-test.txt ~/temp/log2-test.txt > ~/temp/hololo.txt
```


## Including variables for url prefix, start id and end id {#including-variables-for-url-prefix-start-id-and-end-id}

_After a few hours of head-banging using istart= 995000 and iend= 995500 - I realised that these do not exist in the ossasepia log, and I had the syntax right in my first attempt._

```shell
#!bin/bash
urlPrefix1="logs.ossasepia.com/log-raw/ossasepia"
urlPrefix2="logs.nosuchlabs.com/log-raw/ossasepia"
startid=1001700
endid=1001900

curl "${urlPrefix1}?istart=${startid}&iend=${endid}" > ~/temp/log-test.txt

curl "${urlPrefix2}?istart=${startid}&iend=${endid}" > ~/temp/log2-test.txt
```

```shell
diff -uNr ~/temp/log-test.txt ~/temp/log2-test.txt > ~/temp/log-diff.txt
```

So far, so good. Now comes the _relatively_ tricky part: extending the above to cover more than 500 lines. This will need some conditionals and a for loop thrown in for dealing with a large range.


## Figuring out a larger range {#figuring-out-a-larger-range}

Strategy:

1.  Obtain a startid and endid (i.e `istart` and `iend`)
2.  If (endid-startid <= 500) - go ahead with directly using curl and diff.
3.  If endid-startid > 500
    1.  divide the number of lines by 500. Obtain the quotient and remainder.
    2.  Use the quotient in a for loop as the number of times the internal startidi is incremented by 500.
    3.  the internal endidi is subtracted by 1 to account for duplication of lines.
    4.  Subtract the remainder from original endid to extract the last portion.


### Implementing a simple conditional statement {#implementing-a-simple-conditional-statement}

```shell
#!bin/bash
urlPrefix1="logs.ossasepia.com/log-raw/ossasepia"
urlPrefix2="logs.nosuchlabs.com/log-raw/ossasepia"
startid=999700
endid=999900
rangelimit=500

let subtrid=endid-startid

if [ "$subtrid" -le "$rangelimit" ]
then

    echo "Lines <= 500. Proceeding to curl and diff."
    curl "${urlPrefix1}?istart=${startid}&iend=${endid}" > ~/temp/log-test.txt
    curl "${urlPrefix2}?istart=${startid}&iend=${endid}" > ~/temp/log2-test.txt
    diff ~/temp/log-test.txt ~/temp/log2-test.txt > ~/temp/log-diff.txt
else
    echo "Lines > 500. Additional calcs required."
fi
```


### Implementing the for loop for a range > 500 {#implementing-the-for-loop-for-a-range-500}

```shell
#!bin/bash
urlPrefix1="logs.ossasepia.com/log-raw/ossasepia"
urlPrefix2="logs.nosuchlabs.com/log-raw/ossasepia"
startid=1001900
endid=1002900
rangelimit=500

let subtrid=endid-startid

if [ "$subtrid" -le "$rangelimit" ]
then

    echo "Lines <= 500. Proceeding to curl and diff."
    curl "${urlPrefix1}?istart=${startid}&iend=${endid}" > ~/temp/log-test.txt
    curl "${urlPrefix2}?istart=${startid}&iend=${endid}" > ~/temp/log2-test.txt
    diff ~/temp/log-test.txt ~/temp/log2-test.txt > ~/temp/log-diff.txt
else
    echo "Lines > 500. Entering Loop to split the range into batches of 500 lines."
    let quotient=$subtrid/$rangelimit
    let remainder=$subtrid%$rangelimit
    echo $quotient
    echo $remainder
    for (( c=0; c <$quotient; c++ ))
    do
	let "startidi=$startid + $c * $rangelimit"
	let "endidi=$startidi + $rangelimit -1"
	echo $startidi
	echo $endidi
	curl "${urlPrefix1}?istart=${startidi}&iend=${endidi}" >> ~/temp/log-test.txt
	curl "${urlPrefix2}?istart=${startidi}&iend=${endidi}" >> ~/temp/log2-test.txt
    done
    let "portionstartid=$endid - $remainder"
    echo $portionstartid
    curl "${urlPrefix1}?istart=${portionstartid}&iend=${endid}" >> ~/temp/log-test.txt
    curl "${urlPrefix2}?istart=${portionstartid}&iend=${endid}" >> ~/temp/log2-test.txt
    diff ~/temp/log-test.txt ~/temp/log2-test.txt > ~/temp/log-diff.txt
fi
```

The above has been tested to work across a range of start and end ID's.


### Adding some functions and other minor streamlining {#adding-some-functions-and-other-minor-streamlining}

-   function to check the output of curl as well as diff if empty.
-   curl operations put into a function since repeated.
-   Streamlined echo outputs to be more neat.

<!--listend-->

```shell
#!bin/bash
urlPrefix1="logs.ossasepia.com/log-raw/ossasepia"
urlPrefix2="logs.nosuchlabs.com/log-raw/ossasepia"
startid="1001900"
endid="1003700"
log1_file=$(mktemp -t "$(date +"%Y_%H-%M-%S").log1")
log2_file=$(mktemp -t "$(date +"%Y_%H-%M-%S").log2")
diff_file=$(mktemp -t "$(date +"%Y_%H-%M-%S").difflog")
rangelimit=500

let subtrid=endid-startid

function check_output {
    echo "Log1 curl output is at $log1_file"
    echo "Log2 curl output is at $log2_file"
    echo "diff output is at $diff_file"

    if [ ! -s $1 ] || [ ! -s $2 ]
    then
	echo "Atleast One curl output returned nothing."
    fi

    if [ -s $3 ]
    then
	echo "Diff file is not empty. Logs not equal"
    else
	echo "Diff file is empty."
    fi
}

function curler {
    curl "${1}?istart=${3}&iend=${4}" >> $log1_file
    curl "${2}?istart=${3}&iend=${4}" >> $log2_file
}

if [ "$subtrid" -le "$rangelimit" ]
then

    echo "Lines <= $rangelimit. Proceeding to curl and diff."
    curler $urlPrefix1 $urlPrefix2 $startid $endid
    diff -uNr $log1_file $log2_file > $diff_file
    check_output $log1_file $log2_file $diff_file

else
    echo "Lines > $rangelimit. Looping to split the range into batches."
    let quotient=$subtrid/$rangelimit
    let remainder=$subtrid%$rangelimit
    echo "Batches of $rangelimit lines = $quotient. Remaining lines = $remainder"
    for (( c=0; c <$quotient; c++ ))
    do
	let "startidi=$startid + $c * $rangelimit"
	let "endidi=$startidi + $rangelimit -1"
	echo "istart is $startidi and iend is $endidi"
	curler $urlPrefix1 $urlPrefix2 $startidi $endidi
    done
    let "portionstartid=$endid - $remainder"
    echo "Last portion istart is $portionstartid"
    curler $urlPrefix1 $urlPrefix2 $portionstartid $endid
    diff -uNr $log1_file $log2_file > $diff_file
    check_output $log1_file $log2_file $diff_file
fi
```


## Enabling the script to be called with parameters {#enabling-the-script-to-be-called-with-parameters}

```shell
#!bin/bash
urlPrefix1=$1
urlPrefix2=$2
startid=$3
endid=$4
log1_file=$(mktemp -t "$(date +"%Y_%H-%M-%S").log1")
log2_file=$(mktemp -t "$(date +"%Y_%H-%M-%S").log2")
diff_file=$(mktemp -t "$(date +"%Y_%H-%M-%S").difflog")
rangelimit=500

let subtrid=endid-startid

function check_output {
    echo "Log1 curl output is at $log1_file"
    echo "Log2 curl output is at $log2_file"
    echo "diff output is at $diff_file"

    if [ ! -s $1 ] || [ ! -s $2 ]
    then
	echo "Atleast One curl output returned nothing."
    fi

    if [ -s $3 ]
    then
	echo "Diff file is not empty. Logs not equal"
    else
	echo "Diff file is empty."
    fi
}

function curler {
    curl "${1}?istart=${3}&iend=${4}" >> $log1_file
    curl "${2}?istart=${3}&iend=${4}" >> $log2_file
}

if [ "$subtrid" -le "$rangelimit" ]
then

    echo "Lines <= $rangelimit. Proceeding to curl and diff."
    curler $urlPrefix1 $urlPrefix2 $startid $endid
    diff -uNr $log1_file $log2_file > $diff_file
    check_output $log1_file $log2_file $diff_file

else
    echo "Lines > $rangelimit. Looping to split the range into batches."
    let quotient=$subtrid/$rangelimit
    let remainder=$subtrid%$rangelimit
    echo "Batches of $rangelimit lines = $quotient. Remaining lines = $remainder"

    for (( c=0; c <$quotient; c++ ))
    do
	let "startidi=$startid + $c * $rangelimit"
	let "endidi=$startidi + $rangelimit -1"
	echo "istart is $startidi and iend is $endidi"
	curler $urlPrefix1 $urlPrefix2 $startidi $endidi
    done

    let "portionstartid=$endid - $remainder"
    echo "Last portion istart is $portionstartid"
    curler $urlPrefix1 $urlPrefix2 $portionstartid $endid
    diff -uNr $log1_file $log2_file > $diff_file
    check_output $log1_file $log2_file $diff_file
fi
```

The above script, if saved as `~/temp/log-bash-curl-diff.sh` can be called as:

```shell
sh ~/temp/log-bash-curl-diff.sh "logs.ossasepia.com/log-raw/ossasepia" "logs.nosuchlabs.com/log-raw/ossasepia" 1001900 1003700
```

```text
Lines > 500. Looping to split the range into batches.
Batches of 500 lines = 3. Remaining lines = 300
istart is 1001900 and iend is 1002399
istart is 1002400 and iend is 1002899
istart is 1002900 and iend is 1003399
Last portion istart is 1003400
Log1 curl output is at /var/folders/39/l1557gl175s593l7zjj9kd640000gn/T/2019_06-37-41.log1.6FVYRfcq
Log2 curl output is at /var/folders/39/l1557gl175s593l7zjj9kd640000gn/T/2019_06-37-41.log2.N73Mng1q
diff output is at /var/folders/39/l1557gl175s593l7zjj9kd640000gn/T/2019_06-37-41.difflog.DwaqbBgW
Diff file is not empty. Logs not equal
```

{{< figure src="~/Desktop/CleanShot 2019-09-22 at 07.41.53@2x.png" >}}


## Comparing logs for range 9998683 to 1000000 {#comparing-logs-for-range-9998683-to-1000000}

-   998683 is the beginning of the ossasepia log.

<!--listend-->

```shell
sh ~/temp/log-bash-curl-diff.sh "logs.ossasepia.com/log-raw/ossasepia" "logs.nosuchlabs.com/log-raw/ossasepia" "998683" "1000000"
```

```text
Lines > 500. Looping to split the range into batches.
Batches of 500 lines = 2. Remaining lines = 317
istart is 998683 and iend is 999182
istart is 999183 and iend is 999682
Last portion istart is 999683
Log1 curl output is at /var/folders/39/l1557gl175s593l7zjj9kd640000gn/T/2019_06-37-48.log1.dTY7wk3x
Log2 curl output is at /var/folders/39/l1557gl175s593l7zjj9kd640000gn/T/2019_06-37-48.log2.LXpNkbWa
diff output is at /var/folders/39/l1557gl175s593l7zjj9kd640000gn/T/2019_06-37-48.difflog.hKx9VdZf
Diff file is not empty. Logs not equal
```


## Concluding remarks {#concluding-remarks}

-   a neat little bash script is constructed which will retrieve content from 2 specified URL's and diff the output. Particularly, the script was constructed to compare the #o logs on logs.ossasepia.com and logs.nosuchlabs.com
-   functions, conditionals, loops, for bash were learned and deployed, along with using curl and diff.
-   Retrieving a large number of lines will take some time and is also dependent on the internet speed. The curl/diff files will be empty if the lines are non-existent.
-   Diff results of the logs from line 9998683 to 1000000 indicates there are no missing lines.
-   the `check_output` function only checks if the files are empty. It does not account for curl retrieving error messages.
-   In a batch retrieval - the final curl output is checked whether empty. It does not account for empty retrievals for a particular batch.
-   overflow/underflow is not accounted for in this script.


## References {#references}

-   [Unix SE discussion on making temporary files in bash](https://unix.stackexchange.com/questions/181937/how-create-a-temporary-file-in-shell-script)
-   [SO discussion on making temporary files in bash](https://stackoverflow.com/questions/10982911/creating-temporary-files-in-bash)
-   Some general references for the bash syntax used above.
