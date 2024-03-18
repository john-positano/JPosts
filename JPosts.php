<?php

/**
 * JPosts
 *
 * @link              https://github.com/john-positano/JPosts
 * @since             1.0.0
 * @package           JPosts
 *
 * @wordpress-plugin
 * Plugin Name:       JPosts
 * Plugin URI:        https://github.com/john-positano/JPosts
 * Description:       This plugin allows for the management of external posts to the JSON Placeholder API
 * Version:           1.0.0
 * Author:            John Positano
 * Author URI:        https://github.com/john-positano/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       jposts
 * Domain Path:       /languages
 */

function JPostsManager () {
  require_once 'JPostsFrontend/JPostsManager/index.php';
}

add_action(
  'admin_menu', 
  function () {
    add_options_page('JPosts', 'JPosts Manager', 'manage_options', 'jposts-manager', 'JPostsManager');
  }
);