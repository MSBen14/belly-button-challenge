// Use the D3 library to read in samples.json from the URL https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json.
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Promise Pending
const dataPromise = d3.json(url);
console.log('Data Promise: ',dataPromise);

// Fetch the JSON data and console log it

d3.json(url).then(function(data) {
    console.log(data);
}) ;

// initialize the dashboard at start up
function init() {

    //Get a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json(url).then((data)=> {
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
        selector.append("option")
                .text(sample)
                .property('value', sample);
        });

        // Set the first sample from the list to build the initial plots
        var firstSample = sampleNames[0];
        console.log(firstSample);
        
        // Build initial metadata and charts
        buildMetadata(firstSample);
        builBarChart(firstSample);
        builBubbleChart(firstSample);
        builGaugeChart(firstSample);
        
        
    });
};

// Function that builds Bar chart
function builBarChart(sample){
    // Use d3 to retreive and load the samples.json file
    d3.json(url).then((data) => {

        // Create a variable that holds the samples array
        var samples = data.samples;
        
        // Create a variable that filters the samples for the object with the desired sample number
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        
        // Create a variable that holds the first sample in the array
        var result = resultArray[0];

        // Create variables that hold the otu_ids, otu_labels and sample values
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;
        
        // Console log the data
        console.log(otu_ids, otu_labels, sample_values);

        // Set top 10 items to display in decending order with slice and reverse method
        let xticks = sample_values.slice(0,10).reverse();
        let yticks = otu_ids.slice(0,10).map(id =>`OTU ${id}`).reverse();
        let labels = otu_labels.slice(0,10).reverse();

        // Set up the trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h" 
        };

        // Set up the layout
        let layout = {
            title : "Top 10 OTU's Present"
        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout)

    });
};

// Function that builds Bar chart
function builBubbleChart(sample){
    // Use d3 to retreive and load the samples.json file
    d3.json(url).then((data) => {

        // Create a variable that holds the samples array
        var samples = data.samples;
        
        // Create a variable that filters the samples for the object with the desired sample number
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        
        // Create a variable that holds the first sample in the array
        var result = resultArray[0];

        // Create variables that hold the otu_ids, otu_labels and sample values
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;
        
        // Console log the data
        console.log(otu_ids, otu_labels, sample_values);

        // Set up the trace for the bar chart
        let traceBubble = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            } 
        };

        // Set up the layout
        let layout = {
            title : "Bacteria Per Sample",
            hovermode:"closest",
            xaxis: {title: "OTU ID"}
        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bubble", [traceBubble], layout)

    });
};

// Function that populates demographic panel
function buildMetadata(sample) {
    // Use D3 to retrieve all of the data
    d3.json(url).then((data)=> {
        // Get all the metadata
        var metaData = data.metadata;
        // Filter the data for the object with the desired sample value selected
        var resultArray = metaData.filter(sampleObj => sampleObj.id == sample);
        console.log(resultArray)
        // get the first index from the array
        var result = resultArray[0];

        // Use d3 to select the panel with od of #sample-metadata
        var panel = d3.select("#sample-metadata");

        //Use .html('') to clear any existing metadata
        panel.html("") ;

        // Use Object.entries to add each key /value pair to the panel
        Object.entries(result).forEach(([key, value])=> {
            console.log(key, value);
            panel.append("h5").text(`${key}: ${value}`);
        });
    });
};


// Fetch the data each time a new sample is selected
function optionChanged(newSample) {

    console.log(newSample);

    //Call all functions
    builBarChart(newSample);
    builBubbleChart(newSample);
    buildMetadata(newSample);
    builGaugeChart(newSample);
};

// Call the initialize dashbord function
init();