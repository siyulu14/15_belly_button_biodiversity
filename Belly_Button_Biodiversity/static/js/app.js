function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url = "/metadata/" + `${sample}`;
  d3.json(url).then(function(metadata){
    
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(metadata).forEach(([key, value]) => {
      panel.append("ul")
           .append("li")
           .text(key + ":" + value);
    });

    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.



  });
    

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(sample){

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: sample.otu_ids,
      y: sample.sample_values,
      mode: 'markers',
      marker: {
        size: sample.sample_values,
        color: sample.otu_ids
      },
      text: sample.otu_labels
    };

    var data = [trace1];
    
    var layout = {
      showlegend: false,
      xaxis: {
        title: {
          text: 'OTU ID',
        }
      }
    };

    Plotly.newPlot('bubble', data, layout);

    // @TODO: Build a Pie Chart

    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var piedata = [{
      values: sample.sample_values.slice(0, 10),
      hovertext: sample.otu_labels.slice(0, 10),
      labels: sample.otu_ids.slice(0, 10),
      hoverinfo: "hovertext",
      type: "pie"
    }];

    Plotly.newPlot("pie", piedata);

  });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
