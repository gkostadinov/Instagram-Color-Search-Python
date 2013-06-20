<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Instagram Color Search</title>
        <meta name="description" content="Color based search for Instagram using Imagga's color API.">
        <meta name="viewport" content="width=device-width">

        <link rel="stylesheet" href="static/css/main.css">
    </head>
    <body class="no-filter">
        <div id="toolbar">
            <div class="container">
                <h1>Instagram Color Search</h1>
                <div class="colors">
                    <p>Choose a color (maximum 5):</p>
                    <ul>
                    </ul>
                    <div class="clear"></div>
                </div>
                <div class="chosen-colors">
                    <p>These are your chosen colors<br>Click on a color to remove it</p>
                    <ul>
                    </ul>
                    <div class="clear"></div>
                </div>
                <button id="search">Search</button>
                <button id="add-more" class="big">Get more photos</button>
            </div>
        </div>
        <div id="photos"></div>

        <script src="static/js/vendor/jquery.js"></script>
        <script src="static/js/vendor/underscore.js"></script>
        <script src="static/js/plugins/packery.js"></script>

        <script src="static/js/photostorage.js"></script>
        <script src="static/js/events.js"></script>
        <script src="static/js/photos.js"></script>
        <script src="static/js/toolbar.js"></script>
        <script src="static/js/main.js"></script>
    </body>
</html>