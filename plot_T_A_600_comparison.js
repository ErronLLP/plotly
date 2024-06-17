// URLs for the CSV files
const url1 = 'https://raw.githubusercontent.com/ErronLLP/plotly/main/data/3d_mds_bootsize/mds_A1_600.csv';
const url2 = 'https://raw.githubusercontent.com/ErronLLP/plotly/main/data/3d_mds_bootsize/mds_T1_600.csv';

// Function to load CSV data
function loadData(url) {
    return new Promise((resolve, reject) => {
        d3.csv(url, function(error, data) {
            if (error) reject(error);
            else resolve(data);
        });
    });
}
// Load both CSV files
Promise.all([loadData(url1), loadData(url2)]).then(datasets => {
    const data1 = datasets[0];
    const data2 = datasets[1];

    // Extract the data points
    const x1 = data1.map(d => +d.MDS1);
    const y1 = data1.map(d => +d.MDS2);
    const z1 = data1.map(d => +d.MDS3);
    const valence1 = data1.map(d => +d.valence);

    const x2 = data2.map(d => +d.MDS1);
    const y2 = data2.map(d => +d.MDS2);
    const z2 = data2.map(d => +d.MDS3);
    const valence2 = data2.map(d => +d.valence);

    // Calculate the combined axis ranges
    const xAll = x1.concat(x2);
    const yAll = y1.concat(y2);
    const zAll = z1.concat(z2);

    const xRange = [Math.min(...xAll), Math.max(...xAll)];
    const yRange = [Math.min(...yAll), Math.max(...yAll)];
    const zRange = [Math.min(...zAll), Math.max(...zAll)];

    // Create the plotly trace for the first set of points
    const trace1 = {
        x: x1,
        y: y1,
        z: z1,
        mode: 'markers',
        type: 'scatter3d',
        marker: {
            size: 5,
            color: valence1,
            colorscale: [
                [0, '#0571b0'],
                [0.25, '#92c5de'],
                [0.5, '#f7f7f7'],
                [0.75, '#f4a582'],
                [1, '#ca0020']
            ],
            cmin: 0,
            cmax: 10,
            colorbar: {
                title: 'Valence',
                titleside: 'right',
                x: 1,
                xpad: 20
            }
        },
        name: 'Set 1'
    };

    // Create the plotly trace for the second set of points
    const trace2 = {
        x: x2,
        y: y2,
        z: z2,
        mode: 'markers',
        type: 'scatter3d',
        marker: {
            size: 5,
            color: valence2,
            colorscale: [
                [0, '#0571b0'],
                [0.25, '#92c5de'],
                [0.5, '#f7f7f7'],
                [0.75, '#f4a582'],
                [1, '#ca0020']
            ],
            cmin: 0,
            cmax: 10,
            colorbar: {
                title: 'Valence',
                titleside: 'right',
                x: 1,
                xpad: 20
            }
        },
        name: 'Set 2'
    };

    // Layout configuration
    const layout = {
        autosize: true,
        height: 800,
        width: 800,
        scene: {
            aspectratio: {
                x: 1,
                y: 1,
                z: 1
            },
            camera: {
                center: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                eye: {
                    x: 1.25,
                    y: 1.25,
                    z: 1.25
                },
                up: {
                    x: 0,
                    y: 0,
                    z: 1
                }
            },
            xaxis: {
                type: 'linear',
                zeroline: false,
                range: xRange
            },
            yaxis: {
                type: 'linear',
                zeroline: false,
                range: yRange
            },
            zaxis: {
                type: 'linear',
                zeroline: false,
                range: zRange
            }
        },
        hovermode: 'closest',
        title: '3D Point Clustering',
        sliders: [{
            pad: {t: 30},
            x: 0.1,
            len: 0.9,
            currentvalue: {
                xanchor: 'right',
                prefix: 'Dataset: ',
                font: {
                    color: '#888',
                    size: 20
                }
            },
            steps: [{
                label: 'Set 1',
                method: 'restyle',
                args: [
                    {'x': [x1], 'y': [y1], 'z': [z1], 'valence': [valence1], 'marker.color': [valence1]}
                ]
            }, {
                label: 'Set 2',
                method: 'restyle',
                args: [
                    {'x': [x2], 'y': [y2], 'z': [z2],'valence': [valence2], 'marker.color': [valence2]}
                ]
            }]
        }]
    };

    // Plot the initial trace
    Plotly.newPlot('myDiv2', [trace1], layout);
}).catch(error => {
    console.error('Error loading the data:', error);
});