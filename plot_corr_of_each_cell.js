// Function to fetch data from GitHub
async function fetchData(url) {
    const response = await fetch(url);
    const text = await response.text();
    return text.trim().split('\n').map(row => row.trim().split(',').map(Number));
}

// URLs of the CSV files
const urls = [
    'https://raw.githubusercontent.com/ErronLLP/plotly/main/data/sample_size_of_each_entry_matrix.csv',
    'https://raw.githubusercontent.com/ErronLLP/plotly/main/data/sample_size_of_each_entry_matrix.csv',
    'https://raw.githubusercontent.com/ErronLLP/plotly/main/data/corr_bvaq_vs_similarity_matrix.csv',
    'https://raw.githubusercontent.com/ErronLLP/plotly/main/data/corr_sig_bvaq_vs_similarity_matrix.csv'
];

// Matrix labels
const matrixLabels = [
    'Default',
    '# of Entries',
    'Correlation',
    'Significance'
];

// Fetch data and create heatmap
Promise.all(urls.map(fetchData)).then(dataMatrices => {
    const frames = dataMatrices.map((data, index) => {
        let hovertemplate = '';

        switch(index) {
            case 0:
                hovertemplate = 'video 1 = %{x}<br>video 2 = %{y}<br># of participant = %{z}<extra></extra>';
                break;
            case 1:
                hovertemplate = 'video 1 = %{x}<br>video 2 = %{y}<br># of participant = %{z}<extra></extra>';
                break;
            case 2:
                hovertemplate = 'video 1 = %{x}<br>video 2 = %{y}<br>corr = %{z}<extra></extra>';
                break;
            case 3:
                hovertemplate = 'video 1 = %{x}<br>video 2 = %{y}<br>p < 0.05 (1 = yes) = %{z}<extra></extra>';
                break;
        }

        return {
            name: matrixLabels[index],
            data: [{
                z: data,
                type: 'heatmap',
                colorscale: 'Viridis',
                hovertemplate: hovertemplate,
                x: Array.from({ length: 75 }, (_, i) => i + 1),
                y: Array.from({ length: 75 }, (_, i) => i + 1)
            }]
        };
    });

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
                label: matrixLabels[index]
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
