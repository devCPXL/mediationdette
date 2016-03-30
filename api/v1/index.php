<?php
require '../libs/Slim/Slim.php';
require_once 'dbHelper.php';

// Create and configure Slim app
$app = new \Slim\App;

// Define app routes
$app->get('/hello/{name}', function ($request, $response, $args) {
    return $response->write("Hello " . $args['name']);
});

// Run app
$app->run();
