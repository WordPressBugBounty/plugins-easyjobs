<?php
/**
 * Class Easyjobs_Admin_Candidates
 * Handles all functionality for candidates in admin area
 *
 * @since 1.0.0
 */
class Easyjobs_Admin_Candidates {

    /**
     * Easyjobs_Admin_Candidates constructor.
     */
    public function __construct() {
		add_action( 'wp_ajax_easyjobs_search_filter_candidates', array( $this, 'search_filter_candidates' ) );
        add_action( 'wp_ajax_easyjobs_search_filter_all_candidates', array( $this, 'search_filter_all_candidates' ) );
        add_action( 'wp_ajax_easyjobs_export_job_candidates', array( $this, 'export_job_candidates' ) );
        add_action( 'wp_ajax_easyjobs_get_invited_candidates', array( $this, 'get_invited_candidates' ) );
        add_action( 'wp_ajax_easyjobs_save_candidate_note', array( $this, 'save_candidate_note' ) );
        add_action( 'wp_ajax_easyjobs_delete_candidate_note', array( $this, 'delete_candidate_note' ) );
        add_action( 'wp_ajax_easyjobs_delete_candidate', array( $this, 'delete_candidate' ) );
        add_action( 'wp_ajax_easyjobs_get_pending_candidates', array( $this, 'get_pending_candidates' ) );
        add_action( 'wp_ajax_easyjobs_delete_pending_candidate', array( $this, 'delete_pending_candidate' ) );
        add_action( 'wp_ajax_easyjobs_get_candidates', array( $this, 'get_candidates' ) );
        add_action( 'wp_ajax_easyjobs_get_company_jobs', array( $this, 'get_company_jobs' ) );
        add_action( 'wp_ajax_easyjobs_candidate_details', array( $this, 'show_details' ) );
        add_action( 'wp_ajax_easyjobs_get_job_candidates', array( $this, 'get_job_candidates' ) );
        add_action( 'wp_ajax_easyjobs_get_candidates_id', array( $this, 'get_ids' ) );
        add_action( 'wp_ajax_easyjobs_stream_resume', array( $this, 'stream_resume' ) );
        add_action( 'wp_ajax_easyjobs_get_custom_fields', array( $this, 'get_custom_fields' ) );
        add_action( 'wp_ajax_easyjobs_save_custom_field', array( $this, 'save_custom_field' ) );
        add_action( 'wp_ajax_easyjobs_delete_custom_field', array( $this, 'delete_custom_field' ) );
        add_action( 'wp_ajax_easyjobs_get_attachments', array( $this, 'get_attachments' ) );
        add_action( 'wp_ajax_easyjobs_upload_attachment', array( $this, 'upload_attachment' ) );
        add_action( 'wp_ajax_easyjobs_update_attachment', array( $this, 'update_attachment' ) );
        add_action( 'wp_ajax_easyjobs_delete_attachment', array( $this, 'delete_attachment_file' ) );
        add_action( 'wp_ajax_easyjobs_stream_attachment', array( $this, 'stream_attachment' ) );
        add_action( 'wp_ajax_easyjobs_get_assessment_list', array( $this, 'get_assessment_list' ) );
        add_action( 'wp_ajax_easyjobs_assign_candidate_assessment', array( $this, 'assign_candidate_assessment' ) );
        add_action( 'wp_ajax_easyjobs_update_candidate_assessment', array( $this, 'update_candidate_assessment' ) );
        add_action( 'wp_ajax_easyjobs_delete_candidate_assessment', array( $this, 'delete_candidate_assessment' ) );
    }

    /**
     * Stream a candidate's resume from this site's own origin.
     *
     * Resume files live on the (cross-origin) easy.jobs media disk, which the
     * in-browser pdf.js viewer cannot fetch due to CORS. Serving the bytes
     * through this same-origin endpoint lets pdf.js render to canvas (enabling
     * the zoom / rotate / page controls). Mirrors the app-end `streamResume`.
     *
     * GET: action=easyjobs_stream_resume&id=<candidate>&nonce=<easyjobs_react_nonce>
     *
     * @since 2.8.0
     * @return void
     */
    public function stream_resume() {
        // GET is used by the in-page pdf.js viewer; POST (nonce in body) by the
        // open-in-new-tab / download buttons. Capability + nonce enforced either way.
        if ( ! Easyjobs_Helper::can_update_options() || ! Easyjobs_Helper::verified_request( $_REQUEST ) ) {
            status_header( 403 );
            exit;
        }
        $id = isset( $_REQUEST['id'] ) ? absint( $_REQUEST['id'] ) : 0;
        if ( ! $id ) {
            status_header( 400 );
            exit;
        }

        $details = Easyjobs_Api::get_by_id( 'candidate', $id );

        $url = '';
        if ( $details && isset( $details->status ) && 'success' === $details->status ) {
            // The candidate API payload nests the user under `candidate`
            // (React reads candidateDetails.candidate.user.resume_url).
            if ( isset( $details->data->candidate->user->resume_url ) ) {
                $url = $details->data->candidate->user->resume_url;
            } elseif ( isset( $details->data->user->resume_url ) ) {
                $url = $details->data->user->resume_url;
            }
        }
        if ( empty( $url ) ) {
            status_header( 404 );
            exit;
        }

        $response = wp_remote_get(
            esc_url_raw( $url ),
            array(
                'timeout'   => 25,
                'sslverify' => false,
            )
        );
        if ( is_wp_error( $response ) || 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
            status_header( 502 );
            exit;
        }

        $body  = wp_remote_retrieve_body( $response );
        $ctype = wp_remote_retrieve_header( $response, 'content-type' );
        // Keep only safe MIME-header characters (defence-in-depth vs header issues).
        $ctype = is_array( $ctype ) ? '' : preg_replace( '/[^A-Za-z0-9\/\.\-\+;=, ]/', '', (string) $ctype );
        if ( '' === $ctype ) {
            $ctype = 'application/pdf';
        }

        $disposition = ! empty( $_REQUEST['download'] ) ? 'attachment' : 'inline';

        nocache_headers();
        header( 'Content-Type: ' . $ctype );
        header( 'Content-Disposition: ' . $disposition . '; filename="resume.pdf"' );
        header( 'X-Content-Type-Options: nosniff' );
        header( 'Referrer-Policy: no-referrer' );
        // Neutralise any embedded script if a non-PDF (SVG/HTML) resume is previewed.
        header( "Content-Security-Policy: default-src 'none'; img-src 'self' data:; media-src 'self' data:; style-src 'unsafe-inline'; sandbox" );
        header( 'Content-Length: ' . strlen( $body ) );
        echo $body; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- binary PDF stream
        exit;
    }

