<?php
/**
 * Class Easyjobs_Admin_Messages
 *
 * Handles the recruiter <-> candidate conversation (Messages) screen.
 * Bridges the React admin UI (admin-ajax) to the easy.jobs `conversation/*`
 * WP API endpoints via {@see Easyjobs_Api}.
 *
 * Backend reference: app/Http/Controllers/Api/WpV1/CompanyConversationController.php
 * See docs/api/conversation.md and docs/features/messaging/04-phase2-dynamic.md.
 *
 * NOTE: applicants are addressed by their opaque `generated_id` (string), NOT a
 * numeric id, so identifiers here are sanitized with sanitize_text_field() only.
 *
 * @since 2.8.0
 */
class Easyjobs_Admin_Messages {

	/**
	 * Easyjobs_Admin_Messages constructor.
	 */
	public function __construct() {
		add_action( 'wp_ajax_easyjobs_get_message_notifications', array( $this, 'get_message_notifications' ) );
		add_action( 'wp_ajax_easyjobs_get_conversations', array( $this, 'get_conversations' ) );
		add_action( 'wp_ajax_easyjobs_get_conversation_thread', array( $this, 'get_conversation_thread' ) );
		add_action( 'wp_ajax_easyjobs_send_message', array( $this, 'send_message' ) );
		add_action( 'wp_ajax_easyjobs_change_message_status', array( $this, 'change_message_status' ) );
	}

	/**
	 * Shared guard: capability + nonce. Echoes an error envelope and dies on failure.
	 *
	 * @return bool
	 */
	private function guard() {
		if ( ! Easyjobs_Helper::can_update_options() ) {
			echo wp_json_encode(
				array(
					'status'  => 'error',
					'message' => 'Invalid request !!',
				)
			);
			wp_die();
		}
		if ( ! Easyjobs_Helper::verified_request( $_POST ) ) {
			echo wp_json_encode(
				array(
					'status'     => 'error',
					'error_type' => 'invalid_nonce',
					'message'    => 'Bad request !!',
				)
			);
			wp_die();
		}
		return true;
	}

	/**
	 * Read + validate the applicant `generated_id` from the request.
	 *
	 * The id is concatenated into the API endpoint path, so it must be restricted
	 * to the Hashids alphabet (alphanumeric) to prevent path/URL injection.
	 * Returns an empty string when missing or malformed.
	 *
	 * @return string
	 */
	private function applicant_id() {
		$id = isset( $_POST['id'] ) ? sanitize_text_field( wp_unslash( $_POST['id'] ) ) : '';
		if ( '' === $id || ! preg_match( '/^[A-Za-z0-9_-]+$/', $id ) ) {
			return '';
		}
		return $id;
	}

	/**
	 * GET conversation/notifications — unseen message counter (or popup payload).
	 *
	 * @return void
	 */
	public function get_message_notifications() {
		$this->guard();

		$response = Easyjobs_Api::get( 'conversation_notifications' );
		Easyjobs_Helper::check_reload_required( $response );

		echo wp_json_encode( Easyjobs_Helper::get_generic_response( $response ) );
		wp_die();
	}

	/**
	 * GET conversation/applicants — applicant conversation list.
	 *
	 * Accepts optional filters; `has_conversation` (1|0) maps to the API's
	 * `has-conversation` query key (default true on the backend).
	 *
	 * @return void
	 */
	public function get_conversations() {
		$this->guard();

		$params = array();

		// has-conversation (hyphenated API key). Default handled server-side when omitted.
		if ( isset( $_POST['has_conversation'] ) ) {
			$params['has-conversation'] = (int) (bool) absint( $_POST['has_conversation'] );
		}

		$pass_through = array(
			'search',
			'job_id',
			'page',
			'hide_pipeline',
			'manager_id',
			'active_jobs_applicants',
		);
		foreach ( $pass_through as $key ) {
			if ( isset( $_POST[ $key ] ) && '' !== $_POST[ $key ] ) {
				$params[ $key ] = sanitize_text_field( wp_unslash( $_POST[ $key ] ) );
			}
		}

		// `message_status` and `hide_pipeline` may arrive as arrays
		// (e.g. message_status[]=read&message_status[]=unread). The React client sends
		// them JSON-encoded; decode then sanitize each value before passing through.
		foreach ( array( 'message_status', 'hide_pipeline' ) as $array_key ) {
			if ( isset( $_POST[ $array_key ] ) && '' !== $_POST[ $array_key ] ) {
				$value = wp_unslash( $_POST[ $array_key ] );
				if ( is_string( $value ) ) {
					$decoded = json_decode( $value, true );
					$value   = ( null !== $decoded ) ? $decoded : $value;
				}
				$params[ $array_key ] = array_map( 'sanitize_text_field', (array) $value );
			}
		}

		$response = Easyjobs_Api::get( 'conversation_applicants', $params );
		Easyjobs_Helper::check_reload_required( $response );

		echo wp_json_encode( Easyjobs_Helper::get_generic_response( $response ) );
		wp_die();
	}

