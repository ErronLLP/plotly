// Function to fetch data from GitHub
async function fetchData(url) {
    const response = await fetch(url);
    const text = await response.text();
    return text.split('\n').map(row => row.split(',').map(Number));
}

// URLs of the CSV files
const urls = [
    'https://gist.githubusercontent.com/ErronLLP/def795683e9c5e0143785becc8d56808/raw/27c8184fac84626e91b7817e34e2a930cbf3774a/matrix1.csv',
    'https://gist.githubusercontent.com/ErronLLP/def795683e9c5e0143785becc8d56808/raw/27c8184fac84626e91b7817e34e2a930cbf3774a/matrix2.csv',
    'https://gist.githubusercontent.com/ErronLLP/def795683e9c5e0143785becc8d56808/raw/27c8184fac84626e91b7817e34e2a930cbf3774a/matrix3.csv'
];

// Fetch data and create heatmap
Promise.all(urls.map(fetchData)).then(dataMatrices => {
    const frames = dataMatrices.map((data, index) => ({
        name: `Matrix ${index + 1}`,
        data: [ { z: data, type: 'heatmap', colorscale: 'Viridis' } ]
    }));

    const layout = {
        updatemenus: [{
            type: "buttons",
            buttons: [{
                label: "Play",
                method: "animate",
                args: [null, { fromcurrent: true, frame: { duration: 500, redraw: true }, transition: { duration: 0 } }]
            }]
        }],
        sliders: [{
            steps: frames.map((frame, index) => ({
                method: 'animate',
                args: [[frame.name], { mode: "immediate", frame: { duration: 500, redraw: true }, transition: { duration: 0 } }],
                label: `Matrix ${index + 1}`
            })),
            transition: { duration: 0 },
            x: 0,
            y: 0,
            currentvalue: { font: { size: 12 }, prefix: "Matrix: ", visible: true, xanchor: 'center' }
        }]
    };

    const config = { responsive: true };
    const data = frames[0].data;

    Plotly.newPlot('heatmap', data, layout, config).then(() => {
        Plotly.addFrames('heatmap', frames);
    });
});
