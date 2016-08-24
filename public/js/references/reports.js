//array of [sites][satellites]

var sitesList = [
  {
    "site": "LACA",
    "city": "Los Angeles",
    "state": "CA",
    "longitude": null,
    "latitude": null
  },
  {
    "site": "HACT",
    "city": "Hartford",
    "state": "CT",
    "longitude": null,
    "latitude": null
  },
  {
    "site": "PHPA",
    "city": "Philadelphia",
    "state": "PA",
    "longitude": null,
    "latitude": null
  },
  {
    "site": "LAMC",
    "city": "AMC Lab",
    "state": "CA",
    "longitude": null,
    "latitude": null
  },
  {
    "site": "DEMI",
    "city": "Detroit",
    "state": "MI",
    "longitude": null,
    "latitude": null
  }
];

var transpondersList = [
  {
    "_id": "XCRAFT1"
  },
  {
    "_id": "XCRAFT10"
  },
  {
    "_id": "XCRAFT2"
  },
  {
    "_id": "XCRAFT3"
  },
  {
    "_id": "XCRAFT4"
  },
  {
    "_id": "XCRAFT5"
  },
  {
    "_id": "XCRAFT6"
  },
  {
    "_id": "XCRAFT7"
  },
  {
    "_id": "XCRAFT8"
  },
  {
    "_id": "XCRAFT9"
  }
];






var allData = {'sites':[], 'satellites':[[]], 'transponders':[[[]]], 'data':[[[[]]]]};

//get all sites

$.getJSON(sitesList, function(results) {//'http://localhost:3000/sites/', function(results) {

    $.each(results, function(index, site)
    {
    	allData.sites.push(site.site);
    });

    allData.sites = allData.sites.sort();

});

//get each satellite per site
$.each(allData.sites, function( site_index, site){
	$.getJSON(transpondersList, function(results) {//'http://localhost:3000/sites/'+site+'/sats', function(results) {

	    $.each(results, function(sat_index, sat)
	    {
	    	allData.satellite[site_index][sat_index] = sats;
	    });
	});

});

console.log(allData);