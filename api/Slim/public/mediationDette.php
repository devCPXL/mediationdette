<?php
/**
 * Created by PhpStorm.
 * User: lakroubassi.n
 * Date: 21/10/2016
 * Time: 09:11
 */

$app->get('/listDossier/', function ($request, $response, $args) {
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