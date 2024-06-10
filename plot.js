d3.csv('https://gist.githubusercontent.com/ErronLLP/83bba8c9b71103986b233b185f29cce9/raw/a67b49c4ffa236399d1db8d1567d706091c2497c/mds.csv', function(err, rows){

    function unpack(rows, key) {
        return rows.map(function(row) { return row[key]; });
    }

    var data = [{
        x: unpack(rows, 'MDS1'),
        y: unpack(rows, 'MDS2'),
        z: unpack(rows, 'MDS3'),
        mode: 'markers',
        type: 'scatter3d',
        marker: {
          color: 'rgb(23, 190, 207)',
          size: 2
        }
    }];

    var layout = {
        autosize: true,
        height: 1000,
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
        title: '3d point clustering',
        width: 1000
    };

    Plotly.newPlot('myDiv', data, layout);

    var myPlot = document.getElementById('myDiv');
    var hoverVideo = document.getElementById('hoverVideo');
    var videoSource = document.getElementById('videoSource');

    myPlot.on('plotly_hover', function(data){
        var point = data.points[0];
        var videoName = point.customdata;
        var videoURL = 'https://example.com/' + videoName; // Update the base URL as needed

        videoSource.src = videoURL;
        hoverVideo.load();
        hoverVideo.style.display = 'block';
        hoverVideo.style.left = (data.event.clientX + 10) + 'px';
        hoverVideo.style.top = (data.event.clientY + 10) + 'px';
        hoverVideo.play();
    });

    myPlot.on('plotly_unhover', function(data){
        hoverVideo.pause();
        hoverVideo.style.display = 'none';
    });

});
