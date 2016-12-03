THE INFORMATION IN THIS README FILE IS ALSO AVAILABLE FROM THE TABS AT THE BOTTOM OF THE HTML PAGE.

Summary:
For this project, I chose to create a data visualization of Airline
On-Time Statistics and Delay Causes (see Sources for link).  Using the available
Total Flights and Delayed Flights statistics for each airport, a Percent Delayed field
was created in the data so that airports can be compared by the percentage of the delayed
flights they have.

Design:
Original Design
The selected data all generates from the United States.  Therefore, I chose a map of only
the United States, and used the AlbersUSA projection so that Hawaii and Alaska would appear
closer to the continental states.

Airports are designated on the map as circles, since we have the latitude and longitude of
the airports.  The size and color of each circle is then mapped to the percent of delayed
flights for each airport.

A colorbar was added to assist viewers in identifying the
scale used for delayed flights: the closer to green the lower the percentge of delays,
and the closer to red the higher the percentage of delays.

A barchart was added to the visualization so that the categories of delays could be investigated
by users when they click on any airport (this data is only available for years after 2003).

After Review Design
The size of each circle has been changed to map to the ratio of total flights, not delayed flights. 
The coloring is still mapped to the percent of delayed flights.

The layout was changed so that the bar chart appeared next to the map when a circle was selected. 
This was a common review, in that users did not like scrolling up and down to see the map and the chart.

The bar chart was modified so that it would clear when years with no categorical data were selected.

Feedback:
Reviewer #1:

The animation occurs too fast.

Increased the delay between updates.

The link to the delay category definitions is not obvious.

Changed the link from the entire chart title to only the "Delays by Category".

The pop-up dialog indicates no category data prior to 2003, but it is unclear if it was specific to a particular airport or all airports.

Changed the dialog to indicate all airports.


Reviewer #2:

Nothing in visualization provides info on units. Are these the number flights, number of delays, or what?

Added sub-title to indicate that we are looking at the percentage of flights delayed

The circle colors (green through red) are kind of faded looking.

Changed the opacity of the circles

When selecting years before 2003, a pop-up warns "No delay type data for years before 2003." The graphic still shows the previous data, so there is an inconsistency.

Now plotting zeros for years with no data to clear the plot>

I don't like having to scroll down every time I want to see the breakdown by Delay Category. I would prefer to see a smaller graphic next to the map>

Changed size of graphs, and made them responsive to the page size.


Reviewer #3:

The link to the delay category definitions is not obvious.

Changed the link from the entire chart title to only the "Delays by Category".

It would be nice to zoom into the map in areas where airports exist in close proximity to another.


Reviewer #4:

It may be useful to know the total number of flights for each airport.

Added the total number of flights to mouse hover dialog.

For data before 2003, the plot should clear since no data is available for delay categories.

Now plotting zeros for years with no data to clear the plot.


Reviewer #5:

It would be nice if the page was responsive so that it could be viewed on multiple devices.

Changed the SVG's to be responsive to page size.


Reviewer #6:

The animation displays data over time, and the static chart displays the delay data for airports for one year. It would be nice to show the data for the selected airport over all years.

Added a line chart to include total flights and delayed flights for all years of the selected airport.

It would be nice if the circle size was related to the total flights and not the delayed flights>

Changed the radius of circles to look at total flights instead of delayed flights


Resources:
References Used:
Bar Chart:"http://alignedleft.com/tutorials/d3/making-a-bar-chart"

          "http://bl.ocks.org/michellechandra/0b2ce4923dc9b5809922"

Responsive SVG's: "http://eyeseast.github.io/visible-data/2013/08/26/responsive-d3"

Data Sources:
          Data for years 1987 - 2008: "http://stat-computing.org/dataexpo/2009/the-data.html"
          Data for years 2009 - 2016: "http://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time"

Code Sources:
          Colorbar: "https://github.com/bmschmidt/colorbar/blob/master/colorbar.js">
          Note that this file was downloaded and modified for this project.  It can be found in the js directory

          GeoJSON: "https://bitbucket.org/john2x/d3test/raw/2ce4dd5112448088fe357b8179d1088ef19524b8/d3/examples/data"
          Note that this file was downloaded and is available in the data directory of the repo.</p>

	  Legend: "http://bl.ocks.org/ZJONSSON/3918369"
          Note that this file was downloaded and is available in the js directory for this project.</p>