    /**
     * Show all candidates
     *
     * @since 1.0.0
     * @param int $job_id
     * @return void
     */
    public function show_job_candidates( $job_id ) {
        $data       = $this->get_job_candidates_data( $job_id );
        if($data){
			$candidates = $data->candidates;
			$pipelines  = $data->job->pipeline;
		}
        $job        = Easyjobs_Helper::get_job( $job_id );
        $ai_enabled = Easyjobs_Helper::is_ai_enabled();
        include EASYJOBS_ADMIN_DIR_PATH . 'partials/easyjobs-candidates-display.php';
    }
    public function get_job_candidates_data( $job_id ) {
        $candidates = Easyjobs_Api::get_by_id( 'job', $job_id, 'candidates' );
		Easyjobs_Helper::check_reload_required( $candidates );
        if ( $candidates && $candidates->status == 'success' ) {
            return $candidates->data;
        }
        return false;
    }
    /**
     * Get job candidates
     *
     * @since 1.0.0
     * @param int $job_id
     * @return object | bool
     */
    public function get_job_candidates() {
        if ( ! Easyjobs_Helper::can_update_options() ) {
			echo wp_json_encode(
				array(
					'status'     => 'error',
					'message'    => 'Invalid request !!',
				)
			);
			wp_die();
        }
        if(!Easyjobs_Helper::verified_request($_POST)){
			echo wp_json_encode(Easyjobs_Helper::get_error_response('Invalid request'));
			wp_die();
		}
        $job_id = isset($_POST['job_id']) ? $_POST['job_id'] : 4;
        $candidates = $this->get_job_candidates_data($job_id);

        if($candidates){
			echo wp_json_encode(Easyjobs_Helper::get_success_response('success', $candidates));
		}else{
			echo wp_json_encode(Easyjobs_Helper::get_error_response('Unable to get candidates'));
		}
		wp_die();
    }

