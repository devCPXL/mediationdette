<?php
if (PHP_SAPI == 'cli-server') {
    // To help the built-in PHP dev server, check if the request was actually for
    // something which should probably be served as a static file
    $file = __DIR__ . $_SERVER['REQUEST_URI'];
    if (is_file($file)) {
        return false;
    }
}

require __DIR__ . '/../vendor/autoload.php';

session_start();

// Instantiate the app
$settings = require __DIR__ . '/../src/settings.php';
$app = new \Slim\App($settings);

// Set up dependencies
require __DIR__ . '/../src/dependencies.php';

// Register middleware
require __DIR__ . '/../src/middleware.php';

// Register routes
require __DIR__ . '/../src/routes.php';

global $database;
$database = new medoo([
    // required
    'database_type' => 'mysql',
    'database_name' => 'eur',
    'server' => 'cpasxlnh',
    'username' => 'r_only',
    'password' => 'r_only',
    'charset' => 'utf8',

    // [optional]
    'port' => 3306,

    // [optional] Table prefix
    'prefix' => '',

    // driver_option for connection, read more from http://www.php.net/manual/en/pdo.setattribute.php
    'option' => [
        PDO::ATTR_CASE => PDO::CASE_NATURAL
    ]
]);

// require_once php files
require_once 'mediationDette.php';


$app->get('/hello/{name}', function ($request, $response, $args) {
    return $response->write("Hello " . $args['name']);
});

$app->get('/listMazout/', function ($request, $response, $args) {
    global $database;

//join between the person and the Mazout folder
    $data = $database->query1("
        select distinct
          dos.dos_soc_dos,
          dos.dos_jaar,
          dos.dos_number,
          dos.dos_naam,
          dos.dos_voornaam,
          dos.dos_nr_nat_reg,
          dos.dos_gebdatum,
          dos.dos_straat,
          dos.dos_huisnr,
          dos.dos_busnr,
          dos.dos_postcode,
          dos.dos_woonplaats,
          dos.dos_tel,
          dos.dos_tel2,
          dos.dos_gsm,
          dos.dos_geslacht,
          dos.dos_nationaliteit,
          dos.dos_lang,
          dos.dos_etat_civil,
          dos.dos_burg_staat
        from dossier dos
          inner join SocMaz maz
              on dos.dos_jaar = maz.socm_dosjaar
                  and dos.dos_number = maz.socm_dosnumber
        ");
    return $response->withStatus(200)->withHeader('Content-type', 'application/json')->write(json_encode($data));
});

$app->get('/listMazout/{dos_jaar}/{dos_number}', function ($request, $response, $args) {
    global $database;
    $dos_jaar = $args['dos_jaar'];
    $dos_number = $args['dos_number'];

    $data = $database->select("SocMaz", "*",
        ["AND" => ["socm_dosjaar" => $args['dos_jaar'], "socm_dosnumber" => $args['dos_number']], "ORDER" => "socm_datum_aanvraag DESC"]);

//    var_dump($database);
    return $response->withStatus(200)->withHeader('Content-type', 'application/json')->write(json_encode($data));
});


// Member of the family.
$app->get('/memberFamily/{dos_soc_dos}', function ($request, $response, $args) {
    global $database;

    $data = $database->select("dossier", ["dos_naam", "dos_voornaam", "dos_gebdatum", "dos_lien(resource)"],
        ["AND" => ["dos_present[>]" => 0, "dos_soc_dos" => $args['dos_soc_dos']],"ORDER" => "dos_gebdatum ASC"]);

//    var_dump($database);
    return $response->withStatus(200)->withHeader('Content-type', 'application/json')->write(json_encode($data));
});

// Liste Energy previous payments
$app->get('/listeEnergy/previousPayments/{dos_jaar}/{dos_number}', function ($request, $response, $args) {
    global $database;
    $year = date("Y");

    $data = $database->select("Scptdi",
        [   "scpd_bew_jaar",
            "scpd_bet_bedrag",
            "scpd_bes_stncode",
            "scpd_bes_stntype",
            "scpd_debut_per",
            "scpd_fin_per",
            "scpd_IBAN"
        ],
        ["AND" => [
            "scpd_dosjaar" => $args['dos_jaar'],
            "scpd_dosnumber" => $args['dos_number'],
            "scpd_bes_stncode" => "MAZOUT",
            "scpd_bew_jaar[>=]" => $year - 2
            ],
        "ORDER" => "scpd_bew_jaar DESC"]);

    if(!$data) $data = $database->error();
//    var_dump($database);
    return $response->withStatus(200)->withHeader('Content-type', 'application/json')->write(json_encode($data));
});
// Run app
$app->run();
