var url1 = 'https://gist.githubusercontent.com/ErronLLP/4ea0adc47fac5e49bc48275deba6c718/raw/71fc63b85660d46f3c8b9c0d271fae803c55756e/mds_T1_600';
var url2 = 'https://gist.githubusercontent.com/ErronLLP/7da85c9c6060b0ba6fa83d146ec70339/raw/3f91f6e77e62be56ee734f1a56eed4a3a7aaec93/mds_A1_600'; // Replace with your second dataset URL

function plotData(url) {
    d3.csv(url, function(err, rows) {
        function unpack(rows, key) {
            return rows.map(function(row) { return row[key]; });
        }

        var valence = unpack(rows, 'valence').map(Number); // Ensure valence is numeric
        var arousal = unpack(rows, 'arousal').map(Number); // Ensure arousal is numeric
        var videoName = unpack(rows, 'videoName'); // Extract video names

        var hovertextValence = videoName.map((name, i) => `Video: ${name}<br>Valence: ${valence[i]}`);
        var hovertextArousal = videoName.map((name, i) => `Video: ${name}<br>Arousal: ${arousal[i]}`);

        // Determine the min and max values for both variables to set a consistent color scale range
        var minValue = 0;
        var maxValue = 10;

        var data = [{
            x: unpack(rows, 'MDS1'),
            y: unpack(rows, 'MDS2'),
            z: unpack(rows, 'MDS3'),
            mode: 'markers',
            type: 'scatter3d',
            marker: {
                color: valence,
                colorscale: [
                    [0, '#0571b0'],
                    [0.25, '#92c5de'],
                    [0.5, '#f7f7f7'],
                    [0.75, '#f4a582'],
                    [1, '#ca0020']
                ],
                cmin: minValue, // Set minimum value
                cmax: maxValue, // Set maximum value
                size: 5,
                symbol: 'circle',
                colorbar: {
                    title: 'Valence',
                    titleside: 'right',
                    x: 1,
                    xpad: 20
                }
            },
            customdata: videoName, // Ensure 'videoName' matches the CSV column name for videos
            hovertext: hovertextValence,
            hoverinfo: 'text'
        }];

        var layout = {
            autosize: true,
            height: 500, // Reduced height
            width: 500, // Reduced width
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
                    zeroline: false
                },
                yaxis: {
                    type: 'linear',
                    zeroline: false
                },
                zaxis: {
                    type: 'linear',
                    zeroline: false
                }
            },
            hovermode: 'closest', // Ensure hovermode is set to 'closest'
            title: '3D Point Clustering',
            updatemenus: [{
                buttons: [
                    {
                        args: [{
                            'marker.color': [valence],
                            'marker.colorscale': [
                                [0, '#0571b0'],
                                [0.25, '#92c5de'],
                                [0.5, '#f7f7f7'],
                                [0.75, '#f4a582'],
                                [1, '#ca0020']
                            ],
                            'marker.cmin': minValue,
                            'marker.cmax': maxValue,
                            'marker.colorbar.title': 'Valence',
                            'hovertext': [hovertextValence]
                        }],
                        label: 'Valence',
                        method: 'restyle'
                    },
                    {
                        args: [{
                            'marker.color': [arousal],
                            'marker.colorscale': [
                                [0, '#0571b0'],
                                [0.25, '#92c5de'],
                                [0.5, '#f7f7f7'],
                                [0.75, '#f4a582'],
                                [1, '#ca0020']
                            ],
                            'marker.cmin': minValue,
                            'marker.cmax': maxValue,
                            'marker.colorbar.title': 'Arousal',
                            'hovertext': [hovertextArousal]
                        }],
                        label: 'Arousal',
                        method: 'restyle'
                    }
                ],
                direction: 'down',
                showactive: true,
                x: 0.17,
                xanchor: 'left',
                y: 1.1,
                yanchor: 'top'
            }]
        };

        Plotly.newPlot('myDiv2', data, layout);
    });
}

// Initial plot
plotData(url1);

// Add dropdown for dataset selection
var datasetDropdown = document.createElement('select');
datasetDropdown.id = 'datasetSelector';
datasetDropdown.style.position = 'absolute';
datasetDropdown.style.top = '10px';
datasetDropdown.style.left = '10px';
datasetDropdown.innerHTML = `
    <option value="${url1}">Dataset 1</option>
    <option value="${url2}">Dataset 2</option>
`;
document.body.appendChild(datasetDropdown);

// Event listener for dataset selection
datasetDropdown.addEventListener('change', function() {
    plotData(this.value);
});
