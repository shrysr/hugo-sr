#!bin/bash

curl "http://logs.ossasepia.com/log-raw/ossasepia?istart=1000000&iend=1000400" > ~/temp/log-test.txt

curl "http://logs.nosuchlabs.com/log-raw/ossasepia?istart=1000000&iend=1000400" > ~/temp/log2-test.txt

diff -uNr ~/temp/log-test.txt ~/temp/log2-test.txt > ~/temp/hololo.txt

#!bin/bash
urlPrefix1="logs.ossasepia.com/log-raw/ossasepia"
urlPrefix2="logs.nosuchlabs.com/log-raw/ossasepia"
startid=1001700
endid=1001900

curl "${urlPrefix1}?istart=${startid}&iend=${endid}" > ~/temp/log-test.txt

curl "${urlPrefix2}?istart=${startid}&iend=${endid}" > ~/temp/log2-test.txt

diff -uNr ~/temp/log-test.txt ~/temp/log2-test.txt > ~/temp/log-diff.txt

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

sh ~/temp/log-bash-curl-diff.sh "logs.ossasepia.com/log-raw/ossasepia" "logs.nosuchlabs.com/log-raw/ossasepia" 1001900 1003700

sh ~/temp/log-bash-curl-diff.sh "logs.ossasepia.com/log-raw/ossasepia" "logs.nosuchlabs.com/log-raw/ossasepia" "998683" "1000000"