	/**
	 * GET conversation/applicants/{generated_id} — single conversation thread.
	 *
	 * @return void
	 */
	public function get_conversation_thread() {
		$this->guard();

		$generated_id = $this->applicant_id();
		if ( '' === $generated_id ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Applicant id not provided' ) );
			wp_die();
		}

		// Messages are paginated (10/page, latest first). Pass through `page` so the
		// UI can lazy-load older history via reverse infinite scroll.
		$page   = isset( $_POST['page'] ) ? absint( wp_unslash( $_POST['page'] ) ) : 0;
		$params = $page > 1 ? array( 'page' => $page ) : array();

		$response = Easyjobs_Api::get_by_id( 'conversation_applicant', $generated_id, '', $params );
		Easyjobs_Helper::check_reload_required( $response );

		echo wp_json_encode( Easyjobs_Helper::get_generic_response( $response ) );
		wp_die();
	}

	/**
	 * POST conversation/applicants/{generated_id}/message — save a new message.
	 *
	 * Requires a non-empty `message` and/or `file` (base64). The backend rejects the
	 * request when both are blank.
	 *
	 * @return void
	 */
	public function send_message() {
		$this->guard();

		$generated_id = $this->applicant_id();
		if ( '' === $generated_id ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Applicant id not provided' ) );
			wp_die();
		}

		$data = array();
		// Allow safe rich-text formatting tags (bold/italic/lists/links) from the editor.
		$message = isset( $_POST['message'] ) ? wp_kses_post( wp_unslash( $_POST['message'] ) ) : '';
		// `file` is a base64 data-URL attachment string; pass through without sanitizing the payload.
		$file = isset( $_POST['file'] ) ? wp_unslash( $_POST['file'] ) : '';
		// Guard against a serialized empty value arriving as a literal string.
		if ( 'null' === $file || 'undefined' === $file ) {
			$file = '';
		}
		// Only forward a genuine base64 data URL (the editor sends readAsDataURL output).
		if ( '' !== $file && ! preg_match( '#^data:[\w.+-]+/[\w.+-]+;base64,#i', $file ) ) {
			$file = '';
		}

		if ( '' === $message && '' === $file ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Write some message' ) );
			wp_die();
		}

		if ( '' !== $message ) {
			$data['message'] = $message;
		}
		if ( '' !== $file ) {
			$data['file'] = $file;
		}

		$response = Easyjobs_Api::post( 'save_conversation_message', $generated_id, $data );
		Easyjobs_Helper::check_reload_required( $response );

		echo wp_json_encode( Easyjobs_Helper::get_generic_response( $response ) );
		wp_die();
	}

	/**
	 * POST conversation/applicants/{generated_id}/message/status — read/unread.
	 *
	 * @return void
	 */
	public function change_message_status() {
		$this->guard();

		$generated_id = $this->applicant_id();
		if ( '' === $generated_id ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Applicant id not provided' ) );
			wp_die();
		}

		$status = isset( $_POST['status'] ) ? sanitize_text_field( wp_unslash( $_POST['status'] ) ) : '';
		if ( ! in_array( $status, array( 'read', 'unread' ), true ) ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Invalid status' ) );
			wp_die();
		}

		$response = Easyjobs_Api::post( 'conversation_message_status', $generated_id, array( 'status' => $status ) );
		Easyjobs_Helper::check_reload_required( $response );

		echo wp_json_encode( Easyjobs_Helper::get_generic_response( $response ) );
		wp_die();
	}
}
