+++
title = "R notes and snippets"
author = ["Shreyas Ragavan"]
lastmod = 2019-07-10T14:02:06-06:00
tags = ["R", "Data-Science"]
categories = ["R", "Data-Science"]
draft = false
linktitle = "R - Notes"
toc = true
[menu.docs]
  identifier = "r-notes-and-snippets"
  weight = 2002
+++

## Lubridate {#lubridate}

Lubridate: dates and time made easy [link](https://vita.had.co.nz/papers/lubridate.pdf).
This paper (Grolemund and Wickham) offers a good introduction and comparison between using lubridate and not using it, as well as several examples of using the library. It also offers some case studies which can serve as useful drill exercises.


## Importing multiple excel sheet from multiple excel files {#importing-multiple-excel-sheet-from-multiple-excel-files}

This is one approach to importing multiple sheets from multiple excel files into a list of tibbles. The goal is that each sheet is imported as a separate tibble.

Loading the libraries:
While you may have the tidyverse package installed, this approach uses the  package `rio` ( ).

```R
## install the rio library.
## Rio  makes data import a little easier for different file types.

## install.packages("rio")
library("rio")
library("tidyverse")

```

User input for the path. This basically points towards a folder which presumably contains multiple excel files.

```R
## Note that patterns can be provided as an argument to filter file types.
folder_path <- c("~/temp/bsu_test/")
```

The information in the directory can be gleaned with the `fs::dir_info` function, and from this the path variable can be pulled which will contain the paths to the excel files found.

```R
excel_paths_tbl <- fs::dir_info(folder_path)

paths_chr <- excel_paths_tbl %>%
  pull(path)
```

-   `import_list()` from the `rio` package is used and the class is set to tibble using the argument `tbl`.

-   An anonymous function is used to map the paths and apply the `import_list` function on each path.

-   For example: assuming that there were 2 Nos. excel files in the specified directory; = the map function creates 2 lists containing 2 tibbles each. Each tibble represents an excel sheet from the file.

-   The  final `combine()` function combines these 2 Nos. lists into a single list of 4 tibbles, each being a sheet in the excel file.

```R
excel_data <- paths_chr %>%
map(~ import_list(. , setclass = "tbl")) %>%
combine()

glimpse(excel_data)
```


#### References {#references}

1.  BSU Course DSB-101-R
2.  I learnt about the `Rio` package in this [Stack Overflow discussion](https://stackoverflow.com/questions/12945687/read-all-worksheets-in-an-excel-workbook-into-an-r-list-with-data-frames)


## <span class="org-todo todo TODO">TODO</span> Data Explorer package {#data-explorer-package}

The DataExplorer package aims to have tools for EDA, Feature engineering and Data reporting. It is handy to get quick overview of the data from multiple perspectives.

Installation

```R
install.packges("DataExplorer")
```

Salient points:

1.  A list of data frames can be provided as the input.
2.  `plot_str` : display a graphic networking the various variables, their types and the list of data frames. This is displayed in the browser. The `type = "r"` argument can be used for a radial network.
3.  `introduce` : provides a table of numbers rather than percentages, like the number of rows, columns, missing data and so on.
4.  `plot_intro` : Visualises the output of `introduce`.
5.  `plot_missing` : useful to know the percentage of missing values in each feature.
6.


## Devtools package {#devtools-package}

> ...devtools package, which is the public face for a suite of R functions that automate common development tasks.
>
> [R Packages (book)](https://r-pkgs.org/intro.html)

Official details of package development : [link](https://cran.r-project.org/doc/manuals/R-exts.html#Creating-R-packages)


## Basic libraries to aid package development {#basic-libraries-to-aid-package-development}

```R
install.packages(c("devtools", "roxygen2", "testthat", "knitr"))
```


## Visdat : preprocessing visualisation [link](http://visdat.njtierney.com/) {#visdat-preprocessing-visualisation-link}

This package could be very useful in exploring new data or looking at how the data is changing after a wrangling operation. It could save repeatedly looking at the CSV file manually to make sure the change is implemented.

Installing Visdat

```R
library("easypackages")
packages("visdat")
```

Main Functions:

```text
vis_dat
vis_miss
vis_compare
vis_expect
vis_cor
vis_guess
```

General Exploration

Note: `typical_data` is a dataset that is included with the package and is useful to explore the functions.

```R
libraries("tidyverse", "visdat")
vis_dat(typical_data)
vis_miss(typical_data)
```

Clustering the missing data in the columns

```R
vis_miss(typical_data,
         cluster =  TRUE)

```


## Long <-> Wide formats : example for gathering {#long-wide-formats-example-for-gathering}

```R
library("tidyverse")

## Defining a sample tribble with several duplicates
a <- tribble(
    ~IDS, ~"client id 1", ~"client id 2", ~"client id 3", ~"client id 4", ~"old app", ~"new app",
    123, 767, 888,"" , "", "yes" , "no",
    222, 333, 455, 55, 677, "no", "yes",
    222, 333, 343, 55,677, "no", "yes"
)


## Defining vector to form column names
vec1 <- seq(1:4)
vec2 <- "client id"
vec3 <- str_glue("{vec2} {vec1}")

## Gathering and removing duplicates
a %>%
    gather(
        key = "Client number",
        value = "client ID",
        vec3
    ) %>%
    unique()
```


## Matrix {#matrix}


### Defining a matrix {#defining-a-matrix}

A matrix is a collection of elements of the same data type (numeric, character, or logical) arranged into a fixed number of rows and columns.

A matrix is called two-dimensional, since there are rows and columns. It is constructed using the `matrix()` function.

Arguments:

-   Elements of the matrix
-   `byrow` to have the matrix filled by rows. By default, this is set to false.
-   `nrow` for number of rows

```R
matrix(1:10,byrow = TRUE, nrow = 4)
```

Demonstrating the difference of not using `byrow`

```R
matrix(1:10, ncol = 2, nrow = 5)
```

```R
matrix(1:10, ncol = 2, nrow= 5 , byrow = TRUE)
```


### Naming the rows and the columns {#naming-the-rows-and-the-columns}

`rownames()` and `colnames()` can be used.

```R
#Defining the row data
row_1 <- c(250, 300)
row_2 <- c(55, 350)

# Defining the matrix
my_matrix <- matrix(c(row_1, row_2), byrow = TRUE, nrow = 2)

# Defining row and column names
my_rownames <- c("test_row1", "test_row2")
my_colnames <- c("test_col1", "test_col2")

# Attaching row and column names to the created matrix
rownames(my_matrix) <- my_rownames
colnames(my_matrix) <- my_colnames

my_matrix

```


### Sums - `rowSums()` and `colSums()`, adding rows - `rbind()` and columns - `cbind()` {#sums-rowsums-and-colsums-adding-rows-rbind-and-columns-cbind}

```R
my_rowsums <-  rowSums(my_matrix)

# Adding a new column of the calculated sums
my_new_matrix <- cbind(my_matrix, my_rowsums)
my_new_matrix

# Adding a new row and calculating the sums again
row_3 <- c(200, 100 )
my_newest_matrix <- rbind(my_matrix, row_3)
my_new_rowsums <- rowSums(my_newest_matrix)
my_newest_matrix <- cbind(my_newest_matrix, my_new_rowsums)

my_newest_matrix
```


## Dates {#dates}

-   The ISO 8601 format is the way R accepts and stores dates. This is basically in the yyyy-mm-dd format. Internally stored by R as the number of days since January 1, 1970.
-   Alternative format year/month/day
-   Dates are internally stored as numerics with some special characteristics over typical numerics.
-   Current time from the system : `Sys.time()`
-   Current date from the system : `Sys.Date()`
-   Character vectors are most common source of creating dates.
-   class of dates
    -   could be a `date` class catering to calendar dates.
    -   could also be a POSIX - Portable Operating System Interface class, which is commonly used in the finance world
        -   POSIXlt and POSIXct allow holding a date.
        -   POSIXct is a way to represent datetime objects like "2015-01-22 08:39:40 EST". This method is important for storing intraday financial data.
    -   Using the simplest date class is generally the best strategy.
    -   There are other classes of date as well.
-   `as.date()` can be used to convert the object to a date class.
    -   the `format` argument can facilitate conversion from different formats to the necessary ISO format.
-   Extractor functions
    -   `weekdays()` can be used to extract the day of the week from a date object.
    -   `format()` can be used to convert existing date objects to different date formats.
    -   `months()` for extracting the months of the date objects
    -   `quarters()` to extract the quarter in which the date object falls
-   Dates can be subtracted, just like numerics.
    -   The object must be in the Date format. Direct subtraction provides the difference in days.
    -   `difftime(date1, date2, units = "secs")` can be used to find the difference in time, with the argument units specifying the output type
        -   Argument `units` should be one of “auto”, “secs”, “mins”, “hours”, “days”, “weeks”
        -   The 2nd argument `date2`, will be subtracted from the first argument `date1`.
-   Formats of representing alternate date formats
    -   Y: 4-digit year (1982)
    -   y: 2-digit year (82)
    -   m: 2-digit month (01)
    -   d: 2-digit day of the month (13)
    -   A: weekday (Wednesday)
    -   a: abbreviated weekday (Wed)
    -   B: month (January)
    -   b: abbreviated month (Jan)

```R
# Using the system date and time
todays_date <- Sys.Date()
todays_time <- Sys.time()
todays_date
todays_time

# Class of defined date and time
class(todays_date)
class(todays_time)

# Reading alternate formats of dates
test_date_alt_format <- "23/02/2019"
as.Date(test_date_alt_format, format = "%d/%m/%Y")

test2_date_alt_format <- "Sep 25,2020"
as.Date(test2_date_alt_format, format = "%B %d,%Y")

# Extractor functions
weekdays(as.Date(test2_date_alt_format, format = "%B %d,%Y"))

# Subtracting dates
date1 <- as.Date("2030-02-20")
date2 <- as.Date("2040-03-30")
date2 - date1
difftime(date2, date1, units = 'secs')
difftime(date1, date2, units = 'mins')

# Setting the weekdays as names()
dates3 <- c(date1, date2, as.Date(c("2025-03-23", "2015-04-25")))
names(dates3) <- weekdays(dates3)
dates3

# Syntax example of using Not (relational operators)
a <- c(100,140,2,240, 300)
# checking where a is Not greater than 200
!(a > 200)

# Testing runif()

```


## Vectors {#vectors}

-   One dimensional collection of data.
-   vectors need to contain a similar data type. To combine multiple data types, a data frame type object or a list is required.
-   `length()` can be used with numeric type vectors to find the length of the vector. However the `nchar()` function should be used for character type vectors (using `length()` will provide an answer of 1)
-   A single number is also stored as a vector of length 1.

```R
a <- c("This is a character type vector", "which contains 2 strings")
a
length(a) # the result will be 2 because there are 2 elements
nchar(a)  # Actual number of characters in each string

```


## Vectorised functions {#vectorised-functions}

Most functions in R are vectorised. The function will apply itself to each element of a vector. This concept is important to understand especially while progressing onto tidyeval style Functions.

Example of multiple substitutions with the assignment operator which is a  vectorised function.

```R
languages <- c("English", "Italian", "Urdu")
print(languages)
languages[c(2,3)] <- c("Norwegian", "Latin")
print(languages)
```


## Lists {#lists}

-   The list is a one dimensional collection of data, like a vector.
-   The list data type is equivalent to the dictionary data type in Python.
-   Use the `list()` with the chosen data structures as the arguments. The list can contain multiple types of objects or data types.
-   Lists are used to create Dataframes.

```R
                                        # Creating a simple list of 4 elements, name, age, height, horn.sizre

my.list <- list(
  name = "Shreyas",
  age = 776,
  height = 167,
  horn.size = 25
)

my.list
                                        # the tag names can be extracted using the names()
names(my.list)
```

-   Subsetting: using a `[]` returns a subset of the list and using `[[]]` returns the data inside the list being referenced.
    -   A single bracket always means to filter a location. list[<index>] is actually a filtered list.
    -   Single brackets return a list and Double brackets return the element itself.
    -   A subset can be used on a dateframe to extract specific data.
    -   Syntax example with conditionals: `subset(dataframe, column1 > condition1 & column2 < condition2)`
-   The elements of the list can be named, by adding the element to the arguments while defining the list.
-   adding names to an existing list can be done using the `names(list name)` function.
-   With a named list, the `$` operator can also be used to access specific list items.
-   items can be added to the list using `c()`, which would look like `c(list_name, new_item_name = item_name)`
-   Removing elements from a list can be done by assigning the item the NULL value.
-   Other list creating functions
    -   `split()` : `split(list-name, item-name)`. This will create 2 lists separated by the item name specified.
    -   `unsplit()` : to unsplit a list. `unsplit(split-list-name, grouping)` Similar syntax to the above.
    -   split-apply-combine class of problems. Example is where a particular factor is to be applied for a portion of the data and another factor for the other portion, and after which the 2 portions are recombined. For eg: offering customer A a discount of 10% and customer B a discount of 20% via splitting and them recombining the split parts into a common dataframe.
-   `attributes()`: meta data of an object. For example the dim or dimension is an attribute of a matrix, and the names, row.names and class are common attributes of a dataframe.
    -   use `attr()` to access a specific attribute. This takes 2 arguments at least. `attr(matrix_name, which = "desired attribute")`
-   Applying functions to lists
    -   `lapply` is for lists.
    -   `sapply` : simplified apply works well with Vectors.

```R
people <- c("shreyas", "tom", "harry")
lapply(people, toupper)
                                        # the first argument is the list and the 2nd argument is the function. Additional arguments to the function can also be supplied. This returns a new list and the old list remains unmodified.
lapply(people, paste, "hello")
people
```

Examples using lapply and other list and vector Manipulation

```R
                                        # Creating vectors of meals  and meal items

breakfast <- c("eggs", "bread", "orange juice")
lunch <- c("pasta", "coffee")
meals <- list(breakfast = breakfast, lunch =  lunch)
meals
meals <- c(meals, list(dinner = c("noodles", "bread")))
meals
names(meals)

                                        # Extracting dinner
dinner <- meals$dinner

                                        # Adding earlier meals to a separate list
early_meals <- c(meals["breakfast"], meals["lunch"])
early_meals

                                        # Finding the number of items in each meal.
number_items_meal <- lapply(meals , length)
number_items_meal

                                        # Write a function `add_pizza` that adds pizza to a given meal vector, and  returns the pizza-fied vector
add_pizza <- function(vector, string = "pizza") {
  pizzafied <- paste(vector, string, sep = "-")
  return(pizzafied)
  }

add_pizza(breakfast)

                                        # Create a vector `better_meals` that is all your meals, but with pizza!
updated_meals <- c(add_pizza(breakfast),
                   add_pizza(lunch),
                   add_pizza(dinner)
                   )
updated_meals

```


## Factors {#factors}

-   `factor()` can be used to store the unique levels of a vector.
    -   The vector to be converted to a factor is passed in as an argument.
-   `levels()` can be used to access the unique levels of a factor object.
    -   Rename the levels by just passing a vector `levels(factor_object)`
-   `cut()` can be used to break up a vector into specified buckets or based on specified intervals.
    -   argument 'breaks' to specify the demarcations in which the vector will be cut up.
    -   R treats the left side of the bucket as exclusive and the right side of the bucket as inclusive. This is represented by '(' and ']'.
-   `summary()` can be used to provide the counts of items under each factor. This is best used on a factor object.
-   Ordering and sub-setting vectors
    -   `ordered()` : R has an inbuilt system to order the object alphabetically.
    -   passing the `levels` argument to `factor()` along with the argument `ordered = T`, with levels containing the desired order (written as least to greatest) will enable a custom ordering of factors.
    -   `drop = T` argument to drop a level completely. Subsetting with [-1] only drops the object at the first position, but retains the level.
    -   R's default behavior when creating data frames is to convert all characters into factors


### Working with categorical data: {#working-with-categorical-data}

-   `forcats::as_factor()` : assigns factor values based on order in the vector
-   `base::as.factor()` : uses an alphabetical order. Assigns factor order based on the alphabetical order

```R
ranking <- c(1:20)
head(ranking)
buckets <- c(0, 5, 10, 15, 20)
ranking_grouped <- cut(ranking, breaks = buckets)
head(ranking_grouped)
ranking_grouped
```


## Dataframe {#dataframe}

Used to store a table of data. Multiple data types can be stored in a single dataframe. A matrix can store only a single data type.

-   Defined using `data.frame()`
-   `colnames()` : to rename the columns in a dataframe
-   `subset()` : to extract a particular subset of a dataframe. Compared to calling a column name, using this is more informative or robust.
    -   first argument: name of the dataframe
    -   2nd argument: the condition or the column name within the dataframe
-   A column can be deleted by assigning it NULL
-   There is no need to use a `c()` to add multiple objects to the dataframe. Directly add the vectors like `data.frame(variable 1, variable 2)` and so on.


### <span class="org-todo todo TODO">TODO</span> Dataframe peek function in R {#dataframe-peek-function-in-r}

```R
head()
tail()
str()
desc()
glimpse()
```


## Package installation (especially for data science and ML) {#package-installation--especially-for-data-science-and-ml}

The package `easypackages` enables quickly loading or installing multiple libraries. This snippet will enable installing multiple packages. In general, it is better to install packages one by one. They can however be called together.

```R
install.packages("easypackages")
library("easypackages")
packages("tidyverse", "tidyquant", "glmnet", "rpart", "rpart.plot", "ranger", "randomForest", "xgboost", "kernlab", "visdat")
```


## Basic Statistics concepts {#basic-statistics-concepts}


### Median {#median}

```R
##' Source: Conway, Drew; White, John Myles. Machine Learning for Hackers: Case Studies and Algorithms to Get You Started (p. 39). O'Reilly Media. Kindle Edition.
##' Additional comments are my own.
##' Function to illustrate how a median is calculated for odd and even datasets

my.median  <- function(x){
                                        # Step 1:  Sort x ascending or descending
  sorted.x  <-  sort(x)
                                        # Find the length of x whether (odd number of digits or even). If odd : there are 2 medians. If even: there is a single median.
  if(length(x) %% 2 != 0){
    indices  <- c(length(x)/2 , length(x)/2 +1)
                                        # These numbers are used as indices for the initially sorted vector to return the exact median.
    return(mean(sorted.x[indices]))
}
else {
  index  <- ceiling(length(x)/2)
  return(sorted.x[index])
}

```


### Quantile {#quantile}

```R
                                        # Defining a sample of numbers to calculate quantile.
a  <- c(seq(from = 1, to = 30), seq(from = 40, to = 50, by = 0.2))
quantile(a)

                                        # Defining bins or cuts for quantile. The default is 0.25.
quantile(a, probs =  seq(0,1,by = 0.2))
```


## `promptData()` : generate shell documentation of dataset {#promptdata-generate-shell-documentation-of-dataset}

If the filename argument is given as "NA", the output will provide lists of the information. If no filename is specified, then an .Rd file will be created in the same working directory.

```R
promptData(sunspots, filename = NA)
```


## Downloading a file to specific location {#downloading-a-file-to-specific-location}

With wget : -P is the flag for the prefix directory for the file being downloaded. The path will be created if it does not exist. If the file already exists, a duplicate will be created with the '.1' suffix. Since this is a string being passed to wger, the " and other characters have to be explicitly escaped.

```R
## Download file to specific location
system("wget \"https://raw.githubusercontent.com/amrrs/sample_revenue_dashboard_shiny/master/recommendation.csv\" -P ./sales-rev-app/")
```


## Removing user installed packages alone {#removing-user-installed-packages-alone}

Sometimes, it is not possible to remove R completely. This is a nice snippet from an [R-bloggers post](https://www.r-bloggers.com/how-to-remove-all-user-installed-packages-in-r/) to remove the user installed packages alone.

```R
# create a list of all installed packages
 ip <- as.data.frame(installed.packages())
 head(ip)
# if you use MRO, make sure that no packages in this library will be removed
 ip <- subset(ip, !grepl("MRO", ip$LibPath))
# we don't want to remove base or recommended packages either\
 ip <- ip[!(ip[,"Priority"] %in% c("base", "recommended")),]
# determine the library where the packages are installed
 path.lib <- unique(ip$LibPath)
# create a vector with all the names of the packages you want to remove
 pkgs.to.remove <- ip[,1]
 head(pkgs.to.remove)
# remove the packages
 sapply(pkgs.to.remove, remove.packages, lib = path.lib)
```


## Rprofile and user files {#rprofile-and-user-files}

-   `?Startup` in the R interpreter for information on how the R environment is started up.
-   Note that the Rprofile.site and other user files are not setup by default. These have to be created by the user.
-   The default CRAN repo can be set in the `Rprofile.site` file

To find the installation location of R, use the `R.home()` function with component specified as shown below. [More information](https://stat.ethz.ch/R-manual/R-devel/library/base/html/Rhome.html).

```R
R.home(component='home')
R.home(component='etc')
```


## Jupytext for conversion to Rmd {#jupytext-for-conversion-to-rmd}

> Jupytext can save Jupyter notebooks as:
>
> -   Markdown and R Markdown Documents,
> -   Julia, Python, R, Bash, Scheme, Clojure, Matlab, Octave, C++ and q/kdb+ scripts.
>
> [Jupytext package](https://github.com/mwouts/jupytext)

The is a convenient tool to convert the jupyter notebook into multiple formats, and it also enables collaboration across documents.

Installing Jupytext using conda:

```shell
conda install -c conda-forge jupytext
```

My most common usage of this tool is to convert jupyter notebooks (.ipynb) to Rmarkdown(Rmd). Deploying jupytext as a Library of Babel(LOB) Ingest makes it easy to be called from anywhere in Emacs.

<a id="code-snippet--jupytext-ipynb-rmd"></a>
```shell
jupytext $jup_notebook --to rmarkdown
```


## Package installation (especially for data science and ML) {#package-installation--especially-for-data-science-and-ml}

The package `easypackages` enables quickly loading or installing multiple libraries. This snippet will enable installing multiple packages. In general, it is better to install packages one by one. They can however be called together.

```R
install.packages("easypackages", )
library("easypackages")
packages("tidyverse", "tidyquant", "glmnet", "rpart", "rpart.plot", "ranger", "randomForest", "xgboost", "kernlab")
```


## Installing the R kernel for Jupyter notebooks {#installing-the-r-kernel-for-jupyter-notebooks}

Reference: [link](https://github.com/IRkernel/IRkernel)

The easiest way for me to export org files to a notebook format will be using the Ipython notebook export available in Scimax. Installing the R kernel for Jupyter notebooks is as simple as installing an R package:

```R
install.packages('IRkernel')
```

To register the kernel in the current R installation:

```R
IRKernel::installspec()
```

Per default IRkernel::installspec() will install a kernel with the name “ir” and a display name of “R”. For having multiple versions of R available as  kernels:

```R
# in R 3.3
IRkernel::installspec(name = 'ir33', displayname = 'R 3.3')
# in R 3.2
IRkernel::installspec(name = 'ir32', displayname = 'R 3.2')
```

It is possible to install the IRKernel package via Docker.

Note: Some additional packages may be required before installing IRKernel. Try the following:

```R
install.packages(c('repr', 'IRdisplay', 'evaluate', 'crayon', 'pbdZMQ', 'devtools', 'uuid', 'digest'))
devtools::install_github('IRkernel/IRkernel')
```


## Troubleshooting with R version. {#troubleshooting-with-r-version-dot}

-   finding the R version being used is as simple as typing in version on the R console
-   the shell command which R can also be used to find the path from R is being loaded.
-   anaconda installs earlier versions of R. This has to be removed completely, so that a single version of R is accesed by R studio and R console and within Emacs as well.
-   in my case, differing versions 3.4 and 3.5 of R were being accessed, which made package installation difficult.
-   therefore, I uninstalled the older conda version and then downloaded the R pkg from CRAN as a fresh install on the mac.
-   it is possible to set the default R version for the inferior ESS shell in Emacs as specified here [link](https://stackoverflow.com/questions/12574738/how-can-i-specify-the-r-version-opened-by-ess-session-in-emacs)

```R
version
```

```sh
which R
```


## How an R session starts {#how-an-r-session-starts}

Source: <https://stat.ethz.ch/R-manual/R-devel/library/base/html/Startup.html>


## Upgrading packages in R (R session) {#upgrading-packages-in-r--r-session}

Source: [Arch wiki](https://wiki.archlinux.org/index.php/R)
When you also need to rebuild packages which were built for an older version:

```R
update.packages(ask=FALSE,checkBuilt=TRUE)
```

when you also need to select a specific mirror (<https://cran.r-project.org/mirrors.html>) to download the packages from (changing the url as needed):

```R
update.packages(ask=FALSE,checkBuilt=TRUE,repos="https://cran.cnr.berkeley.edu/")
```

You can use Rscript, which comes with r to update packages from a Shell:

```sh
Rscript -e "update.packages()"
```


## Installing R on Debian {#installing-r-on-debian}

```shell
sudo cat >> /etc/apt/sources.list << EOF
# adding mirror for installation of R
deb http://cran.rstudio.com/bin/linux/debian stretch-cran34/
EOF

sudo apt-get update
```

Using Debian's GPG Key

```shell
sudo apt install dirmngr
sudo apt-key adv --keyserver keys.gnupg.net --recv-key 'E19F5F87128899B192B1A2C2AD5F960A256A04AF'
```

Installing r-Base

```shell
sudo apt-get install r-base
```

Some pre-requisite libraries are required for installing various R Packages

```shell
sudo apt-get install libcurl4-openssl-dev
```
