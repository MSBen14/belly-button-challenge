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
        
        // Build initial chart
        builGaugeChart(firstSample);
        
        
    });
};

// Function that builds Gauge chart
function builGaugeChart(sample){
    // Use d3 to retreive and load the samples.json file
    d3.json(url).then((data) => {

        // Create a variable that holds the samples array
        var metadata = data.metadata;
        
        // Create a variable that filters the samples for the object with the desired sample number
        var gaugeArray = metadata.filter(metaObj => metaObj.id == sample);
        
        // Create a variable that holds the first sample in the array
        var gaugeResult = gaugeArray[0];

        // Create a variable that holds the washing frequency
        var gaugeValue = Object.values(gaugeResult)[6];
        console.log(gaugeValue);

        // Set up the trace for the bar chart
        let traceGauge = {
            value: gaugeValue,
            domain: {x:[0,1], y:[0,1]},
            title: {
                text: "<b>Belly Button Washing Frequency</b><br> Scrubs per Week",
                font: {color: "black", size:16}
            },
            type: "indicator",
            mode : "gauge+number",     
            gauge: {
                axis:{range:[null,9], tickwidth:1, tickcolor:"darkblue"},
                bar: {color:"red"},
                steps: [
                    {range: [0,1], color: "rgb(248,243,236)"},
                    {range: [1,2], color: "rgb(244,241,228)"},
                    {range: [2,3], color: "rgb(233,231,201)"},
                    {range: [3,4], color: "rgb(229,232,176)"},
                    {range: [4,5], color: "rgb(213,229,153)"},
                    {range: [5,6], color: "rgb(183,205,143)"},
                    {range: [6,7], color: "rgb(139,192,134)"},
                    {range: [7,8], color: "rgb(137,188,141)"},
                    {range: [8,9], color: "rgb(132,181,137)"},
                ]
            },
        };
        
        // Set up the layout
        let layout = {
            width: 400,
            height: 400,
            margin: {t: 25, r: 25, l: 25, b: 25 }
        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("gauge", [traceGauge], layout)

    });
};

// Call the initialize dashbord function
init();