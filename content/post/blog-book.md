+++
title = "#Tidytuesday Project 1 - Federal R&D Spending on climate"
author = ["Shreyas Ragavan"]
date = 2019-11-01T13:51:00-06:00
lastmod = 2019-11-01T13:56:24-06:00
tags = ["R", "EDA", "ggplot", "TidyTuesday", "DataScience", "EDA"]
categories = ["R", "project", "EDA", "DataScience"]
draft = false
profile = false
+++

## Summary {#summary}

This is a short exploration into the tidy tuesday dataset that covers the federal R&D budget on climate change. It shows that NASA's budget dwarfs the money going into other departments.

-   [Github Repo](https://github.com/shrysr/sr-tidytuesday) of Tidy Tuesday explorations
-   Tidy tuesday dataset: [link](https://github.com/rfordatascience/tidytuesday/tree/master/data/2019/2019-02-12)
-   Data Dictionary [link](https://github.com/rfordatascience/tidytuesday/tree/master/data/2019/2019-02-12#data-dictionary)
-   Viz [posted on Twitter](https://twitter.com/ShreyasRagavan/status/1100765886892265472)
-   Tools used: ESS, Org mode


## Loading libraries {#loading-libraries}

The easypackages library is used, which allows quickly installing and loading multiple packages. Uncomment the first line if the library needs to be installed.

```R
                                        # Loading libraries
# install.packages("easypackages")
library("easypackages")
libraries("tidyverse", "tidyquant", "DataExplorer")
```


## Reading in the data {#reading-in-the-data}

The data can be read in directly from Github into memory.

```R
                                        # Reading in data directly from github
climate_spend_raw  <- readr::read_csv("https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2019/2019-02-12/climate_spending.csv", col_types = "cin")
head(climate_spend_raw)

```


## EDA : Exploring the data {#eda-exploring-the-data}

We have 6 department categories. Beyond some major categories, the remaining departments are lumped together as 'All Other'.

The data is available for the years 2000 to 2017.

The above can be easily found using the `unique` function.

```R
climate_spend_raw$department %>% unique()
climate_spend_raw$year %>% unique()
```

An overview of missing data can be easily scrutinised using the `plot_intro` command, and actual numbers can be extracted using `introduce`.

```R
#plot_str(climate_spend_raw, type = 'r')
plot_intro(climate_spend_raw)
introduce(climate_spend_raw)
```

There are no missing values or NA's.

```R
variance_climate_spend <- plot_boxplot(climate_spend_raw, by = "year")
class(variance_climate_spend)

```


## Notes on the data {#notes-on-the-data}

-   We have the following columns:
    -   name of the department. (chr)
    -   year (int)
    -   spending (double)
-   The data is relatively clean. However some manipulation is required to summarise the department wise spending.


## Data Conditioning {#data-conditioning}

-   This initial conditioning need not have involved the date manipulation, as the year extracted from a date object is still a double.

<!--listend-->

```R
climate_spend_conditioned <- climate_spend_raw %>%
  mutate(year_dt = str_glue("{year}-01-01")) %>%
  mutate(year_dt = as.Date(year_dt)) %>%
  mutate(gcc_spending_txt = scales::dollar(gcc_spending,
                                           scale = 1e-09,
                                           suffix = "B"
                                           )
         )
```

Applying some summary statistics to calculate the total spend per department, per year.

```R
                                        # Total spend per department per year
climate_spend_dept_y <- climate_spend_conditioned %>%
  group_by(department, year_dt = year(year_dt)) %>%
  summarise(
    tot_spend_dept_y = sum(gcc_spending)) %>%
  mutate(tot_spend_dept_y_txt = tot_spend_dept_y %>%
           scales::dollar(scale = 1e-09,
                          suffix = "B")
         ) %>%
  ungroup()
```


## Function to plot a facet grid of the department spending {#function-to-plot-a-facet-grid-of-the-department-spending}

By using a function to complete the plot, the plot can be easily repeated for any range of years. It can also work for a single year.

The function below takes the following arguments:

1.  The range of the years we want to look into , example 2005-2010
2.  The number of columns in the facet wrap plot.
3.  The caption that consititues the observation from the plots and anything else.

The title of the plot includes the year range that is input above.

```R
climate_spend_plt_fn <- function(
                               data,
                               y_range_low = 2000,
                               y_range_hi  = 2010,
                               ncol = 3,
                               caption = ""
                               )
{
  data %>%
    filter(year_dt >= y_range_low & year_dt <= y_range_hi) %>%
    ggplot(aes(y = tot_spend_dept_y_txt, x = department, fill = department ))+
    geom_col() +
    facet_wrap(~ year_dt,
               ncol = 3,
               scales = "free_y") +
    theme_tq() +
    scale_fill_tq(theme = "dark") +
    theme(
      axis.text.x = element_text(angle = 45,
                                 hjust = 1.2),
      legend.position = "none",
      plot.background=element_rect(fill="#f7f7f7"),
    )+
    labs(
      title = str_glue("Federal R&D budget towards Climate Change: {y_range_low}-{y_range_hi}"),
                       x = "Department",
                       y = "Total Budget $ Billion",
                       subtitle = "NASA literally dwarfs all the other departments, getting to spend upwards of 1.1 Billion dollars every year since 2000.",
                       caption = caption
    )

}
```

Calling the function and passing in the entire date (year) range of 2000-2010. Note that for a single year, have both the arguments `y_range_low` and `y_range_high` equal to the same year.

```R
climate_spend_plt_fn(climate_spend_dept_y,
                     y_range_low = 2000,
                     y_range_hi = 2017,
                     caption = "#TidyTuesday:\nDataset 2019-02-12\nShreyas Ragavan"
                       )
```
