This is a prototype, created with minimum input and maximum output in mind.

No time for setting up a proper myqsl database, a json-based local file system is used instead.
Heatmap is very basic and mostly based on a Google Maps example.
Requirements: nodejs 14+.

Note: you must provide your own google maps api key.

Note that data scrapping some websites may be illegal under certain circumstances.

This is just a proof of concept, to be used for educational purposes only.

Possible enhancements:
- use nodemon/cron.other tool to keep script alive for desired time
- extract stations readout functionality and set a cron job (or sth similar) to read/update stations once per day (or as desired)
- extract station data readout and set another schedule at desired interval
- setup an efficient database
- properly loading stations data into the browser
- realtime heatmap update following stations' data update
- use some frontend framework and create a web app for the maps