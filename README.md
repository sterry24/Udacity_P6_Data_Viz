THE INFORMATION IN THIS README FILE IS ALSO AVAILABLE FROM THE TABS AT THE BOTTOM OF THE HTML PAGE.

Summary:
For this project, I chose to create a data visualization of Airline
On-Time Statistics and Delay Causes (see Sources for link).  Using the available
Total Flights and Delayed Flights statistics for each airport, a Percent Delayed field
was created in the data so that airports can be compared by the percentage of the delayed
flights they have.

Design:
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

Feedback:
Reviewer #1:
The animation occurs too fast.
RESPONSE: Increased the delay between updates.
The link to the delay category definitions is not obvious.
RESPONSE: Changed the link from the entire chart title to only the "Delays by Category".
The pop-up dialog indicates no category data prior to 2003, but it is unclear if it was specific to 
a particular airport or all airports.
RESPONSE: Changed the dialog to indicate all airports.

Reviewer #2:
Nothing in visualization provides info on units.  Are these the number flights,
number of delays, or what?
RESPONSE: Added sub-title to indicate that we are looking at the percentage of flights delayed

Reviewer #3:
The link to the delay category definitions is not obvious.
RESPONSE: Changed the link from the entire chart title to only the "Delays by Category".
It would be nice to zoom into the map in areas where airports exist in close proximity to another.


Resources:
References Used:
Bar Chart:"http://alignedleft.com/tutorials/d3/making-a-bar-chart"

          "http://bl.ocks.org/michellechandra/0b2ce4923dc9b5809922"

Data Sources:
          Data for years 1987 - 2008: "http://stat-computing.org/dataexpo/2009/the-data.html"
          Data for years 2009 - 2016: "http://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time"

Code Sources:
          Colorbar: "https://github.com/bmschmidt/colorbar/blob/master/colorbar.js">
          Note that this file was downloaded and modified for this project.  It can be found in the js directory

          GeoJSON: "https://bitbucket.org/john2x/d3test/raw/2ce4dd5112448088fe357b8179d1088ef19524b8/d3/examples/data"
          Note that this file was downloaded and is available in the data directory of the repo.</p>
