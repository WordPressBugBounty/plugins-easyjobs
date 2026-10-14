<?php
/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://easy.jobs
 * @since      1.0.0
 *
 * @package    Easyjobs
 * @subpackage Easyjobs/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Easyjobs
 * @subpackage Easyjobs/includes
 * @author     EasyJobs <support@easy.jobs>
 */
class Easyjobs_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {
		// Intentionally a no-op: since WordPress 4.6 translations for WordPress.org-hosted
		// plugins are loaded automatically for the "easyjobs" text domain (the plugin requires 5.0+).
		// The method and its hook are kept so existing references keep working.
	}

}
