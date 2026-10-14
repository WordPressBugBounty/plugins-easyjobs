<?php
/**
 * Removes everything EasyJobs stored in the database when the plugin is deleted.
 *
 * WordPress runs uninstall.php (and ignores register_uninstall_hook()) when the
 * file exists, so uninstall.php calls Easyjobs_Uninstaller::uninstall(). This
 * class must not depend on the rest of the plugin: during uninstall only
 * WordPress core is loaded.
 *
 * Pages the plugin created (the "Jobs" page and job pages) are user content and
 * are kept. Only the EasyJobs link meta on them is removed.
 *
 * @link       https://easy.jobs
 * @since      2.8.3
 *
 * @package    Easyjobs
 * @subpackage Easyjobs/includes
 */
class Easyjobs_Uninstaller {

	/**
	 * Option-name prefixes owned by EasyJobs. Every option and transient whose
	 * name starts with one of these is deleted.
	 *
	 * @var string[]
	 */
	const OPTION_PREFIXES = array(
		'easyjobs_',       // Settings, company caches, visitor analytics opt-in, flags.
		'wpins_easyjobs_', // WPInsights usage-tracking state for this plugin.
	);

	/**
	 * Transient-name prefixes owned by EasyJobs.
	 *
	 * @var string[]
	 */
	const TRANSIENT_PREFIXES = array(
		'easyjobs_', // Job caches, state version, verification status, locks.
		'elej_',     // Elementor widget caches.
		'ej-',       // Short-lived sign-in credentials.
	);

	/**
	 * Post meta keys written by EasyJobs.
	 *
	 * @var string[]
	 */
	const POST_META_KEYS = array( 'easyjobs_job_id', '_ej_block_lists' );

	/**
	 * Shared WPDeveloper options that hold one entry per plugin. Only the
	 * EasyJobs entry is removed; other plugins keep theirs.
	 *
	 * @var string[]
	 */
	const SHARED_OPTIONS = array( 'wpins_allow_tracking', 'wpins_block_notice', 'wpdeveloper_plugins_data' );

	/**
	 * Plugin key inside the shared options.
	 */
	const PLUGIN_KEY = 'easyjobs';

	/**
	 * Clean up every site (all sites on multisite).
	 *
	 * @return void
	 */
	public static function uninstall() {
		if ( is_multisite() && function_exists( 'get_sites' ) ) {
			foreach ( get_sites( array( 'fields' => 'ids', 'number' => 0 ) ) as $site_id ) {
				switch_to_blog( $site_id );
				self::cleanup_site();
				restore_current_blog();
			}
			return;
		}
		self::cleanup_site();
	}

	/**
	 * Clean up the current site.
	 *
	 * @return void
	 */
	public static function cleanup_site() {
		foreach ( self::OPTION_PREFIXES as $prefix ) {
			self::delete_options_like( $prefix . '%' );
		}
		foreach ( self::TRANSIENT_PREFIXES as $prefix ) {
			self::delete_options_like( '_transient_' . $prefix . '%' );
			self::delete_options_like( '_transient_timeout_' . $prefix . '%' );
		}

		foreach ( self::SHARED_OPTIONS as $name ) {
			$value = get_option( $name );
			if ( is_array( $value ) && array_key_exists( self::PLUGIN_KEY, $value ) ) {
				unset( $value[ self::PLUGIN_KEY ] );
				if ( empty( $value ) ) {
					delete_option( $name );
				} else {
					update_option( $name, $value, false );
				}
			}
		}

		foreach ( self::POST_META_KEYS as $meta_key ) {
			delete_post_meta_by_key( $meta_key );
		}

		wp_cache_flush();
	}

	/**
	 * Delete options whose name matches a LIKE pattern.
	 *
	 * The prefix part is escaped, so "_" in a prefix matches only "_".
	 *
	 * @param string $pattern Prefix followed by "%".
	 * @return void
	 */
	private static function delete_options_like( $pattern ) {
		global $wpdb;

		$like = $wpdb->esc_like( substr( $pattern, 0, -1 ) ) . '%';
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- one-time cleanup on uninstall; the object cache is flushed afterwards.
		$names = $wpdb->get_col( $wpdb->prepare( "SELECT option_name FROM {$wpdb->options} WHERE option_name LIKE %s", $like ) );
		foreach ( (array) $names as $name ) {
			delete_option( $name );
		}
	}
}
