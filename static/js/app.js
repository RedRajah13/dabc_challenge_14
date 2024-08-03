// HTML: add bootstrap/bootswatch, add href link to og dataset

// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
   let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let metadata_info = metadata.filter(x => x.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let sampleData = d3.select(`#sample-metadata`);

    // Use `.html("") to clear any existing metadata
    sampleData.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (const [key, value] of Object.entries(metadata_info)) {
      sampleData.append("h6").text(`${key}: ${value}`);
    };
   
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let sampleData = data.samples;

    // Filter the samples for the object with the desired sample number
    let chart_info = sampleData.filter(x => x.id === sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = chart_info.otu_ids;
    let otu_labels = chart_info.otu_labels;
    let sample_values = chart_info.sample_values;


    // Build a Bubble Chart
    let trace2 = {
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      marker: {
        color: otu_ids,
        size: sample_values
      },
      text: otu_labels
    };

    // Render the Bubble Chart
    let bubble_traces = [trace2];
    
    let layout2 = {
      title: "Bacteria Cultures per Sample",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Bacteria Found"},
      showlegend: false,
      height: 400,
      width: 1300
    };

    Plotly.newPlot("bubble", bubble_traces, layout2);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let y_ticks = otu_ids.map(x => `OTU: ${x}`);

    // Build a Bar Chart
    let trace1 = {
      x: sample_values.slice(0, 10).reverse(),
      y: y_ticks.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
      marker: {color: "#660000"},
      text: otu_labels
    };

    // Render the Bar Chart
    let bar_traces = [trace1];

    let layout1 = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "Number of Bacteria"},
      yaxis: {
        title: "Bacteria ID by Operational Taxonomic Unit<br>",
        automargin: true
      }
    };

    Plotly.newPlot("bar", bar_traces, layout1);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    console.log(data);

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < names.length; i++) {
      let name = names[i];
      dropdown.append("option").text(name);
    }

    // Get the first sample from the list
    let firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
} 

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
