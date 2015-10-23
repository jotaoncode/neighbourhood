# Almagro Neighbourhood

## Synopsis

This is a project to show and search for my favourites places in my neighbourhood.

## Motivation

This is a nanodegree project. The challenge is to create a map with google maps that show my neighbourhood and some of the places I like to go by adding marks.

## Installation

Everything you need is internet as it uses google maps api and street view api. And then access to index.html through the browser.

## Run

To run the application follow this steps:

1- run in command line terminal

$ node server

2- Open a browser to the address:

http://localhost:3000

You will see the menu at the bottom left corner, that has the book marks of the neighbourhood I lived for 23 years, you can choose any of them in order to see a little description about it. Some of this information is from Foursquare.

## Summary

After this I learnt a bit knockout JS framework, Google API, Foursquare API, and Material Design, Handlebars.

## Dependencies

In package.json you will see material css dependencies in order to give the
floting buttons at bottom left, and for extensibility in order to give some
other features.
Express is in order to give a REST API for foursquare services, as it has a
key it should be in a server.
Grant and Grant-express are some of the packages I could use to handle the
communication with foursquare, it also has another social net accounts that
could helpme with my task, and it will in the future.
Handlebars is in order to avoid having templating in javascript side, and it
is more descriptive than other like underscore templates but less flexible for
some other things.
Express-session is required for grant.
Body-parser will actually helpme with body for request of express, since from
express 3.x to 4.x Body-parser and other modules where removed from core
express to give more modularity.

## Contributors

Juan José García

## License

@MIT

