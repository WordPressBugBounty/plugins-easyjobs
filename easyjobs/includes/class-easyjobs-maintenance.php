<?php

class Easyjobs_Maintenance {

	public static $instance;

	private $version_db_key = 'easyjobs_version';

	public function __construct(){
		add_action('upgrader_process_complete', [$this, 'mark_update_flag'], 10, 2);
		add_action('admin_init', [$this, 'check_for_update'], 5);
		$this->init();
	}

	/**
	 * Mark that plugin was updated (sets a transient flag)
	 */
	public function mark_update_flag( $_upgrader, $hook_extra ) {
		// Check if this is our plugin being updated
		if ( isset( $hook_extra['plugins'] ) && is_array( $hook_extra['plugins'] ) ) {
			foreach ( $hook_extra['plugins'] as $plugin ) {
				if ( strpos( $plugin, 'easyjobs' ) !== false ) {
					set_transient( 'easyjobs_plugin_updated', true, HOUR_IN_SECONDS );
					break;
				}
			}
		}
	}

	public static function get_instance( ...$args ) {
		if ( ! isset( self::$instance[static::class] ) ) {
			self::$instance[static::class] = ! empty( $args ) ? new static( ...$args ) : new static;
		}

		return self::$instance[static::class];
	}

	public function check_for_update(){
		$stored_version = get_option($this->version_db_key);
		$update_flag = get_transient( 'easyjobs_plugin_updated' );

		// Clear cache if plugin was updated (check both flag AND version mismatch)
		if ( $update_flag || ( $stored_version && $stored_version !== EASYJOBS_VERSION ) ) {
			Easyjobs_Helper::clear_job_details_caches();
			delete_transient( 'easyjobs_plugin_updated' );
		}

		// Update version if not set or if different
		if ( $stored_version !== EASYJOBS_VERSION ) {
			$this->update_version();
		}

		// Initialize page mappings if missing
		if(empty(Easyjobs_Helper::get_wp_pages())){
			Easyjobs_Helper::update_wp_pages(Easyjobs_Helper::get_job_pages_by_meta());
		}
	}

	/**
	 * Update WC version to current.
	 */
	private function update_version() {
		update_option( $this->version_db_key, EASYJOBS_VERSION );
	}

	/**
	 * Init Maintenance
	 *
	 * @since 2.4.2
	 * @return void
	 */
	public function init( ) {
		register_activation_hook( EASYJOBS_BASENAME, [__CLASS__, 'activation'] );
		register_deactivation_hook( EASYJOBS_BASENAME, [__CLASS__, 'deactivation'] );
		register_uninstall_hook( EASYJOBS_BASENAME, [__CLASS__, 'uninstall'] );
	}

	/**
	 * Runs on activation
	 *
	 * @since 2.4.2
	 * @return void
	 */
	public static function activation( $network_wide ) {
		require_once plugin_dir_path( __FILE__ ) . 'class-easyjobs-activator.php';
		Easyjobs_Activator::activate( $network_wide );
	}

	/**
	 * Runs on deactivation
	 *
	 * @since 2.4.2
	 * @return void
	 */
	public static function deactivation() {
		require_once plugin_dir_path( __FILE__ ) . 'class-easyjobs-deactivator.php';
		Easyjobs_Deactivator::deactivate();
	}

	/**
	 * Runs on uninstallation.
	 *
	 * @since 2.4.2
	 * @return void
	 */
	public static function uninstall() {
		Easyjobs_Helper::after_disconnect_api();
	}
}
