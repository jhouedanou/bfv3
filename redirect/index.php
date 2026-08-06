<?php
/**
 * Redirection permanente : bigfive.dev/solutions  ->  https://bigfive.solutions
 *
 * SOLUTION DE REPLI, a utiliser uniquement si le .htaccess ne fonctionne pas
 * (mod_rewrite desactive, AllowOverride None chez l'hebergeur).
 *
 * Limite importante : ce fichier ne redirige que les requetes qui aboutissent
 * sur lui, c'est-a-dire /solutions/ et /solutions/index.php. Les anciennes
 * pages appelees directement (/solutions/agence.html) continueront de
 * s'afficher. Pour une migration complete, privilegier le .htaccess.
 */

$destination = 'https://bigfive.solutions/';

// Evite qu'un proxy ne mette en cache une reponse intermediaire
header('Cache-Control: no-cache, must-revalidate');

header('Location: ' . $destination, true, 301);
exit;
