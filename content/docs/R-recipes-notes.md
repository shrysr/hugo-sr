+++
title = "R - Notes | Examples | Recipes"

date = 2018-09-09T00:00:00
# lastmod = 2018-12-21T00:00:00

draft = false  # Is this a draft? true/false
toc = true  # Show table of contents? true/false
type = "docs"  # Do not modify.

# Add menu entry to sidebar.
linktitle = "Notes & Examples"
[menu.docs]
  parent = "R"
  weight = 1
+++



<a id="org59114ad"></a>

# Introduction

This project contains notes and recipes in R, especially pertaining to data science. The purpose is to have a handy reference to refresh concepts / syntax via examples and also share the functions that I develop to streamline workflow. 


<a id="org0dfa1af"></a>

# References

-   Datacamp courses 
    -   [Quantitative Analyst career track in R](https://www.datacamp.com/tracks/quantitative-analyst-with-r)
    -   Tidyverse courses
-   [Edx :  HarvardX: PH125.1x Data Science: R Basics](https://courses.edx.org/courses/course-v1:HarvardX+PH125.1x+3T2017/course/)


<a id="org27361d4"></a>

# Notes


<a id="orgf25e803"></a>

## Rprofile and user files

-   `?Startup` in the R interpreter for information on how the R environment is started up.
-   Note that the Rprofile.site and other user files are not setup by default. These have to be created by the user.
-   The default CRAN repo can be set in the `Rprofile.site` file

To find the installation location of R, use the `R.home()` function with component specified as shown below. [More information](https://stat.ethz.ch/R-manual/R-devel/library/base/html/Rhome.html).  

    R.home(component='home')
    R.home(component='etc')


<a id="orga9ba3f6"></a>

## Importing data into R

packages : readr, haven, 


<a id="org2187937"></a>

## Indexing in R

Indexing in R starts with 1, unlike most other languages.


<a id="org6ace875"></a>

## Workspace

The workspace contains all the variables that were used in a particular session. 

`ls()` can be used to list the variables in the workspace.


<a id="orgf7d9368"></a>

## Matrix


<a id="orge4c2151"></a>

### Defining a matrix

A matrix is a collection of elements of the same data type (numeric, character, or logical) arranged into a fixed number of rows and columns. 

A matrix is called two-dimensional, since there are rows and columns. It is constructed using the `matrix()` function.

Arguments:

-   Elements of the matrix
-   `byrow` to have the matrix filled by rows. By default, this is set to false.
-   `nrow` for number of rows

    matrix(1:10,byrow = TRUE, nrow = 4)

Demonstrating the difference of not using `byrow`

    matrix(1:10, ncol = 2, nrow = 5)

    matrix(1:10, ncol = 2, nrow= 5 , byrow = TRUE)


<a id="org2723272"></a>

### Naming the rows and the columns

`rownames()` and `colnames()` can be used. 

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


<a id="org94a4667"></a>

### Sums - `=rowSums()` and `colSums()`, adding rows - `rbind()` and columns - `cbind()`

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


<a id="orgb1ebdc1"></a>

### correlation : `cor()`

Correlation is a measure of association between different quantities. 

+1 : perfectly positive linear relationship
-1 : perfectly negative linear relationship
0  : No linear relationship

A matrix can be passed into `cor()` to get a correlation matrix. For example, this is most useful with 3 or more stocks. 

    # Defining imaginary stock prices
    apple <- c(22.45, 33, 41, 21, 25.67)
    micr <- c(12.4, 56.4, 32.4, 21, 24.45) 
    huawei  <- c(23.5, 44, 12.25, 39, 56)
    
    # Creating a matrix, calculations and plotting the correlation.
    app_micr_cor <- cor(cbind(apple, micr))
    app_micr_huaw_cor <- cor(cbind(apple, micr, huawei))
    app_micr_huaw_cor
    plot(app_micr_huaw_cor)
    plot(app_micr_cor)

1.  TODO Find out more information about manual correlation calculations


<a id="org95a7297"></a>

## Dataframe

Used to store a table of data. Multiple data types can be stored in a single dataframe. A matrix can store only a single data type. 

-   Defined using `data.frame()`
-   `colnames()` : to rename the columns in a dataframe
-   `subset()` : to extract a particular subset of a dataframe. Compared to calling a column name, using this is more informative or robust.
    -   first argument: name of the dataframe
    -   2nd argument: the condition or the column name within the dataframe
-   A column can be deleted by assigning it NULL
-   There is no need to use a `c()` to add multiple objects to the dataframe. Directly add the vectors like `data.frame(variable 1, variable 2)` and so on.


<a id="org3f152aa"></a>

### TODO Dataframe peek function in R

    head()
    tail()
    str()
    desc()
    glimpse()


<a id="orga55585a"></a>

## Factors

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

    ranking <- c(1:20)
    head(ranking)
    buckets <- c(0, 5, 10, 15, 20)
    ranking_grouped <- cut(ranking, breaks = buckets)
    head(ranking_grouped)
    ranking_grouped


<a id="orga0e7b3a"></a>

## Lists

-   Use the `list()` with the chosen data structures as the arguments. The list can contain multiple types of objects or data types.
-   Subsetting: using a `[]` returns a subset of the list and using `[[]]` returns the data inside the list being referenced.
    -   A subset can be used on a dateframe to extract specific data.
    -   Syntax example: `subset(dataframe, column1 > condition1 & column2 < condition2)`
-   The elements of the list can be named, by adding the to the arguments while defining the list.
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
-   


<a id="orgcef936d"></a>

## Dates

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


<a id="org3c723da"></a>

## TODO Analysing distributions

-   `runif()` r-unif, used to generate a random number between specified min, max.


<a id="orgdd369df"></a>

## `glimpse()` - part of dplyr

To view all the columns. 


<a id="org9db58d3"></a>

## Summary statistics

-   skimr package : also lists missing and unique values
-   skim(object)


<a id="orgc859058"></a>

## Changing the class of an object

The class of an object can be changed by simply assigning the desired type of class. The `class()` is used.

    # Example changing the clas of a date object to a numeric
    dateX <- as.Date("2030-02-20")
    class(dateX)
    class(dateX) <- "Numeric"
    class(dateX)

-   =class(obj) <- "Date"


<a id="orgba8c681"></a>

## Relational operators

-   TRUE coerces to 1 and FALSE to 0
-   In case of strings and using the greater / lesser than operator, the first letter is considered, in the alphabetical order

    T == 1
    T == 0
    F == 1 
    F == 0
    "useR" == "user"
    "user" == "User"
    "useR" > "user"
    "user" > "User"


<a id="orga288f21"></a>

## Conditional Statements

-   `ifelse()`: conditional function in a single line that can work on entire vectors, compared to the typical `if()` operator.
    -   `ifelse()` strips the date of its attribute before returning it and therefore the date often becomes a numeric.
    -


<a id="orgd15ec97"></a>

## Finance related


<a id="org8704587"></a>

### Present value

General formula : present\_value <- cash\_flow \* (1 + interest / 100) ^ -year


<a id="orgb25455b"></a>

### Bond Credit ratings are a good example of factors.

-   Bond credit ratings are common in the fixed income side of the finance world as a simple measure of how "risky" a certain bond might be.
-   riskiness can be defined as the probability of default, which means an inability to pay back your debts.
-   Example of Standard and Poor's credit rating AAA, AA, A, BBB, BB, B, CCC, CC, C, D. (Left to right: Least risky to most risky)


<a id="org614fda6"></a>

### Dates in Finance could be at the rate of years or in micro seconds.


<a id="orgc5b331d"></a>

### There will be a likely need to convert multiple dates from the character to string format.


<a id="orgbf8f732"></a>

## Playground

    linkedin <- c(16, 9, 13, 5, 2, 17, 14)
    last <- tail(linkedin, 3) 
    print(last)
    head <- head(linkedin, 3)
    print(head)

    x <- 5
    y <- 7
    !(!(x < 4) & !!!(y > 12))

