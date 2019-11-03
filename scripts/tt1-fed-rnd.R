                                        # Loading libraries
                                        # install.packages("easypackages")
library("easypackages")
libraries("tidyverse", "tidyquant", "DataExplorer")

                                        # Reading in data directly from github
climate_spend_raw  <- readr::read_csv("https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2019/2019-02-12/climate_spending.csv", col_types = "cin")

climate_spend_raw$department %>% unique()
climate_spend_raw$year %>% unique()

##plot_str(climate_spend_raw, type = 'r')
plot_intro(climate_spend_raw)
##introduce(climate_spend_raw)

variance_climate_spend <- plot_boxplot(climate_spend_raw, by = "year")

climate_spend_conditioned <- climate_spend_raw %>%
  mutate(year_dt = str_glue("{year}-01-01")) %>%
  mutate(year_dt = as.Date(year_dt)) %>%
  mutate(test_median = median(gcc_spending)) %>%
  mutate(gcc_spending_txt = scales::dollar(gcc_spending,
                                           scale = 1e-09,
                                           suffix = "B"
                                           )
         )

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

climate_spend_conditioned %>%
  select(-c(gcc_spending_txt, year_dt)) %>%
  group_by(department) %>%
  summarise(total_spend_y = sum(gcc_spending)) %>%
  arrange(desc(total_spend_y)) %>%
  mutate(total_spend_y = total_spend_y %>% scales::dollar(scale = 1e-09,
                                                        suffix = "B",
                                                        prefix = "$")
       )

climate_spend_plt_fn <- function(
                                 data,
                                 y_range_low = 2000,
                                 y_range_hi  = 2010,
                                 ncol = 3,
                                 caption = ""
                                 )
{

  plot_title  <- str_glue("Federal R&D budget towards Climate Change: {y_range_low}-{y_range_hi}")

  data %>%
  filter(year_dt >= y_range_low & year_dt <= y_range_hi) %>%
  ggplot(aes(y = tot_spend_dept_y_txt, x = department, fill = department ))+
  geom_col() +
  facet_wrap(~ year_dt,
             ncol = 3,
             scales = "free_y"
             ) +
  #scale_y_continuous(breaks = scales::pretty_breaks(10)) +
  theme_tq() +
  scale_fill_tq(theme = "dark") +
  theme(
    axis.text.x = element_text(angle = 45,
                               hjust = 1.2),
    legend.position = "none",
    plot.background=element_rect(fill="#f7f7f7"),
    ) +
  labs(
    title = plot_title,
    x = "Department",
    y = "Total Budget $ Billion",
    subtitle = "NASA literally dwarfs all the other departments, getting to spend upwards of 1.1 Billion dollars every year since 2000.",
    caption = caption
  )

}

climate_spend_plt_fn(climate_spend_dept_y,
                     y_range_low = 2000,
                     y_range_hi = 2010,
                     caption = "#TidyTuesday:\nDataset 2019-02-12\nShreyas Ragavan"
                       )

climate_spend_plt_fn(climate_spend_dept_y,
                     y_range_low = 2011,
                     y_range_hi = 2017,
                     caption = "#TidyTuesday:\nDataset 2019-02-12\nShreyas Ragavan"
                       )

library(ggplot2)
diamonds2 <- subset(diamonds, !(cut == "Fair" & price > 5000))

my_breaks <- function(x) { if (max(x) < 6000) seq(0, 5000, 1000) else seq(0, 15000, 5000) }

ggplot(data = diamonds2, aes(x = carat, y = price)) +
  facet_wrap(~ cut, scales = "free_y") +
  geom_point() +
  scale_y_continuous(breaks = my_breaks)

All packages loaded successfully