    /**
     * Ajax callback for 'easyjobs_search_filter_candidates'
     * Handles search and filter candidates
     *
     * @since 1.0.0
     * @return void
     */
    public function search_filter_candidates() {
        if ( ! Easyjobs_Helper::can_update_options() ) {
			echo wp_json_encode(
				array(
					'status'     => 'error',
					'message'    => 'Invalid request !!',
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

		if ( ! isset( $_POST['job_id'] ) || ! isset( $_POST['parameters'] ) ) {
            return;
		};
        $post = $this->build_search_keyword( json_decode( wp_unslash( $_POST['parameters'] ) ));
        echo wp_json_encode(
            $this->get_results(
                sanitize_text_field( wp_unslash( $_POST['job_id'] ) ),
                $post
            )
        );
        wp_die();
    }

    /**
	 * Show job details
     *
     * @param int $id
	 * @return void
     */
    public function show_details() {
        if ( ! Easyjobs_Helper::can_update_options() ) {
			echo wp_json_encode(
				array(
					'status'     => 'error',
					'message'    => 'Invalid request !!',
				)
			);
			wp_die();
        }
		if(!Easyjobs_Helper::verified_request($_POST)){
			echo wp_json_encode(Easyjobs_Helper::get_error_response('Invalid request'));
			wp_die();
		}
		if(!isset($_POST['id'])){
			echo wp_json_encode(Easyjobs_Helper::get_error_response('Candidate id not provided'));
			wp_die();
		}
        $data = $this->get_details( sanitize_text_field($_POST['id']) );
		if(!empty($data)){
			$data->global_ai_enabled = Easyjobs_Helper::is_ai_enabled();
			$data->notes = $this->get_notes( sanitize_text_field($_POST['id']) );
			echo wp_json_encode(Easyjobs_Helper::get_success_response('success', $data));
		}else{
			echo wp_json_encode(Easyjobs_Helper::get_error_response('Unable to get candidate details'));
		}
        wp_die();

    }

    /**
     * Show all candidates
     *
     * @param array $parameters
     * @return void
     */
    public function show_all_candidates( $parameters ) {
        $candidates   = array();
        $total_page   = 1;
        $current_page = 1;

        $jobs                = $this->get_company_jobs();
        $ai_enabled          = Easyjobs_Helper::is_ai_enabled();
        $candidates_response = $this->get_company_candidates( $parameters );

        if ( ! empty( $candidates_response->data ) ) {
            $candidates     = $candidates_response->data;
            $total_page     = (int) ceil( $candidates_response->total / $candidates_response->per_page );
            $current_page   = (int) $candidates_response->current_page;
            $paginate_data  = Easyjobs_Helper::paginate(["current" => $current_page, "max" => $total_page]);
            $pages_to_show  = $paginate_data['items'];
            $length         = count($pages_to_show);
        }

        include EASYJOBS_ADMIN_DIR_PATH . 'partials/easyjobs-all-candidates.php';
    }

    /**
     * Search and filter candidates
     *
	 * @return void
	 */
    public function search_filter_all_candidates() {
        if ( ! Easyjobs_Helper::can_update_options() ) {
			echo wp_json_encode(
				array(
					'status'     => 'error',
					'message'    => 'Invalid request !!',
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
		$parameters = array();
        if ( isset( $_POST['parameters'] ) ) {
            foreach ( $_POST['parameters'] as $key => $value ) {
                $parameters[ sanitize_text_field( $key ) ] = sanitize_text_field( $value );
            }
        };
        echo wp_json_encode( Easyjobs_Api::get( 'company_candidates', $parameters ) );
        wp_die();
    }

    /**
     * ajax callback for export candidates
     *
     * @since 1.3.1
     */
    public function export_job_candidates() {
        if ( ! Easyjobs_Helper::can_update_options() ) {
			echo wp_json_encode(
				array(
					'status'     => 'error',
					'message'    => 'Invalid request !!',
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

		if ( ! isset( $_POST['job_id'] ) || empty( $_POST['job_id'] ) ) {
            echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Job id not provided' ) );
			wp_die();
		}

        echo wp_json_encode( Easyjobs_Helper::get_generic_response(
                Easyjobs_Api::search_within_job(
                    abs( sanitize_text_field( $_POST['job_id'] ) ),
                    '',
                    $this->build_search_keyword( $_POST['keywords'] ),
                    EASYJOBS_APP_URL . '/api/v1/job/' . abs( sanitize_text_field( $_POST['job_id'] ) ) . '/candidates/export'
                )
            )
        );

        wp_die();
    }

	/**
	 *
	 */
	public function get_invited_candidates() {
        if ( ! Easyjobs_Helper::can_update_options() ) {
			echo wp_json_encode(
				array(
					'status'     => 'error',
					'message'    => 'Invalid request !!',
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
		if ( ! isset( $_POST['job_id'] ) || empty( $_POST['job_id'] ) ) {
            echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Job id not provided' ) );
			wp_die();
		}
		$response = Easyjobs_Api::get_by_id(
			'job',
			abs( sanitize_text_field( $_POST['job_id'] ) ),
			'invitations'
		);
		Easyjobs_Helper::check_reload_required( $response );
        echo wp_json_encode( Easyjobs_Helper::get_generic_response(
                $response
            )
        );
        wp_die();
    }

	/**
	 * Ajax callback for save candidate note
     *
	 * @return void
	 * @since 1.3.7
	 */
	public function save_candidate_note() {
        if ( ! Easyjobs_Helper::verified_request($_POST)  || ! Easyjobs_Helper::can_update_options()) {
            echo json_encode(
                array(
					'status'  => 'error',
					'message' => 'Invaild request',
                )
            );
            wp_die();
        }
		if ( ! isset( $_POST['candidate_id'] ) || empty( $_POST['candidate_id'] ) ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Candidate id not provided' ) );
			wp_die();
		}
		$data = array();

        $form_data = json_decode(wp_unslash($_POST['form_data']), true);
		foreach ( $form_data as $d ) {
			if ( $d['name'] == 'note' ) {
				if ( empty( $d['value'] ) ) {
					echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Please write some note' ) );
					wp_die();
				}
				$data['note'] = sanitize_text_field( $d['value'] );
			}
			if ( $d['name'] == 'tag_select' ) {
				$data['tags'][] = $d['value'];
			}
		}

        if(!empty($data['tags'])){		
            $data['tags'] = wp_json_encode($data['tags']);
        }
		echo wp_json_encode( Easyjobs_Helper::get_generic_response(
                Easyjobs_Api::post(
                    'save_candidate_note',
                    abs( sanitize_text_field( $_POST['candidate_id'] ) ),
                    $data
                )
            )
        );
		wp_die();

    }
	/**
	 * Ajax callback for delete candidate note
     *
	 * @return void
	 * @since 1.3.7
	 */
	public function delete_candidate_note() {
        if ( ! Easyjobs_Helper::verified_request($_POST)  || ! Easyjobs_Helper::can_update_options()) {
            echo json_encode(
                array(
					'status'  => 'error',
					'message' => 'Invaild request',
                )
            );
            wp_die();
        }
		if ( ! isset( $_POST['candidate_id'] ) || empty( $_POST['candidate_id'] ) ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Candidate id not provided' ) );
			wp_die();
		}
		if ( ! isset( $_POST['note_id'] ) || empty( $_POST['note_id'] ) ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Note id not provided' ) );
			wp_die();
		}
		echo wp_json_encode( Easyjobs_Helper::get_generic_response(
                Easyjobs_Api::post_custom( EASYJOBS_API_URL . 'job/applicants/' . abs( $_POST['candidate_id'] ) . '/note/' . abs( $_POST['note_id'] ) . '/delete' )
            )
        );
		wp_die();
    }

	/**
	 * Ajax callback: list a candidate's custom fields.
	 *
	 * @return void
	 */
	public function get_custom_fields() {
		if ( ! Easyjobs_Helper::verified_request( $_POST ) || ! Easyjobs_Helper::can_update_options() ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Invalid request' ) );
			wp_die();
		}
		$candidate_id = isset( $_POST['candidate_id'] ) ? absint( $_POST['candidate_id'] ) : 0;
		if ( ! $candidate_id ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Candidate id not provided' ) );
			wp_die();
		}
		echo wp_json_encode( Easyjobs_Helper::get_generic_response(
			Easyjobs_Api::get_custom( EASYJOBS_API_URL . 'job/applicants/' . $candidate_id . '/custom-fields' )
		) );
		wp_die();
	}

	/**
	 * Ajax callback: create or update a candidate custom field.
	 * Pass `field_id` to update an existing field; omit it to create a new one.
	 *
	 * @return void
	 */
	public function save_custom_field() {
		if ( ! Easyjobs_Helper::verified_request( $_POST ) || ! Easyjobs_Helper::can_update_options() ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Invalid request' ) );
			wp_die();
		}
		$candidate_id = isset( $_POST['candidate_id'] ) ? absint( $_POST['candidate_id'] ) : 0;
		if ( ! $candidate_id ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Candidate id not provided' ) );
			wp_die();
		}

		// Sanitise before validating so an array/tags input can't slip through.
		$label = ( isset( $_POST['label'] ) && ! is_array( $_POST['label'] ) )
			? sanitize_text_field( wp_unslash( $_POST['label'] ) )
			: '';
		if ( '' === trim( $label ) ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Field name is required' ) );
			wp_die();
		}

		$value = ( isset( $_POST['value'] ) && ! is_array( $_POST['value'] ) )
			? sanitize_text_field( wp_unslash( $_POST['value'] ) )
			: '';

		// Whitelist the field type; anything unexpected falls back to Text.
		$allowed_types = array( 'Text', 'Number', 'Date', 'URL', 'Email', 'Phone' );
		$type          = isset( $_POST['type'] ) ? sanitize_text_field( wp_unslash( $_POST['type'] ) ) : 'Text';
		if ( ! in_array( $type, $allowed_types, true ) ) {
			$type = 'Text';
		}

		$field_id = isset( $_POST['field_id'] ) ? absint( $_POST['field_id'] ) : 0;
		$data     = array(
			'label' => function_exists( 'mb_substr' ) ? mb_substr( $label, 0, 191 ) : substr( $label, 0, 191 ),
			'value' => function_exists( 'mb_substr' ) ? mb_substr( $value, 0, 2000 ) : substr( $value, 0, 2000 ),
			'type'  => $type,
		);

		$url = $field_id
			? EASYJOBS_API_URL . 'job/applicants/' . $candidate_id . '/custom-field/' . $field_id . '/update'
			: EASYJOBS_API_URL . 'job/applicants/' . $candidate_id . '/custom-field';

		echo wp_json_encode( Easyjobs_Helper::get_generic_response(
			Easyjobs_Api::post_custom( $url, $data )
		) );
		wp_die();
	}

	/**
	 * Ajax callback: delete a candidate custom field.
	 *
	 * @return void
	 */
	public function delete_custom_field() {
		if ( ! Easyjobs_Helper::verified_request( $_POST ) || ! Easyjobs_Helper::can_update_options() ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Invalid request' ) );
			wp_die();
		}
		$candidate_id = isset( $_POST['candidate_id'] ) ? absint( $_POST['candidate_id'] ) : 0;
		$field_id     = isset( $_POST['field_id'] ) ? absint( $_POST['field_id'] ) : 0;
		if ( ! $candidate_id ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Candidate id not provided' ) );
			wp_die();
		}
		if ( ! $field_id ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Field id not provided' ) );
			wp_die();
		}
		echo wp_json_encode( Easyjobs_Helper::get_generic_response(
			Easyjobs_Api::post_custom( EASYJOBS_API_URL . 'job/applicants/' . $candidate_id . '/custom-field/' . $field_id . '/delete' )
		) );
		wp_die();
	}

	// ─────────────────────────────────────────────────────────────────────────
	//  Files & Attachments CRUD
	// ─────────────────────────────────────────────────────────────────────────

	/** Accepted upload extensions + max size (mirrors the app). */
	private function attachment_allowed_extensions() {
		return array( 'jpg', 'jpeg', 'png', 'gif', 'svg', 'mp3', 'mp4', 'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'zip', 'rar' );
	}

	/**
	 * Ajax callback: list a candidate's attachments.
	 *
	 * @return void
	 */
	public function get_attachments() {
		if ( ! Easyjobs_Helper::verified_request( $_POST ) || ! Easyjobs_Helper::can_update_options() ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Invalid request' ) );
			wp_die();
		}
		$candidate_id = isset( $_POST['candidate_id'] ) ? absint( $_POST['candidate_id'] ) : 0;
		if ( ! $candidate_id ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Candidate id not provided' ) );
			wp_die();
		}
		echo wp_json_encode( Easyjobs_Helper::get_generic_response(
			Easyjobs_Api::get_custom( EASYJOBS_API_URL . 'job/applicants/' . $candidate_id . '/attachments' )
		) );
		wp_die();
	}

	/**
	 * Ajax callback: upload a new attachment (multipart with a file).
	 *
	 * @return void
	 */
	public function upload_attachment() {
		if ( ! Easyjobs_Helper::verified_request( $_POST ) || ! Easyjobs_Helper::can_update_options() ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Invalid request' ) );
			wp_die();
		}
		$candidate_id = isset( $_POST['candidate_id'] ) ? absint( $_POST['candidate_id'] ) : 0;
		if ( ! $candidate_id ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Candidate id not provided' ) );
			wp_die();
		}

		$name = ( isset( $_POST['name'] ) && ! is_array( $_POST['name'] ) )
			? sanitize_text_field( wp_unslash( $_POST['name'] ) )
			: '';
		if ( '' === trim( $name ) ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'The name field is required' ) );
			wp_die();
		}

		if ( empty( $_FILES['attachment'] ) || empty( $_FILES['attachment']['tmp_name'] ) ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Please select a file to upload' ) );
			wp_die();
		}

		$file = $_FILES['attachment']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		$file = array(
			'name'     => isset( $file['name'] ) ? sanitize_file_name( $file['name'] ) : '',
			'type'     => isset( $file['type'] ) ? sanitize_mime_type( $file['type'] ) : '',
			'tmp_name' => isset( $file['tmp_name'] ) ? $file['tmp_name'] : '',
			'size'     => isset( $file['size'] ) ? absint( $file['size'] ) : 0,
		);

		// Validate: uploaded via HTTP, size <= 2MB, allowed extension.
		if ( ! is_uploaded_file( $file['tmp_name'] ) ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Invalid file upload' ) );
			wp_die();
		}
		if ( $file['size'] > 2 * 1024 * 1024 ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'File size should be under 2 MB!' ) );
			wp_die();
		}
		$ext = strtolower( pathinfo( $file['name'], PATHINFO_EXTENSION ) );
		if ( ! in_array( $ext, $this->attachment_allowed_extensions(), true ) ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'File type not supported!' ) );
			wp_die();
		}

		$comment = ( isset( $_POST['comment'] ) && ! is_array( $_POST['comment'] ) )
			? sanitize_textarea_field( wp_unslash( $_POST['comment'] ) )
			: '';

		$data = array(
			'name'    => function_exists( 'mb_substr' ) ? mb_substr( $name, 0, 100 ) : substr( $name, 0, 100 ),
			'comment' => function_exists( 'mb_substr' ) ? mb_substr( $comment, 0, 200 ) : substr( $comment, 0, 200 ),
		);

		echo wp_json_encode( Easyjobs_Helper::get_generic_response(
			Easyjobs_Api::post_custom_with_file(
				EASYJOBS_API_URL . 'job/applicants/' . $candidate_id . '/attachment',
				$data,
				$file,
				'attachment'
			)
		) );
		wp_die();
	}

	/**
	 * Ajax callback: update an attachment's name / comment.
	 *
	 * @return void
	 */
	public function update_attachment() {
		if ( ! Easyjobs_Helper::verified_request( $_POST ) || ! Easyjobs_Helper::can_update_options() ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Invalid request' ) );
			wp_die();
		}
		$candidate_id  = isset( $_POST['candidate_id'] ) ? absint( $_POST['candidate_id'] ) : 0;
		$attachment_id = isset( $_POST['attachment_id'] ) ? absint( $_POST['attachment_id'] ) : 0;
		if ( ! $candidate_id || ! $attachment_id ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Invalid request' ) );
			wp_die();
		}
		$name = ( isset( $_POST['name'] ) && ! is_array( $_POST['name'] ) )
			? sanitize_text_field( wp_unslash( $_POST['name'] ) )
			: '';
		if ( '' === trim( $name ) ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'The name field is required' ) );
			wp_die();
		}
		$comment = ( isset( $_POST['comment'] ) && ! is_array( $_POST['comment'] ) )
			? sanitize_textarea_field( wp_unslash( $_POST['comment'] ) )
			: '';
		$data = array(
			'name'    => function_exists( 'mb_substr' ) ? mb_substr( $name, 0, 100 ) : substr( $name, 0, 100 ),
			'comment' => function_exists( 'mb_substr' ) ? mb_substr( $comment, 0, 200 ) : substr( $comment, 0, 200 ),
		);
		echo wp_json_encode( Easyjobs_Helper::get_generic_response(
			Easyjobs_Api::post_custom( EASYJOBS_API_URL . 'job/applicants/' . $candidate_id . '/attachment/' . $attachment_id . '/update', $data )
		) );
		wp_die();
	}

	/**
	 * Ajax callback: delete an attachment.
	 *
	 * @return void
	 */
	public function delete_attachment_file() {
		if ( ! Easyjobs_Helper::verified_request( $_POST ) || ! Easyjobs_Helper::can_update_options() ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Invalid request' ) );
			wp_die();
		}
		$candidate_id  = isset( $_POST['candidate_id'] ) ? absint( $_POST['candidate_id'] ) : 0;
		$attachment_id = isset( $_POST['attachment_id'] ) ? absint( $_POST['attachment_id'] ) : 0;
		if ( ! $candidate_id || ! $attachment_id ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Invalid request' ) );
			wp_die();
		}
		echo wp_json_encode( Easyjobs_Helper::get_generic_response(
			Easyjobs_Api::post_custom( EASYJOBS_API_URL . 'job/applicants/' . $candidate_id . '/attachment/' . $attachment_id . '/delete' )
		) );
		wp_die();
	}

	/**
	 * Same-origin proxy to download / preview an attachment (mirrors stream_resume).
	 * Files sit behind the API token, so we fetch them server-side and stream the
	 * bytes. A sandbox CSP + nosniff neutralises any script in preview-able files
	 * (e.g. SVG/HTML) so an inline preview can't run in the WP-admin origin.
	 *
	 * GET: action=easyjobs_stream_attachment&id=<candidate>&attachment_id=<id>
	 *      &nonce=<easyjobs_react_nonce>[&download=1]
	 *
	 * @return void
	 */
	public function stream_attachment() {
		// Accept the request via POST (nonce in the body — keeps it out of the URL)
		// or GET; either way the capability + nonce are still enforced.
		if ( ! Easyjobs_Helper::can_update_options() || ! Easyjobs_Helper::verified_request( $_REQUEST ) ) {
			status_header( 403 );
			exit;
		}
		$candidate_id  = isset( $_REQUEST['id'] ) ? absint( $_REQUEST['id'] ) : 0;
		$attachment_id = isset( $_REQUEST['attachment_id'] ) ? absint( $_REQUEST['attachment_id'] ) : 0;
		if ( ! $candidate_id || ! $attachment_id ) {
			status_header( 400 );
			exit;
		}

		// Resolve the attachment's direct file URL from the list (same idea as the
		// resume: the API returns a real, fetchable media URL — no download route).
		$list     = Easyjobs_Api::get_custom( EASYJOBS_API_URL . 'job/applicants/' . $candidate_id . '/attachments' );
		$url      = '';
		$filename = 'attachment-' . $attachment_id;
		if ( $list && isset( $list->status ) && 'success' === $list->status && ! empty( $list->data ) ) {
			// The list may be a plain array or a paginator ({ data: [...] }).
			$items = ( is_object( $list->data ) && isset( $list->data->data ) ) ? $list->data->data : $list->data;
			foreach ( (array) $items as $att ) {
				if ( ! is_object( $att ) || (int) ( isset( $att->id ) ? $att->id : 0 ) !== $attachment_id ) {
					continue;
				}
				foreach ( array( 'file', 'attachment', 'url', 'media_url', 'file_url', 'download_url', 'path' ) as $key ) {
					if ( ! empty( $att->$key ) && is_string( $att->$key ) ) {
						$url = $att->$key;
						break;
					}
				}
				if ( ! empty( $att->file_name ) ) {
					$filename = sanitize_file_name( $att->file_name );
				} elseif ( ! empty( $att->name ) ) {
					$filename = sanitize_file_name( $att->name );
				}
				break;
			}
		}
		if ( empty( $url ) ) {
			status_header( 404 );
			exit;
		}

		$response = wp_remote_get(
			esc_url_raw( $url ),
			array(
				'timeout'   => 30,
				'sslverify' => false,
			)
		);
		if ( is_wp_error( $response ) || 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
			status_header( 502 );
			exit;
		}

		$body  = wp_remote_retrieve_body( $response );
		$ctype = wp_remote_retrieve_header( $response, 'content-type' );
		// Keep only safe MIME-header characters (defence-in-depth vs header issues).
		$ctype = is_array( $ctype ) ? '' : preg_replace( '/[^A-Za-z0-9\/\.\-\+;=, ]/', '', (string) $ctype );
		if ( '' === $ctype ) {
			$ctype = 'application/octet-stream';
		}

		$disposition = ! empty( $_REQUEST['download'] ) ? 'attachment' : 'inline';

		nocache_headers();
		header( 'Content-Type: ' . $ctype );
		header( 'Content-Disposition: ' . $disposition . '; filename="' . $filename . '"' );
		header( 'X-Content-Type-Options: nosniff' );
		header( 'Referrer-Policy: no-referrer' );
		// Prevent any embedded script (SVG/HTML) from executing in our origin.
		header( "Content-Security-Policy: default-src 'none'; img-src 'self' data:; media-src 'self' data:; style-src 'unsafe-inline'; sandbox" );
		header( 'Content-Length: ' . strlen( $body ) );
		echo $body; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- binary file stream
		exit;
	}


	public function delete_candidate() {
        if ( ! Easyjobs_Helper::verified_request($_POST) || ! Easyjobs_Helper::can_update_options()) {
            echo json_encode(
                array(
					'status'  => 'error',
					'message' => 'Invaild request',
                )
            );
            wp_die();
        }
        if ( ! isset( $_POST['candidates'] ) || empty( $_POST['candidates'] ) ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Candidates not provided' ) );
			wp_die();
		}
		if ( ! isset( $_POST['job'] ) || empty( $_POST['job'] ) ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Job not provided' ) );
			wp_die();
		}
		$candidates = array();
		foreach (json_decode( $_POST['candidates'] ) as $data ) {
			$candidates[] = sanitize_text_field( $data );
		}
		$response = Easyjobs_Api::post(
            'delete_candidate',
            abs( sanitize_text_field( $_POST['job'] ) ),
            array(
				'candidates' => $candidates,
			)
        );
		if ( Easyjobs_Helper::is_success_response( $response->status ) ) {
			echo wp_json_encode(
                array(
					'status'  => 'success',
					'message' => __( 'Candidate deleted successfully', 'easyjobs' ),
                )
            );
		} else {
			echo wp_json_encode(
                array(
					'status'  => 'error',
					'message' => ! empty( $response->data->message ) ? $response->data->message : __( 'Unable to delete candidate', 'easyjobs' ),
                )
            );
		}
		wp_die();
    }

	/**
	 * Ajax callback for getting pending candidates
	 * @return void
	 * @since 1.5.0
	 */
	public function get_pending_candidates() {
        if ( ! Easyjobs_Helper::can_update_options() ) {
			echo wp_json_encode(
				array(
					'status'     => 'error',
					'message'    => 'Invalid request !!',
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

		if ( ! isset( $_POST['job_id'] ) || empty( $_POST['job_id'] ) ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Job id not provided' ) );
			wp_die();
		}
		$response = Easyjobs_Api::get_by_id(
			'job',
			abs( sanitize_text_field( $_POST['job_id'] ) ),
			'candidate/pending'
		);
		Easyjobs_Helper::check_reload_required( $response );
		echo wp_json_encode( Easyjobs_Helper::get_generic_response(
			$response
		)
		);
		wp_die();
	}

	/**
	 * Ajax callback for delete pending candidate
	 * @return void
	 * @since 1.5.0
	 */
	public function delete_pending_candidate() {
        if ( ! Easyjobs_Helper::verified_request($_POST)  || ! Easyjobs_Helper::can_update_options()) {
            echo json_encode(
                array(
					'status'  => 'error',
					'message' => 'Invaild request',
                )
            );
            wp_die();
        }
		if (empty( $_POST['job_id'] )) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Job not provided' ) );
			wp_die();
		}
		if (empty( $_POST['candidate'] )) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Candidate not provided' ) );
			wp_die();
		}
		echo wp_json_encode( Easyjobs_Helper::get_generic_response(
			Easyjobs_Api::post(
				'delete_pending_candidate',
				abs( sanitize_text_field( $_POST['job_id'] ) ),
				array('candidates' => [sanitize_text_field($_POST['candidate'])])
			)
		)
		);
		wp_die();
	}

	/**
	 * ajax callback for get all company jobs
	 * @since 2.0.0
	 * @return void
	 */
	public function get_candidates(){
        if ( ! Easyjobs_Helper::can_update_options() ) {
			echo wp_json_encode(
				array(
					'status'     => 'error',
					'message'    => 'Invalid request !!',
				)
			);
			wp_die();
        }
		if(!Easyjobs_Helper::verified_request($_POST)){
			echo wp_json_encode(Easyjobs_Helper::get_error_response('Invalid request'));
            wp_die();
		}
		$params = [
			'job_id',
			'page',
			'per_page',
			'rating',
			'pipeline',
			'candidate_name',
			'pipelineType',
			'status',
		];
		$args = [];
		foreach ($params as $param){
			if(isset($_POST[$param])){
				$args[$param] = sanitize_text_field($_POST[$param]);
			}
		}
		if(isset($_POST['rating'])) {
			$args['rating'] = array_map('absint', explode(',', $_POST['rating']));
		}
		if(isset($_POST['status']) && !empty($_POST['status'])) {
			$args['status'] = array_map('absint', explode(',', $_POST['status']));
		}
		$candidates = $this->get_company_candidates( $args );
		if($candidates){
			echo wp_json_encode(Easyjobs_Helper::get_success_response('success', $candidates));
		}else{
			echo wp_json_encode(Easyjobs_Helper::get_error_response('Unable to get candidates'));
		}
		wp_die();
	}

	/**
	 * Get company jobs
	 *
	 * @since 2.0.0
	 * @return void
	 */
	public function get_company_jobs() {
        if ( ! Easyjobs_Helper::can_update_options() ) {
			echo wp_json_encode(
				array(
					'status'     => 'error',
					'message'    => 'Invalid request !!',
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
		$results = Easyjobs_Api::get( 'company_jobs' );
		Easyjobs_Helper::check_reload_required( $results );
		if ( $results && $results->status == 'success' ) {
			echo wp_json_encode(Easyjobs_Helper::get_success_response('success', $results->data));
		}else{
			echo wp_json_encode(Easyjobs_Helper::get_error_response('unable to get company jobs'));
		}
		wp_die();
	}

	/******* private methods *********/
    /**
     * @param $id
     * @return mixed
     */
    private function get_details( $id ) {
        $candidate_details = Easyjobs_Api::get_by_id( 'candidate', $id );
		Easyjobs_Helper::check_reload_required( $candidate_details );
        if ( $candidate_details == null ) {
            return false;
        }
        if ( $candidate_details->status == 'success' ) {
            return $candidate_details->data;
        }
        return false;
    }

    /**
     * Get search and filtered candidates from api
     *
     * @since 1.0.0
     * @param int    $job_id
     * @param string $keywords
     * @return bool|object
     */
    private function get_results( $job_id, $keywords ) {
        $results = Easyjobs_Api::search_within_job( $job_id, 'job_candidates', $keywords );
		Easyjobs_Helper::check_reload_required( $results );
        if ( $results && $results->status == 'success' ) {
            return (object) array(
                'status'     => 'success',
                'candidates' => $results->data->candidates,
            );
        }
        return false;
    }

    /**
     * Get company candidates
     *
     * @param array $parameters
     * @return object|bool
     * @since 2.0.0
     */

    private function get_company_candidates( array $parameters ) {
        $results = Easyjobs_Api::get( 'company_candidates', $parameters );
		Easyjobs_Helper::check_reload_required( $results );
        if ( $results && $results->status == 'success' ) {

            return $results->data;
        }
        return false;
    }

    private function build_search_keyword( $parameters ) {
        $keywords_arr = array();
        foreach ( $parameters as $k => $val ) {
            if ( $k == 'filter' ) {
                foreach ( $val as $v ) {
                    $keywords_arr[] = 'basic[]=' . sanitize_text_field($v);
                }
            } else {
                $value = sanitize_text_field( $val );
                $key   = sanitize_text_field( $k );
                if ( ! empty( $value ) || $value == 0 ) {
                    if ( $key == 'search' ) {
                        $keywords_arr[] = $key . '=' . rawurlencode( $value );
                    } else {
                        $keywords_arr[] = $key . '=' . $value;
                    }
                }
            }
        }
        return implode( '&', $keywords_arr );
    }

	private function get_notes( $candidate_id ) {
		$notes = Easyjobs_Api::get_by_id( 'candidate_note', $candidate_id, 'note' );
		if ( $notes == null ) {
			return null;
		}
		if ( Easyjobs_Helper::is_success_response( $notes->status ) ) {
			return $notes->data;
		}
		return null;
    }

    /**
	 * Ajax callback for getting candidates ID
	 * @return void
	 * @since 1.5.0
	 */
	public function get_ids() {
        if ( ! Easyjobs_Helper::can_update_options() ) {
			echo wp_json_encode(
				array(
					'status'     => 'error',
					'message'    => 'Invalid request !!',
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
		if ( ! isset( $_POST['id'] ) || empty( $_POST['id'] ) ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Job id not provided' ) );
			wp_die();
		}
		$response = Easyjobs_Api::get_by_id(
			'candidate_ids',
			absint( sanitize_text_field( $_POST['id'] ) )
		);
		Easyjobs_Helper::check_reload_required( $response );
		echo wp_json_encode( Easyjobs_Helper::get_generic_response(
			$response
		)
		);
		wp_die();
	}

	// ─────────────────────────────────────────────────────────────────────────
	//  Candidate assessment CRUD (assign / update expire date / delete)
	//
	//  Mirrors the app-end "Assign Assessment" flow on the candidate Evaluation
	//  tab. Only the EasyJobs platform is supported. The write endpoints
	//  (job/{job}/assign-assessment, .../assessment/{id}/update, .../delete)
	//  currently live in the app's v2 SPA API; these handlers target the v1
	//  contract (numeric job_id + numeric applicant/assessment ids) so they are
	//  ready as soon as the matching v1 routes are published.
	// ─────────────────────────────────────────────────────────────────────────

	/**
	 * Validate + normalise an assessment expire date coming from the browser.
	 *
	 * Accepts the app's `MM/DD/YYYY` format (what the backend Carbon-parses) and
	 * rejects anything malformed, non-existent (e.g. 02/30) or in the past.
	 *
	 * @param mixed $raw Raw POST value.
	 * @return string|false Normalised `MM/DD/YYYY` string, or false when invalid.
	 */
	private function sanitize_assessment_expire_date( $raw ) {
		if ( is_array( $raw ) ) {
			return false;
		}
		$value = sanitize_text_field( wp_unslash( $raw ) );
		if ( ! preg_match( '#^(\d{2})/(\d{2})/(\d{4})$#', $value, $m ) ) {
			return false;
		}
		$month = (int) $m[1];
		$day   = (int) $m[2];
		$year  = (int) $m[3];
		if ( ! checkdate( $month, $day, $year ) ) {
			return false;
		}
		// Must be today or later (date-only comparison, matching the app picker's
		// min date for the EasyJobs platform).
		$picked = mktime( 0, 0, 0, $month, $day, $year );
		$today  = mktime( 0, 0, 0, (int) gmdate( 'n' ), (int) gmdate( 'j' ), (int) gmdate( 'Y' ) );
		if ( false === $picked || $picked < $today ) {
			return false;
		}
		return sprintf( '%02d/%02d/%04d', $month, $day, $year );
	}

	/**
	 * Ajax callback: list the company's EasyJobs assessment templates for the
	 * "Select assessment" dropdown. Passes the applicant id so the backend can
	 * flag/exclude assessments already assigned to this candidate.
	 *
	 * @return void
	 */
	public function get_assessment_list() {
		if ( ! Easyjobs_Helper::verified_request( $_POST ) || ! Easyjobs_Helper::can_update_options() ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Invalid request' ) );
			wp_die();
		}
		$candidate_id = isset( $_POST['candidate_id'] ) ? absint( $_POST['candidate_id'] ) : 0;
		if ( ! $candidate_id ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Candidate id not provided' ) );
			wp_die();
		}
		// The list endpoint filters out already-assigned assessments by resolving
		// the applicant via its generated_id (hashid) — send that, not the numeric
		// id, and omit the param entirely when we don't have it so the backend
		// never dereferences a null applicant.
		$applicant_gid = ( isset( $_POST['applicant_gid'] ) && ! is_array( $_POST['applicant_gid'] ) )
			? sanitize_text_field( wp_unslash( $_POST['applicant_gid'] ) )
			: '';
		$base = EASYJOBS_API_URL . 'company/assessments';
		$url  = $applicant_gid
			? add_query_arg( array( 'applicants' => array( $applicant_gid ) ), $base )
			: $base;
		$response = Easyjobs_Api::get_custom( $url );
		Easyjobs_Helper::check_reload_required( $response );
		echo wp_json_encode( Easyjobs_Helper::get_generic_response( $response ) );
		wp_die();
	}

	/**
	 * Ajax callback: assign an EasyJobs assessment to a candidate.
	 *
	 * POST job/{job_id}/assign-assessment
	 * Body: { applicants: [candidate_id], assessment_id, expire_date }
	 *
	 * @return void
	 */
	public function assign_candidate_assessment() {
		if ( ! Easyjobs_Helper::verified_request( $_POST ) || ! Easyjobs_Helper::can_update_options() ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Invalid request' ) );
			wp_die();
		}
		$candidate_id  = isset( $_POST['candidate_id'] ) ? absint( $_POST['candidate_id'] ) : 0;
		$job_id        = isset( $_POST['job_id'] ) ? absint( $_POST['job_id'] ) : 0;
		$assessment_id = isset( $_POST['assessment_id'] ) ? absint( $_POST['assessment_id'] ) : 0;

		if ( ! $candidate_id || ! $job_id ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Candidate or job id not provided' ) );
			wp_die();
		}
		if ( ! $assessment_id ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Please select an assessment.' ) );
			wp_die();
		}
		$expire_date = $this->sanitize_assessment_expire_date( isset( $_POST['expire_date'] ) ? $_POST['expire_date'] : '' );
		if ( false === $expire_date ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'A valid, current or future expire date is required.' ) );
			wp_die();
		}

		$data = array(
			'applicants'    => array( $candidate_id ),
			'assessment_id' => $assessment_id,
			'expire_date'   => $expire_date,
		);
		$response = Easyjobs_Api::post_custom(
			EASYJOBS_API_URL . 'job/' . $job_id . '/assign-assessment',
			$data
		);
		Easyjobs_Helper::check_reload_required( $response );
		echo wp_json_encode( Easyjobs_Helper::get_generic_response( $response ) );
		wp_die();
	}

	/**
	 * Ajax callback: update an assigned assessment's expire date.
	 *
	 * POST job/{job_id}/assessment/{assessment_id}/update
	 * Body: { expire_date }
	 *
	 * @return void
	 */
	public function update_candidate_assessment() {
		if ( ! Easyjobs_Helper::verified_request( $_POST ) || ! Easyjobs_Helper::can_update_options() ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Invalid request' ) );
			wp_die();
		}
		$job_id        = isset( $_POST['job_id'] ) ? absint( $_POST['job_id'] ) : 0;
		$assessment_id = isset( $_POST['assessment_id'] ) ? absint( $_POST['assessment_id'] ) : 0;
		if ( ! $job_id || ! $assessment_id ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Job or assessment id not provided' ) );
			wp_die();
		}
		$expire_date = $this->sanitize_assessment_expire_date( isset( $_POST['expire_date'] ) ? $_POST['expire_date'] : '' );
		if ( false === $expire_date ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'A valid, current or future expire date is required.' ) );
			wp_die();
		}

		$response = Easyjobs_Api::post_custom(
			EASYJOBS_API_URL . 'job/' . $job_id . '/assessment/' . $assessment_id . '/update',
			array( 'expire_date' => $expire_date )
		);
		Easyjobs_Helper::check_reload_required( $response );
		echo wp_json_encode( Easyjobs_Helper::get_generic_response( $response ) );
		wp_die();
	}

	/**
	 * Ajax callback: remove an assigned assessment from a candidate.
	 *
	 * POST job/{job_id}/assessment/{assessment_id}/delete
	 *
	 * @return void
	 */
	public function delete_candidate_assessment() {
		if ( ! Easyjobs_Helper::verified_request( $_POST ) || ! Easyjobs_Helper::can_update_options() ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Invalid request' ) );
			wp_die();
		}
		$job_id        = isset( $_POST['job_id'] ) ? absint( $_POST['job_id'] ) : 0;
		$assessment_id = isset( $_POST['assessment_id'] ) ? absint( $_POST['assessment_id'] ) : 0;
		if ( ! $job_id || ! $assessment_id ) {
			echo wp_json_encode( Easyjobs_Helper::get_error_response( 'Job or assessment id not provided' ) );
			wp_die();
		}
		$response = Easyjobs_Api::post_custom(
			EASYJOBS_API_URL . 'job/' . $job_id . '/assessment/' . $assessment_id . '/delete'
		);
		Easyjobs_Helper::check_reload_required( $response );
		echo wp_json_encode( Easyjobs_Helper::get_generic_response( $response ) );
		wp_die();
	}

}