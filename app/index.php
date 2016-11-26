<?php

$config = file_get_contents(__DIR__ . '/config.json');
$config = json_decode($config);

$db = new PDO("pgsql:dbname=$config->dbname;host=$config->dbhost", $config->dbuser, $config->dbpass);

$data = new stdClass();

$data->site = [
  'title' => $config->title,
  'url' => $config->url,
];

$sql = "
  SELECT
    schedule.*,
    net_controls.*
  FROM schedule
  LEFT JOIN net_controls
    ON net_controls.id = schedule.ncs_id
  ORDER BY schedule.id ASC
";
$stm = $db->query($sql);
$data->schedule = $stm->fetchAll(PDO::FETCH_OBJ);

$sql = "
  SELECT
    announcements.*,
    to_char(announcements.created, 'Dy, Mon DDth') as date_created
  FROM announcements
  ORDER BY id DESC
";
$stm = $db->query($sql);
$data->announcements = $stm->fetchAll(PDO::FETCH_OBJ);

$sql = "SELECT * FROM net_controls ORDER BY callsign ASC";
$stm = $db->query($sql);
$data->net_controls = $stm->fetchAll(PDO::FETCH_OBJ);

$sql = "SELECT * FROM arrl_officials ORDER BY id ASC";
$stm = $db->query($sql);
$data->arrl_officials = $stm->fetchAll(PDO::FETCH_OBJ);

$data = json_encode($data);

$file = fopen(__DIR__ . '/../data.json', 'w');
fwrite($file, $data);
fclose($file);
