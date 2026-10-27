<?php

/**
 * Class Easyjobs_Helper
 */
class Easyjobs_Helper {
	/**
	 * easy.jobs job status for a published (active) job.
	 *
	 * @since 2.8.5
	 */
	const JOB_STATUS_PUBLISHED = 2;

	/**
	 * Career-page templates shipped in public/partials/ and public/partials-blocks/.
	 *
	 * @since 2.8.5
	 */
	const TEMPLATES = array( 'default', 'classic', 'elegant' );

	/**
	 * @param $rating
	 * @return void
	 */
	public static function rating_icon( $rating ) {
		for ( $i = 1; $i <= 5; $i++ ) {
			?>
			<div class="rate-count <?php echo $i <= $rating ? esc_html( 'rated has-rating' ) : ''; ?>">
				<i class="easyjobs-icon easyjobs-star"></i>
			</div>
			<?php
		}
	}

	/**
	 * Pagination helper for candidates
	 *
	 * @param array $params
	 * @return array
	 */
	public static function paginate( array $params ) {
		extract($params);
		if ( !isset($current) || !isset($max) ) {
			return null;
		}
		$prev = $current === 1 ? null : $current - 1;
		$next = $current === $max ? null : $current + 1;
		$items = [1];

		if ($current === 1 && $max === 1) {
			return [
				"current"   => $current,
				"prev"      => $prev,
				"next"      => $next,
				"items"     => $items,
			];
		}
		if ($current > 4) {
			array_push($items, "...");
		}
		$r  = 2;
		$r1 = $current - $r;
		$r2 = $current + $r;

		for ($i = $r1 > 2 ? $r1 : 2; $i <= min($max, $r2); $i++) {
			array_push($items, $i);
		}

		if ($r2 + 1 < $max) {
			array_push($items, "...");
		}
		if ($r2 < $max) {
			array_push($items, $max);
		}

		return [
			"current"   => $current,
			"prev"      => $prev,
			"next"      => $next,
			"items"     => $items,
		];
	}

	/**
	 * This function is responsible for making an array sort by their key
	 *
	 * @param  array  $data
	 * @param  string $using
	 * @param  string $way
	 * @return array
	 */
	public static function sorter( $data, $using = 'time_date', $way = 'DESC' ) {
		if ( ! is_array( $data ) ) {
			return $data;
		}
		$new_array = array();
		if ( $using === 'key' ) {
			if ( $way !== 'ASC' ) {
				krsort( $data );
			} else {
				ksort( $data );
			}
		} else {
			foreach ( $data as $key => $value ) {
				if ( ! is_array( $value ) ) {
					continue;
				}
				foreach ( $value as $inner_key => $single ) {
					if ( $inner_key == $using ) {
						$value['tempid']      = $key;
						$single               = self::numeric_key_gen( $new_array, $single );
						$new_array[ $single ] = $value;
					}
				}
			}

			if ( $way !== 'ASC' ) {
				krsort( $new_array );
			} else {
				ksort( $new_array );
			}

			if ( ! empty( $new_array ) ) {
				foreach ( $new_array as $array ) {
					$index = $array['tempid'];
					unset( $array['tempid'] );
					$new_data[ $index ] = $array;
				}
				$data = $new_data;
			}
		}

		return $data;
	}

	/**
	 * This function is responsible for generate unique numeric key for a given array.
	 *
	 * @param  array   $data
	 * @param  integer $index
	 * @return integer
	 */
	private static function numeric_key_gen( $data, $index = 0 ) {
		if ( isset( $data[ $index ] ) ) {
			$index += 1;
			return self::numeric_key_gen( $data, $index );
		}
		return $index;
	}

	/**
	 * This function is responsible for the data sanitization
	 *
	 * @param  array        $field
	 * @param  string|array $value
	 * @return string|array
	 */
	public static function sanitize_field( $field, $value ) {
		if ( isset( $field['sanitize'] ) && ! empty( $field['sanitize'] ) ) {
			if ( function_exists( $field['sanitize'] ) ) {
				$value = call_user_func( $field['sanitize'], $value );
			}
			return $value;
		}

		if ( is_array( $field ) && isset( $field['type'] ) ) {
			switch ( $field['type'] ) {
				case 'text':
					$value = sanitize_text_field( $value );
					break;
				case 'textarea':
					$value = sanitize_textarea_field( $value );
					break;
				case 'email':
					$value = sanitize_email( $value );
					break;
				default:
					return $value;
			}
		} else {
			$value = sanitize_text_field( $value );
		}

		return $value;
	}

	/**
	 * Get single job from api
	 *
	 * @since 1.0.0
	 * @param $job_id
	 * @param bool $cached
	 * @return object|bool
	 */
	public static function get_job( $job_id, $cached = false ) {
		$job_id = absint( $job_id );
		if ( empty( $job_id ) ) {
			return false;
		}

		$transient_key = 'easyjobs_job_details_' . $job_id;
		$stale_key     = 'easyjobs_job_stale_' . $job_id;
		if ( $cached ) {
			$cached_job = get_transient( $transient_key );
			if ( false !== $cached_job ) {
				return $cached_job;
			}
		}

		$job = Easyjobs_Api::get_by_id( 'job', $job_id, 'details' );

		// A 412 (stale state version) response has already refreshed the local state
		// version via update_cache(); retry once so the visitor still gets the job.
		if ( ! empty( $job->reload_required ) ) {
			$job = Easyjobs_Api::get_by_id( 'job', $job_id, 'details' );
		}

		if ( ! empty( $job ) && isset( $job->status ) && 'success' === $job->status && ! empty( $job->data ) ) {
			if ( $cached ) {
				set_transient( $transient_key, $job->data, self::get_job_cache_ttl() );
				// Last known good copy, served if the API is unreachable later on.
				set_transient( $stale_key, $job->data, WEEK_IN_SECONDS );
			}
			return $job->data;
		}

		if ( $cached ) {
			// Only fall back when easy.jobs could not be reached: network error, a
			// non-JSON body (proxy/CDN error page), or a state-version reload that
			// still failed after the retry. Any JSON answer from the API (job removed,
			// not ours, ...) must win, so a job deleted in the app disappears here too.
			$unreachable = empty( $job ) || ! is_object( $job ) || ! empty( $job->reload_required ) || ( isset( $job->error_type ) && 'fetch error' === $job->error_type );
			if ( $unreachable ) {
				$stale_job = get_transient( $stale_key );
				if ( false !== $stale_job ) {
					// Re-check in a few minutes instead of making every visitor wait
					// for the API timeout while easy.jobs is unreachable.
					set_transient( $transient_key, $stale_job, min( 5 * MINUTE_IN_SECONDS, self::get_job_cache_ttl() ) );
					return $stale_job;
				}
			} else {
				delete_transient( $stale_key );
			}
		}
		return false;
	}

	/**
	 * Whether an easy.jobs job may be shown to site visitors.
	 *
	 * Only status 2 (published/active) is public. Drafts (1), archived jobs (3)
	 * and payloads without a status fail closed.
	 *
	 * @since 2.8.5
	 * @param mixed $job Job object from the API (or false).
	 * @return bool
	 */
	public static function is_published_job( $job ) {
		return is_object( $job ) && isset( $job->status ) && self::JOB_STATUS_PUBLISHED === (int) $job->status;
	}

	/**
	 * How long a job's details are cached on the front end before they are
	 * re-fetched from easy.jobs, so edits made in the app show up quickly.
	 *
	 * @since 2.8.2
	 * @return int Seconds.
	 */
	public static function get_job_cache_ttl() {
		$ttl = absint( apply_filters( 'easyjobs_job_details_cache_ttl', 15 * MINUTE_IN_SECONDS ) );
		return $ttl > 0 ? $ttl : 15 * MINUTE_IN_SECONDS;
	}

	/**
	 * Allowed HTML for rich job/company content coming from easy.jobs
	 * (description, responsibilities, benefits, company description).
	 *
	 * @since 2.8.2
	 * @return array
	 */
	public static function get_job_content_allowed_html() {
		$common = array(
			'class' => array(),
			'style' => array(),
		);
		$tags   = array(
			'div', 'p', 'span', 'br', 'hr',
			'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
			'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del', 'ins', 'sub', 'sup', 'small', 'mark',
			'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
			'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
			'figure', 'figcaption',
		);

		$allowed = array();
		foreach ( $tags as $tag ) {
			$allowed[ $tag ] = $common;
		}
		$allowed['a']   = array_merge(
			$common,
			array(
				'href'   => array(),
				'title'  => array(),
				'target' => array(),
				'rel'    => array(),
			)
		);
		$allowed['img'] = array_merge(
			$common,
			array(
				'src'    => array(),
				'alt'    => array(),
				'title'  => array(),
				'width'  => array(),
				'height' => array(),
			)
		);
		$allowed['ol'] = array_merge(
			$common,
			array(
				'start' => array(),
				'type'  => array(),
			)
		);
		foreach ( array( 'th', 'td' ) as $cell ) {
			$allowed[ $cell ] = array_merge(
				$common,
				array(
					'colspan' => array(),
					'rowspan' => array(),
				)
			);
		}

		return apply_filters( 'easyjobs_job_content_allowed_html', $allowed );
	}

	/**
	 * X (formerly Twitter) logo for share buttons. Decorative: the link carries
	 * the accessible name.
	 *
	 * @since 2.8.3
	 * @return string Static SVG markup.
	 */
	public static function get_x_logo_svg() {
		return '<svg class="ej-x-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';
	}

	/**
	 * Sanitize rich job/company content for output.
	 *
	 * On top of the allowlist this drops leading/trailing empty paragraphs
	 * (`<p>&nbsp;</p>`, `<p><br></p>`) that pasted content leaves behind,
	 * keeps in-between ones as blank lines (`<p><br></p>`), and strips inline
	 * margin/padding the easy.jobs editor adds, so every template controls the
	 * indentation of its own content.
	 *
	 * @since 2.8.3
	 * @param string $html Raw HTML from easy.jobs.
	 * @return string Safe HTML.
	 */
	public static function render_job_content( $html ) {
		if ( ! is_string( $html ) || '' === $html ) {
			return '';
		}
		$html = wp_kses( $html, self::get_job_content_allowed_html() );
		// Empty paragraphs, including ones that only wrap empty inline tags (<p><span>&nbsp;</span></p>).
		$empty = '<p\b[^>]*>(?:\s|&nbsp;|&\#160;|\xC2\xA0|<br\s*/?>|</?(?:span|strong|b|em|i|u)\b[^>]*>)*</p>';
		// Leading/trailing ones are leftovers; drop them.
		$html = preg_replace( '#^(?:\s*' . $empty . ')+\s*|\s*(?:' . $empty . '\s*)+$#iu', '', $html );
		// In-between ones are blank lines the author typed; keep each as one visible line.
		$html = preg_replace( '#' . $empty . '#iu', '<p><br></p>', $html );

		return preg_replace_callback(
			'#\sstyle="([^"]*)"#i',
			function ( $matches ) {
				$kept = array();
				foreach ( explode( ';', $matches[1] ) as $declaration ) {
					$property = strtolower( trim( strtok( $declaration, ':' ) ) );
					if ( '' === $property || preg_match( '/^(margin|padding)(-|$)/', $property ) ) {
						continue;
					}
					$kept[] = trim( $declaration );
				}
				return $kept ? ' style="' . implode( '; ', $kept ) . '"' : '';
			},
			$html
		);
	}

	/**
	 * Plain-text teaser of the company description, for templates that show a
	 * short description with a "Read more" link.
	 *
	 * @since 2.8.3
	 * @param object $company Company info object.
	 * @param int    $words   Maximum number of words.
	 * @return array{text:string,has_more:bool} Unescaped text; escape at output.
	 */
	public static function get_company_short_description( $company, $words = 55 ) {
		$html = is_object( $company ) && ! empty( $company->description ) && is_string( $company->description ) ? $company->description : '';
		// Keep a space between block elements so "<p>a</p><p>b</p>" does not become "ab".
		$html  = preg_replace( '#</(p|div|li|h[1-6]|blockquote)>|<br\s*/?>#i', ' ', $html );
		$plain = html_entity_decode( wp_strip_all_tags( $html ), ENT_QUOTES, 'UTF-8' );
		$count = count( preg_split( '/[\n\r\t ]+/', $plain, -1, PREG_SPLIT_NO_EMPTY ) );

		return array(
			'text'     => wp_trim_words( $plain, $words, '…' ),
			'has_more' => $count > $words,
		);
	}

	/**
	 * On-site job address, built the same way as the easy.jobs career page:
	 * "City, State, Country" (empty parts skipped).
	 *
	 * @since 2.8.2
	 * @param object $job Job details object.
	 * @return string Unescaped text; escape at output.
	 */
	public static function get_job_address_text( $job ) {
		if ( ! is_object( $job ) ) {
			return '';
		}
		$parts = array();
		foreach ( array( 'city', 'state', 'country' ) as $field ) {
			if ( ! empty( $job->{$field} ) && is_object( $job->{$field} ) && ! empty( $job->{$field}->name ) ) {
				$name = ucfirst( trim( (string) $job->{$field}->name ) );
				if ( '' !== $name && ! in_array( $name, $parts, true ) ) {
					$parts[] = $name;
				}
			}
		}
		return implode( ', ', $parts );
	}

	/**
	 * Share URLs for a job, pointing at the WordPress job page (not the
	 * easy.jobs career site) so shared traffic lands on this site.
	 *
	 * @since 2.8.2
	 * @param object $job Job details object.
	 * @param string $url Page URL to share. Defaults to the current post permalink.
	 * @return array{facebook:string,twitter:string,linkedin:string}
	 */
	public static function get_job_share_links( $job, $url = '' ) {
		if ( empty( $url ) ) {
			$url = get_the_permalink();
		}
		$title = is_object( $job ) && ! empty( $job->title ) ? wp_strip_all_tags( $job->title ) : '';

		if ( empty( $url ) ) {
			// No WordPress page to point at; fall back to the links easy.jobs provides.
			$links = array(
				'facebook' => ! empty( $job->social_links->facebook ) ? $job->social_links->facebook : '',
				'twitter'  => ! empty( $job->social_links->twitter ) ? $job->social_links->twitter : '',
				'linkedin' => ! empty( $job->social_links->linkedIn ) ? $job->social_links->linkedIn : '',
			);
		} else {
			$encoded_url = rawurlencode( $url );
			$links       = array(
				'facebook' => 'https://www.facebook.com/sharer/sharer.php?u=' . $encoded_url,
				'twitter'  => 'https://twitter.com/intent/tweet?url=' . $encoded_url . ( '' !== $title ? '&text=' . rawurlencode( $title ) : '' ),
				'linkedin' => 'https://www.linkedin.com/sharing/share-offsite/?url=' . $encoded_url,
			);
		}

		return apply_filters( 'easyjobs_job_share_links', $links, $job, $url );
	}

	/**
	 * Convert a hex color (#abc or #aabbcc) to its RGB channels.
	 *
	 * @since 2.8.2
	 * @param string $hex Hex color.
	 * @return int[]|false [r, g, b], or false when the value is not a valid hex color.
	 */
	public static function hex_to_rgb( $hex ) {
		if ( ! is_string( $hex ) || ! preg_match( '/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i', trim( $hex ), $matches ) ) {
			return false;
		}
		$hex = $matches[1];
		if ( 3 === strlen( $hex ) ) {
			$hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
		}
		return array(
			hexdec( substr( $hex, 0, 2 ) ),
			hexdec( substr( $hex, 2, 2 ) ),
			hexdec( substr( $hex, 4, 2 ) ),
		);
	}

	/**
	 * Job deadline in the same "30 Nov, 2026" format the easy.jobs career page uses.
	 *
	 * @since 2.8.2
	 * @param string $expire_at Raw expire_at value from the API.
	 * @return string
	 */
	public static function format_job_deadline( $expire_at ) {
		if ( empty( $expire_at ) ) {
			return '';
		}
		$timestamp = strtotime( str_replace( ', ', '', $expire_at ) );
		if ( false === $timestamp ) {
			return (string) $expire_at;
		}
		return date_i18n( apply_filters( 'easyjobs_job_deadline_format', 'd M, Y' ), $timestamp );
	}

	/**
	 * @return string[][]
	 */
	public static function subscription_constants() {
		return array(
			'plan' => array(
				1 => 'Month',
				2 => 'Year',
				3 => 'Lifetime',
			),
			'type' => array(
				1  => 'Regular',
				50 => 'App Sumo',
				2  => 'Special',
			),
		);
	}

	/**
	 * @return bool
	 */
	public static function is_api_connected() {
		$settings = EasyJobs_DB::get_settings();
		if ( isset( $settings['easyjobs_api_key'] ) && ! empty( $settings['easyjobs_api_key'] ) ) {
			return true;
		}
		return false;
	}

	/**
	 * @param $employment_type
	 * @return string
	 */
	public static function get_employment_badge( $employment_type ) {
		if ( strtolower( $employment_type ) == 'permanent' ) {
			return '<span class="ej-employment-badge permanent">Permanent</span>';
		}
		return '<span class="ej-employment-badge ' . strtolower( $employment_type ) . '">' . $employment_type . '</span>';
	}

	/**
	 * @param $number
	 * @param $text
	 * @return string
	 */
	public static function get_dynamic_label( $number, $text ) {
		$labels      = array(
			'info-label',
			'success-label',
			'primary-label',
			'danger-label',
			'warning-label',
		);
		$label_count = count( $labels );
		if ( $number < $label_count ) {
			return '<span class="ej-label ej-' . $labels[ $number ] . '">' . $text . '</span>';
		} else {
			$number   = $number + 1;
			$position = ( $number - ( floor( $number / $label_count ) * $label_count ) ) - 1;
			return '<span class="ej-label ej-' . $labels[ $position ] . '">' . $text . '</span>';
		}
	}

	/**
	 * Render array in job_id => page_id format
	 *
	 * @since 1.0.0
	 * @param object $jobs
	 * @return array
	 */
	public static function get_job_with_page( $jobs ) {
		$job_with_page = array();
		$pages         = self::get_job_pages( $jobs );
		if ( ! empty( $pages ) ) {
			foreach ( $pages as $page ) {
				$job_with_page[ get_post_meta( $page->ID, 'easyjobs_job_id', true ) ] = $page->ID;
			}
		}

		return $job_with_page;
	}

	/**
	 * Get pages that contains shortcode
	 *
	 * @since 1.0.0
	 * @param object $jobs
	 * @return array|null
	 */
	public static function get_job_pages( $jobs ) {
		$published_jobs_ids = array();
		if ( empty( $jobs ) ) {
			return null;
		}
		foreach ( $jobs as $key => $job ) {
			if ( self::is_published_job( $job ) ) {
				array_push( $published_jobs_ids, $job->id );
			}
		}
		array_push( $published_jobs_ids, 'all' );

		$pages = get_posts(
			array(
				'post_type'      => 'page',
				'posts_per_page' => - 1,
				'meta_query'     => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query -- single indexed meta_key lookup (easyjobs_job_id) over pages only; no alternative API.
					'relation' => 'OR',
					array(
						'key'     => 'easyjobs_job_id',
						'value'   => $published_jobs_ids,
						'compare' => 'IN',
					)
				),
			)
		);
		return $pages;
	}

	/**
	 * Unserialize cached API data (the easyjobs_company_info /
	 * easyjobs_company_details options) without instantiating arbitrary classes.
	 *
	 * The plugin stores json_decode()d API responses, so the only class in the
	 * data is stdClass, which has no magic methods. Any other class in a tampered
	 * value (SQL injection elsewhere, a restored backup, another plugin) becomes
	 * __PHP_Incomplete_Class instead of an object whose __wakeup()/__destruct()
	 * runs (PHP object injection). Do not pass `allowed_classes => false`: that
	 * would also turn the stdClass data into __PHP_Incomplete_Class.
	 *
	 * @since 2.8.5
	 * @param mixed $value Serialized string from get_option().
	 * @return mixed Unserialized data, or false when $value is not a string.
	 */
	public static function unserialize_cached_data( $value ) {
		if ( ! is_string( $value ) || '' === $value ) {
			return false;
		}
		return @unserialize( $value, array( 'allowed_classes' => array( 'stdClass' ) ) ); // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged, WordPress.PHP.DiscouragedPHPFunctions.serialize_unserialize -- plugin-written cache; only stdClass may be instantiated.
	}

	/**
	 * Delete sign-in credential transients left by plugin versions <= 2.8.4.
	 *
	 * Those versions stored the email and password typed into the sign-in form
	 * in an `ej-<sha1>` transient (before 2.8.3 with no expiry) and never read it
	 * back. Runs once after an update (Easyjobs_Maintenance::check_for_update()).
	 * The pattern matches only that exact key shape, so other plugins' `ej-`
	 * transients are left alone.
	 *
	 * @since 2.8.5
	 * @return int Number of option rows deleted.
	 */
	public static function purge_legacy_signin_transients() {
		global $wpdb;
		/** @var \wpdb $wpdb */
		if ( ! is_object( $wpdb ) ) {
			return 0;
		}
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- one-time cleanup of our own leftover transients; core has no API to delete transients by pattern.
		$names = $wpdb->get_col( "SELECT option_name FROM {$wpdb->options} WHERE option_name REGEXP '^_transient_(timeout_)?ej-[0-9a-f]{40}$'" );
		$deleted = 0;
		foreach ( (array) $names as $name ) {
			if ( delete_option( $name ) ) {
				++$deleted;
			}
		}
		return $deleted;
	}

	/**
	 * Get company info
	 * @return object|false
	 */
	public static function get_company_info( $cached = false ) {
		$company_info = get_option( 'easyjobs_company_info' );
		if ( $cached && ! empty( $company_info ) ) {
			return self::unserialize_cached_data( $company_info );
		}
		$settings = EasyJobs_DB::get_settings();
		if ( ! empty( $settings['easyjobs_api_key'] ) ) {
			$company_info = Easyjobs_Api::get( 'company_info' );
			if ( self::is_success_response( $company_info->status ) ) {
				update_option( 'easyjobs_company_info', serialize( $company_info->data ) );
				return $company_info->data;
			}
		}
		return false;
	}
	// state version start
	public static function get_state_version() {
		$state_version = get_transient( 'easyjobs_state_version' );

		if( !$state_version ) {
			$company_info = self::unserialize_cached_data( get_option( 'easyjobs_company_info' ) );
			$state_version = ( !empty( $company_info ) && isset( $company_info->state_version ) ) ? $company_info->state_version : 0;

			set_transient( 'easyjobs_state_version', $state_version );
		}

		return $state_version;
	}

	public static function is_state_version_error( $response ) {
		if( isset( $response->status_code ) && $response->status_code == 412 ) {
			return true;
		}
		return false;
	}

	public static function update_cache(){
		delete_transient( 'easyjobs_state_version' );
		self::clear_job_details_caches();
		EasyJobs_Settings::update_company_cache();
	}

	/**
	 * Clear job-related caches and transients
	 * Called during sync to ensure fresh data is fetched
	 *
	 * @param int|null $job_id Optional. Specific job ID to clear cache for. If null, clears all job details caches.
	 */
	public static function clear_job_details_caches( $job_id = null ) {
		global $wpdb;

		if ( ! empty( $job_id ) ) {
			// Clear cache for a specific job
			delete_transient( 'easyjobs_job_details_' . $job_id );
		} else {
			// Clear all job details transients (easyjobs_job_details_*)
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- bulk-purges our own easyjobs_job_details_* transients by LIKE during sync; core has no API for wildcard transient deletion and the purge itself is the cache invalidation.
			$wpdb->query(
				"DELETE FROM {$wpdb->options}
				WHERE option_name LIKE '%easyjobs_job_details_%'"
			);
		}
	}

	public static function check_reload_required( $response ) {
		if ( isset( $response->reload_required ) && $response->reload_required == true ) {
            echo wp_json_encode(
                array(
                    'reload_required' => 'reload',
                )
            );
            wp_die();
        }
	}
	// state version end


	/**
	 * @param $type
	 * @return string
	 */
	public static function get_social_link_icon( $type ) {
		switch ( strtolower( $type ) ) {
			case 'facebook':
				$icon = '<i class="easyjobs-icon easyjobs-facebook"></i>';
				break;
			case 'linkedin':
				$icon = '<i class="easyjobs-icon easyjobs-linkedin"></i>';
				break;
			case 'twitter':
				$icon = '<i class="easyjobs-icon easyjobs-twitter"></i>';
				break;
			default:
				$icon = '<i class="dashicons dashicons-share"></i>';
				break;
		}
		return $icon;

	}

	/**
	 * Get frontend landing page
	 *
	 * @since 1.0.4
	 * @return int|null
	 */
	public static function get_landing_page() {
		$landing_page_id = get_option( 'easyjobs_parent_page' );
		if ( ! empty( $landing_page_id ) ) {
			return $landing_page_id;
		} else {
			$page = get_posts(
				array(
					'post_type'      => 'page',
					'posts_per_page' => 1,
					'meta_query'     => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query -- single indexed meta_key lookup (easyjobs_job_id) over pages only; no alternative API.
						array(
							'key'     => 'easyjobs_job_id',
							'value'   => 'all',
							'compare' => '=',
						),
					),
				)
			);
		}

		if ( ! empty( $page ) ) {
			return $page[0]->ID;
		}

		return null;
	}

	/**
	 * @param $name
	 * @return string|string[]
	 */
	public static function get_tab_name( $name ) {
		return str_replace( ' ', '-', strtolower( $name ) );
	}

	/**
	 * @param $status
	 * @return string
	 */
	public static function get_job_status_badge( $status ) {
		switch ( $status ) {
			case 1:
				?>
				<div class="thumbnail__status thumbnail__status--warning"> <?php esc_html_e( 'Draft', 'easyjobs' ); ?></div>
				<?php
				break;
			case 2:
				?>
				<div class="thumbnail__status thumbnail__status--success"> <?php esc_html_e( 'Active', 'easyjobs' ); ?></div>
				<?php
				break;
			case 3:
				?>
				<div class="thumbnail__status thumbnail__status--info"> <?php esc_html_e( 'Archived', 'easyjobs' ); ?></div>
				<?php
				break;
			case 4:
				?>
				<div class="thumbnail__status thumbnail__status--danger"> <?php esc_html_e( 'Deleted', 'easyjobs' ); ?></div>
				<?php
				break;
			case 10:
				?>
				<div class="thumbnail__status thumbnail__status--success"> <?php esc_html_e( 'Republished', 'easyjobs' ); ?></div>
				<?php
				break;
			default:
				?>
				<div class="thumbnail__status thumbnail__status--success"> <?php esc_html_e( 'Active', 'easyjobs' ); ?></div>
			<?php

		}
	}

	/**
	 * Create pages for jobs if not created
	 *
	 * @since 1.1.1
	 * @param object $jobs
	 * @param array  $job_with_page_id
	 * @return array
	 */

	public static function create_pages_if_required( $jobs, $job_with_page_id ) {
		$parent_page = null;
		if ( isset( $job_with_page_id['all'] ) && ! empty( $job_with_page_id['all'] ) ) {
			$parent_page = $job_with_page_id['all'];
		}
		$new_job_id_page_id = array();
		if ( empty( $parent_page ) ) {
			$parent_page = self::create_parent_page();
		}
		if ( ! empty( $parent_page ) && ! empty( $jobs ) ) {
			foreach ( $jobs as $key => $job ) {
				if( ! is_object( $job ) || empty($job->id)){
					continue;
				}

				if ( array_key_exists( $job->id, $job_with_page_id ) ) {
					continue;
				}
				$page_id = wp_insert_post(
					array(
						'post_type'     => 'page',
						'post_title'    => $job->title,
						'post_status'   => 'publish',
						'post_parent'   => $parent_page,
						'post_content'  => '[easyjobs_details id=' . $job->id . ']',
						'page_template' => 'easyjobs-template.php',
					)
				);
				if ( $page_id ) {
					update_post_meta( $page_id, 'easyjobs_job_id', $job->id );
					$new_job_id_page_id[ $job->id ] = $page_id;
				}
			}
		}
		return $new_job_id_page_id;
	}


	/**
	 * @param $scores
	 * @return string
	 */
	public static function get_ai_score_circles( $scores ) {
		$html   = '';
		$scores = array_filter(
			(array) $scores,
			function( $s ) {
				return ! empty( $s );
			}
		);

		unset( $scores['final_score'] );

		$sum         = array_sum( $scores );
		$key         = 1;
		$prev_offset = 0;
		$prev_result = 0;
		foreach ( $scores as $name => $score ) {

			$result = (int) round( ( $score / $sum ) * 100 );

			if ( $key == 1 ) {
				$offset = $prev_offset;
			} else {
				$offset      = ( 100 - $prev_result ) + $prev_offset;
				$prev_offset = $offset;
			}

			$prev_result = $result;

			?>
			<circle class="donut-segment" cx="18" cy="18" r="18" fill="transparent" stroke="<?php echo esc_attr( self::get_ai_score_color( esc_attr( $name ) ) ); ?>" stroke-width="3" stroke-dasharray="<?php echo esc_attr( $result ); ?>, <?php echo ( 100 - esc_attr( $result ) ); ?>" stroke-dashoffset="<?php echo esc_attr( $offset ); ?>"></circle>
			<?php

			$key++;
		}

	}

	/**
	 * @param $name
	 * @return string
	 */
	public static function get_ai_score_color( $name ) {
		$colors = array(
			'quiz'        => '#ff9635',
			'skill'       => '#2fc1e1',
			'education'   => '#597dfc',
			'experience'  => '#60ce83',
			'final_score' => '#ff5f74',
		);

		return $colors[ $name ];
	}

	/**
	 * @param $scores
	 */
	public static function get_ai_score_details( $scores ) {
		include EASYJOBS_ADMIN_DIR_PATH . 'partials/easyjobs-ai-score-details.php';
	}

	/**
	 * @param $scores
	 */
	public static function get_ai_score_chart( $scores ) {
		include EASYJOBS_ADMIN_DIR_PATH . 'partials/easyjobs-ai-score-chart.php';
	}

	/**
	 * @param $total
	 * @param $mark
	 * @return float|int
	 */
	public static function get_mark_percentage( $total, $mark ) {
		if ( empty( $total ) ) {
			return 0;
		}
		return round( ( $mark / $total ) * 100 );
	}


	/**
	 * @param $status
	 * @return bool
	 */
	public static function is_success_response( $status ) {
		if ( !empty( $status ) && strtolower( trim( $status ) ) === 'success' ) {
			return true;
		}

		return false;
	}

	/**
	 * @param $name
	 * @return string
	 */
	public static function get_pipeline_label( $name ) {
		if ( empty( $name ) ) {
			return '';
		}
		switch ( strtolower( $name ) ) {
			case 'selected':
				return 'success-label';
			case 'rejected':
				return 'danger-label';
			default:
				return 'primary-label';
		}
	}

	/**
	 * Format api error response to display in frontend
	 *
	 * @param object $error_messages
	 * @since 1.1.2
	 * @return array
	 */

	public static function format_api_error_response( $error_messages ) {
		$errors = array();
		if ( ! self::is_iterable( $error_messages ) ) {
			return array(
				'global' => $error_messages,
			);
		}
		foreach ( $error_messages as $key => $message ) {
			if ( is_array( $message ) ) {
				foreach ( $message as $k => $m ) {
					if ( $k > 1 ) {
						$errors[ $key ] .= ' and ';
					}
					$errors[ $key ] .= $m;

				}
			} else {
				$errors['global'] = ' ' . $message;
			}
		}
		return $errors;
	}

	/**
	 * @param $var
	 * @return bool
	 */
	public static function is_iterable( $var ) {
		return is_array( $var ) || $var instanceof \Traversable || $var instanceof stdClass;
	}

	/**
	 * @param $response
	 * @return array
	 */
	public static function get_generic_response( $response ) {
		if ( empty( $response->status ) ) {
			return self::get_error_response( $response );
		}
		if ( self::is_success_response( $response->status ) ) {
			return array(
				'status' => 'success',
				'data'   => $response->data,
			);
		} else {
			return self::get_error_response( $response->message );
		}
	}

	/**
	 * @param $message
	 * @return array
	 */
	public static function get_error_response( $message, $errors=[] ) {
		return array(
			'status'  => 'error',
			'message' => $message,
			'errors' => $errors
		);
	}

	/**
	 * @return bool|null
	 */
	public static function get_verification_status() {
		if ( $status = get_transient( 'easyjobs_company_verification_status' ) ) {
			return trim( $status ) == 'yes';
		}
		return self::fetch_verification_status();
	}

	/**
	 * Fetch the company verification flag from easy.jobs and cache it for an hour.
	 *
	 * A stale local state version makes easy.jobs answer 412. remote_get() has then
	 * already refreshed the state version via update_cache(), so retry once. A second
	 * reload means the refresh itself failed: give up instead of looping.
	 *
	 * @return bool|null Verified flag, or null when easy.jobs gave no usable answer.
	 */
	public static function fetch_verification_status() {
		$response = Easyjobs_Api::get( 'settings_basic_info' );
		if ( ! empty( $response->reload_required ) ) {
			$response = Easyjobs_Api::get( 'settings_basic_info' );
		}
		if ( ! isset( $response->status, $response->data->is_verified ) || ! self::is_success_response( $response->status ) ) {
			return null;
		}
		$is_verified = (bool) $response->data->is_verified;
		set_transient( 'easyjobs_company_verification_status', $is_verified ? 'yes' : 'no', HOUR_IN_SECONDS );
		return $is_verified;
	}

	/**
	 * Candidate sorting options with values
	 *
	 * @since 1.3.1
	 * @return array[]
	 */
	public static function candidate_sort_options() {
		return array(
			array(
				'title' => 'Sort by experience',
				'value' => 'SORT_BY_EXPERIENCE',
			),
			array(
				'title' => 'Sort by skill match',
				'value' => 'SORT_BY_SKILL_MATCH',
			),
			array(
				'title' => 'Sort by education match',
				'value' => 'SORT_BY_EDUCATION_MATCH',
			),
			array(
				'title' => 'Sort by experience match',
				'value' => 'SORT_BY_EXPERIENCE_MATCH',
			),
			array(
				'title' => 'Sort by AI score',
				'value' => 'SORT_BY_TOTAL_AI_SCORE',
			),
			array(
				'title' => 'Sort by quiz score',
				'value' => 'SORT_BY_QUIZ_SCORE',
			),
		);
	}

	/**
	 * Check if ai setup is enabled and insert it in db if required
	 *
	 * @since 1.3.1
	 * @return bool
	 */
	public static function is_ai_enabled() {
		$exist = EasyJobs_DB::get_settings( 'easyjobs_ai_setup', true );
		if ( $exist ) {
			return $exist === 'yes';
		} else {
			$response = Easyjobs_Api::get( 'ai_setup' );
			if ( self::is_success_response( $response->status ) ) {
				EasyJobs_DB::update_settings( (bool) $response->data->ai_setup_enabled ? 'yes' : 'no', 'easyjobs_ai_setup' );
				return (bool) $response->data->ai_setup_enabled;
			}
		}
		return false;
	}

	/**
	 * @return string
	 */
	public static function customizer_link() {

		$query['autofocus[panel]'] = 'easyjobs_customize_options';
		$query['return']           = admin_url( rawurlencode( 'admin.php?page=easyjobs-settings' ) );

		$job_landing_page = self::get_landing_page();

		if ( ! empty( $job_landing_page ) ) {
			$query['url'] = get_permalink( $job_landing_page );
		}

		return add_query_arg( $query, admin_url( 'customize.php' ) );
	}

	public static function create_parent_page() {
		if(get_transient('easyjobs_parent_creating')){
			return;
		}
		$parent = get_option( 'easyjobs_parent_page' );
		if ( ! $parent ) {
			$has_parent = get_posts(
				array(
					'post_type'      => 'page',
					'posts_per_page' => - 1,
					'meta_query'     => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query -- single indexed meta_key lookup (easyjobs_job_id) over pages only; no alternative API.
						array(
							'key'     => 'easyjobs_job_id',
							'value'   => 'all',
							'compare' => '=',
						),
					),
				)
			);
			if ( ! empty( $has_parent ) ) {
				update_option( 'easyjobs_parent_page', $has_parent[0]->ID );
				return $has_parent[0]->ID;
			} else {
				// Short-lived lock so concurrent requests don't both create the
				// parent page. The third arg is the TTL (was missing, leaving the
				// lock stuck permanently if creation was interrupted mid-flight).
				set_transient( 'easyjobs_parent_creating', true, 5 * MINUTE_IN_SECONDS );
				$page_id = wp_insert_post(
					array(
						'post_type'     => sanitize_text_field( 'page' ),
						'post_title'    => sanitize_text_field( 'Jobs' ),
						'post_status'   => sanitize_text_field( 'publish' ),
						'post_content'  => sanitize_textarea_field( '[easyjobs]' ),
						'page_template' => sanitize_file_name( 'easyjobs-template.php' ),
					)
				);
				if ( $page_id ) {
					update_post_meta( $page_id, 'easyjobs_job_id', 'all' );
					update_option( 'easyjobs_parent_page', $page_id );
					delete_transient('easyjobs_parent_creating');
					return $page_id;
				}
			}
		}

		return $parent;
	}

	/**
	 * @return bool
	 */
	public static function after_disconnect_api(){
		try {
			delete_transient( 'easyjobs_company_verification_status' );
			delete_option( 'easyjobs_ai_setup' );
			delete_option( 'easyjobs_analytics_connected' );
			delete_option( 'easyjobs_settings' );
			delete_option( 'easyjobs_company_info' );
			delete_option( 'easyjobs_company_details' );
			delete_option( 'easyjobs_parent_page' );
			return true;
		} catch ( Exception $e ) {
			return false;
		}
	}

	/**
	 * @param string $message
	 * @param mixed  $data
	 * @return array
	 */
	public static function get_success_response( $message, $data = array() ) {
		return array(
			'status'  => 'success',
			'message' => $message,
			'data'    => $data,
		);
	}

	public static function verified_request($request)
	{
		return isset($request['nonce']) && wp_verify_nonce($request['nonce'], 'easyjobs_react_nonce');
	}

	public static function verified_request_blocks($request)
	{
		return isset($request['blocks_nonce']) && wp_verify_nonce($request['blocks_nonce'], 'easyjobs_blocks_nonce');
	}

	public static function can_update_options()
	{
		return current_user_can('manage_options');
	}

	/**
	 * Whether the site owner opted in to visitor analytics on career pages.
	 *
	 * Visitor analytics sends page views and link clicks from the public job
	 * pages to the easy.jobs analytics service (Matomo). It is off by default
	 * and must be enabled explicitly under Settings → Privacy.
	 *
	 * @since 2.8.3
	 * @return bool
	 */
	public static function is_visitor_analytics_enabled()
	{
		$enabled = 'yes' === get_option( 'easyjobs_visitor_analytics', 'no' );

		/**
		 * Filters whether visitor analytics runs on the career pages.
		 *
		 * @since 2.8.3
		 * @param bool $enabled True when the site owner opted in.
		 */
		return (bool) apply_filters( 'easyjobs_enable_visitor_analytics', $enabled );
	}

	public static function check_verified_request()
	{
		if(isset($_POST['nonce']) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nonce'] ) ), 'easyjobs_react_nonce')){
			return true;
		}
		echo wp_json_encode(self::get_error_response('Invalid request'));
		wp_die();
	}

	/**
	 * Validate an easy.jobs id from a request before it goes into an API path.
	 *
	 * Accepts numeric ids and generated ids (hashids): letters, digits, `_` and
	 * `-`, up to 64 characters. Anything else (`/`, `..`, `?`, spaces) returns ''
	 * so the caller can reject the request. Same rule as
	 * Easyjobs_Admin_Messages::applicant_id().
	 *
	 * @since 2.8.5
	 * @param mixed $value Raw value (already wp_unslash()ed).
	 * @return string The id, or '' when invalid.
	 */
	public static function sanitize_id( $value ) {
		$value = is_scalar( $value ) ? trim( (string) $value ) : '';
		return preg_match( '/^[A-Za-z0-9_-]{1,64}$/', $value ) ? $value : '';
	}

	/**
	 * Map a template name to one the plugin ships, falling back to `default`.
	 *
	 * The name comes from the easy.jobs company settings, so it is never used to
	 * build a file path unless it is on this list (no `../` traversal).
	 *
	 * @since 2.8.5
	 * @param mixed $template Template name.
	 * @return string
	 */
	public static function sanitize_template( $template ) {
		$template = is_string( $template ) ? strtolower( trim( $template ) ) : '';
		return in_array( $template, self::TEMPLATES, true ) ? $template : 'default';
	}

	public static function get_path_by_template($template, $file)
	{
		$template = self::sanitize_template( $template );
		$path = EASYJOBS_PUBLIC_PATH . 'partials/' . $template . '/' . $file . '.php';
		if(file_exists($path)){
			return $path;
		}
		return EASYJOBS_PUBLIC_PATH . 'partials/default/' . $file . '.php';
	}

	public static function get_pagination_url($query_params, $page = null){
		if(!empty($page)){
			$query_params['job_page'] = $page;
		}
		return http_build_query($query_params);
	}

	/**
	 * Job pagination
	 *
	 * @param object $jobs_data     Paginated jobs response.
	 * @param array  $get_data      Sanitized query args.
	 * @param string $permalink     Page URL.
	 * @param int    $prev_page     Previous page number.
	 * @param int    $next_page     Next page number.
	 * @param object $paginate_data Pagination meta.
	 * @return false|string
	 */
	public static function job_pagination($jobs_data, $get_data, $permalink, $prev_page, $next_page, $paginate_data) {
		ob_start();
		?>
			<div class="custom-job-pagination">
				<nav>
					<ul class="pagination">
						<li class="page-item <?php echo $jobs_data->current_page == 1 ? 'disabled' : ''; ?>" aria-disabled="true" aria-label="« Previous">
							<a href="<?php echo esc_url( $prev_page ); ?>" class="page-link" aria-hidden="true">
									<i class="easyjobs-icon easyjobs-arrow-left"></i><span class="pagination-text">Prev</span>
							</a>
						</li>
						<?php 
						for ( $ej_p = 0; $ej_p < count($paginate_data['items']); $ej_p++ ) {
							$dot_class = '';
							if ( "..." == $paginate_data['items'][$ej_p] ) {
								$dot_class = 'dot_li_dashboard';
							}
							$job_page_url = $permalink . "?" . self::get_pagination_url($get_data, $paginate_data['items'][$ej_p]);
						?>
							<li class="page-item <?php echo esc_attr( $dot_class ); echo $jobs_data->current_page == $paginate_data['items'][$ej_p] ? 'active' : ''; ?>" aria-current="page"><a href="<?php echo esc_url($job_page_url)?>" class="page-link"><?php echo esc_html( $paginate_data['items'][$ej_p] ); ?></a></li>
						<?php }?>
						<li class="page-item <?php echo $jobs_data->current_page == $jobs_data->last_page ? 'disabled' : ''; ?>">
							<a class="page-link" href="<?php echo esc_url( $next_page ); ?>" rel="next" aria-label="Next »"><span class="pagination-text">Next</span>
									<i class="easyjobs-icon easyjobs-arrow-right"></i>
							</a>
						</li>
					</ul>
				</nav>
			</div>
		<?php 
		ob_get_flush();
	}

	/**
	 * Job filter and search
	 * @param $jobs array
	 * @return false|string
	 */
	public static function job_filter($jobs, $company = array(), $categories = array(), $locations = array(), $settings = array()){
		ob_start();
		?>
		<form id="ejJobFilterForm" class="ej-job-filter-form job-filter d-flex" action="" method="get">
			<?php if(count($settings)) { ?>
				<?php if( isset($_GET['page_id']) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only query arg, no state change. ?>
					<input type="hidden" id="page_id" name="page_id" value="<?php echo esc_attr( sanitize_text_field( wp_unslash( $_GET['page_id'] ) ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only query arg, no state change. ?>"/>
				<?php } ?>
				<?php if ( (isset($settings['easyjobs_job_filter_by_title_control']) && $settings['easyjobs_job_filter_by_title_control'] === 'yes' )): ?>
					<div class="search-bar">
						<input type="text" id="job_title" name="job_title" value="<?php echo esc_html(self::get_value('job_title')); ?>" class="form-control" placeholder="Job Title">
					</div>
				<?php endif; ?>
				<?php if ( (isset($settings['easyjobs_job_filter_by_category_control']) && $settings['easyjobs_job_filter_by_category_control'] === 'yes') ): ?>
					<div class="select-option category">
						<select name="job_category" id="job_category" value="<?php echo esc_html(self::get_value('job_category'));?>">
							<option value="" <?php echo empty(self::get_value('job_category')) ? 'selected': ''; ?>>
								Select Category
							</option>
							<?php foreach ($categories as $category): ?>
								<option 
									value="<?php echo esc_html($category->id)?>"
									<?php echo self::get_value('job_category') == $category->id ? 'selected' : '' ?>>
									<?php echo esc_html($category->name); ?>
								</option>
							<?php endforeach;?>
						</select>
					</div>
				<?php endif; ?>
				<?php if ( (isset($company->show_location_filter) && $company->show_location_filter) && (isset($settings['easyjobs_job_filter_by_location_control']) && $settings['easyjobs_job_filter_by_location_control'] === 'yes') ): ?>
					<div class="select-option locations">
						<select name="job_location" id="job_location" value="<?php echo esc_html(self::get_value('job_location'));?>">
							<option value="" <?php echo empty(self::get_value('job_location')) ? 'selected': ''; ?>>
								Select Location
							</option>
							<?php foreach ($locations as $location): ?>
								<option value="<?php echo esc_html($location->id)?>" <?php echo self::get_value('job_location') == $location->id ? 'selected' : '' ?>>
									<?php echo esc_html($location->name); ?>
								</option>
							<?php endforeach;?>
						</select>
					</div>
				<?php endif; ?>
				<?php if ( (isset($settings['easyjobs_job_filter_by_title_control']) && $settings['easyjobs_job_filter_by_title_control'] === 'yes') || (isset($settings['easyjobs_job_filter_by_category_control']) && $settings['easyjobs_job_filter_by_category_control'] === 'yes') || ((isset($company->show_location_filter) && $company->show_location_filter) && isset($settings['easyjobs_job_filter_by_location_control']) && $settings['easyjobs_job_filter_by_location_control'] === 'yes') ): ?>
					<div class="d-flex">
						<button class="ej-btn ej-info-btn-light mr15" type="submit"><?php esc_html_e("Submit",'easyjobs');?></button>
						<button id="ej-reset-form" class="ej-btn ej-danger-btn" type="reset"><?php esc_html_e("Reset",'easyjobs');?></button>
					</div>
				<?php endif; ?>
			<?php } else { ?>
				<?php if( isset($_GET['page_id']) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only query arg, no state change. ?>
					<input type="hidden" id="page_id" name="page_id" value="<?php echo esc_attr( sanitize_text_field( wp_unslash( $_GET['page_id'] ) ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only query arg, no state change. ?>"/>
				<?php } ?>
				<?php if ( get_theme_mod('easyjobs_landing_hide_job_search_by_title', true) == '1'): ?>
					<div class="search-bar">
						<input id="job_title" type="text" name="job_title" value="<?php echo esc_html(self::get_value('job_title')); ?>" class="form-control" placeholder="Job Title">
					</div>
				<?php endif; ?>
				<?php if ( get_theme_mod('easyjobs_landing_hide_job_search_by_category', true) == '1'): ?>
					<div class="select-option category">
						<select name="job_category" id="job_category" value="<?php echo esc_html(self::get_value('job_category'));?>">
							<option value="" 
							<?php echo empty(self::get_value('job_category')) ? 'selected': ''; ?>>
								Select Category
							</option>
							<?php foreach ($categories as $category): ?>
								<option 
									value="<?php echo esc_html($category->id)?>"
									<?php echo self::get_value('job_category') == $category->id ? 'selected' : '' ?>>
									<?php echo esc_html($category->name); ?>
								</option>
							<?php endforeach;?>
						</select>
					</div>
				<?php endif; ?>
				<?php if ( (isset($company->show_location_filter) && $company->show_location_filter) && (get_theme_mod('easyjobs_landing_hide_job_search_by_location', true) == '1') ): ?>
					<div class="select-option locations">
						<select name="job_location" id="job_location" value="<?php echo esc_html(self::get_value('job_location'));?>">
							<option value="" <?php echo empty(self::get_value('job_location')) ? 'selected': ''; ?>>
								Select Location
							</option>
							<?php foreach ($locations as $location): ?>
								<option value="<?php echo esc_html($location->id)?>" <?php echo self::get_value('job_location') == $location->id ? 'selected' : '' ?>>
									<?php echo esc_html($location->name); ?>
								</option>
							<?php endforeach;?>
						</select>
					</div>
				<?php endif; ?>
				<?php if ( get_theme_mod('easyjobs_landing_hide_job_search_by_title', true) == '1' || get_theme_mod('easyjobs_landing_hide_job_search_by_category', true) == '1' || ( (isset($company->show_location_filter) && $company->show_location_filter) && get_theme_mod('easyjobs_landing_hide_job_search_by_location', true) == '1' )): ?>
					<div class="d-flex gap-4">
						<button class="ej-btn ej-info-btn-light mr15" type="submit"><?php esc_html_e("Submit",'easyjobs');?></button>
						<button id="ej-reset-form" class="ej-btn ej-danger-btn" type="reset"><?php esc_html_e("Reset",'easyjobs');?></button>
					</div>
				<?php endif; ?>
			<?php } ?>
		</form>
		<p id="ejErrorMessage" class="error-message">Please, provide at least one filed value.</p>
		<?php
		return ob_get_flush();
	}

	/**
	 * Sanitize the generated block CSS (`blockMeta`) printed in a <style> element.
	 *
	 * `blockMeta` is a block attribute, so anyone who can edit a post (Contributor
	 * and up) can put any string in it, and core's kses filtering does not touch
	 * CSS. The editor only ever generates plain declarations, so this removes
	 * what it never generates:
	 * - tags and any `<` (no `</style>` breakout);
	 * - comments and CSS escapes (decoded first, so `@\69mport` is caught);
	 * - `@import` / `@charset` / `@namespace` (loading remote CSS sends every
	 *   visitor's IP to a third party);
	 * - `url()` other than relative, http(s) or data:image (fetches from other
	 *   schemes and script URLs);
	 * - legacy script vectors: `expression(`, `behavior:`, `-moz-binding`,
	 *   `javascript:` / `vbscript:`.
	 *
	 * Layout CSS (sizes, colours, positions) is kept: the block's author already
	 * controls the post they are editing.
	 *
	 * @since 2.8.5
	 * @param mixed $css Raw CSS from the block attribute.
	 * @return string
	 */
	public static function sanitize_block_css( $css ) {
		if ( ! is_string( $css ) || '' === $css ) {
			return '';
		}
		$css = wp_strip_all_tags( $css );
		$css = preg_replace( '#/\*.*?(\*/|$)#s', '', $css );
		// Decode CSS escapes (\69 or \i) so keywords cannot be hidden behind them.
		$css = preg_replace_callback(
			'/\\\\([0-9a-fA-F]{1,6})\s?|\\\\(.)/su',
			static function ( $m ) {
				if ( '' !== $m[1] ) {
					$code = hexdec( $m[1] );
					return ( $code > 0 && $code <= 0x10FFFF && ( $code < 0xD800 || $code > 0xDFFF ) ) ? html_entity_decode( '&#' . $code . ';', ENT_QUOTES, 'UTF-8' ) : '';
				}
				return $m[2];
			},
			$css
		);
		$css = str_replace( array( '<', '\\' ), '', (string) $css );
		$css = preg_replace( '/@(?:import|charset|namespace)\b[^;{}]*;?/i', '', $css );
		$css = preg_replace_callback(
			'/url\s*\(\s*([\'"]?)(.*?)\1\s*\)/is',
			static function ( $m ) {
				$url = trim( $m[2] );
				if ( '' === $url || preg_match( '#^(?:https?:)?//#i', $url ) || preg_match( '#^data:image/(?:png|gif|jpe?g|webp|avif|svg\+xml)[;,]#i', $url ) || ! preg_match( '#^[a-z][a-z0-9+.-]*:#i', $url ) ) {
					return $m[0];
				}
				return 'none';
			},
			$css
		);
		$css = preg_replace( '/expression\s*\(|behavior\s*:|-moz-binding|(?:java|vb)script\s*:/i', '', $css );
		return trim( (string) $css );
	}

	public static function generate_block_style($atts) {
		// Block CSS goes inside <style>, where HTML entities are not decoded, so
		// esc_html()/esc_attr() would corrupt quoted values. sanitize_block_css()
		// strips tags (no "</style>" breakout) and dangerous CSS instead.
		$desktop_css = isset( $atts['blockMeta']['desktop'] ) ? self::sanitize_block_css( $atts['blockMeta']['desktop'] ) : '';
		$tab_css     = isset( $atts['blockMeta']['tab'] ) ? self::sanitize_block_css( $atts['blockMeta']['tab'] ) : '';
		$mobile_css  = isset( $atts['blockMeta']['mobile'] ) ? self::sanitize_block_css( $atts['blockMeta']['mobile'] ) : '';
		?>
		<style>
			<?php echo $desktop_css; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS for a <style> element; tags stripped above, entity escaping would break CSS. ?>
			@media(max-width: 1024px) {
				<?php echo $tab_css; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS for a <style> element; tags stripped above, entity escaping would break CSS. ?>
			}

			@media(max-width: 767px) {
				<?php echo $mobile_css; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS for a <style> element; tags stripped above, entity escaping would break CSS. ?>
			}
		</style>
		<?php
	}

	/**
	 * Job filter and search for job list block
	 * @param $jobs array
	 * @return false|string
	 */
	public static function job_filter_for_blocks($categories = array(), $locations = array(), $settings = array()) {
		ob_start();
		?>
		<?php if ( $settings['filterByTitle'] || $settings['filterByCategory'] || $settings['filterByLocation'] ): ?>
			<form id="ejJobFilterForm" class="ej-job-filter-form job-filter d-flex" action="" method="get">
				<?php if( isset($_GET['page_id']) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only query arg, no state change. ?>
				<input type="hidden" id="page_id" name="page_id" value="<?php echo esc_attr( sanitize_text_field( wp_unslash( $_GET['page_id'] ) ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only query arg, no state change. ?>"/>
				<?php } ?>
				<?php if ( $settings['filterByTitle'] ): ?>
					<div class="search-bar">
						<input type="text" id="job_title" name="job_title" value="<?php echo esc_html(self::get_value('job_title')); ?>" class="form-control" placeholder="Job Title">
					</div>
				<?php endif; ?>
				<?php if ( $settings['filterByCategory'] ): ?>
					<div class="select-option category">
						<select name="job_category" id="job_category" value="<?php echo esc_html(self::get_value('job_category'));?>">
							<option value="" <?php echo empty(self::get_value('job_category')) ? 'selected': ''; ?>>
								Select Category
							</option>
							<?php foreach ($categories as $category): ?>
								<option 
									value="<?php echo esc_html($category->id)?>"
									<?php echo self::get_value('job_category') == $category->id ? 'selected' : '' ?>>
									<?php echo esc_html($category->name); ?>
								</option>
							<?php endforeach;?>
						</select>
					</div>
				<?php endif; ?>
				<?php if ( $settings['filterByLocation'] ): ?>
					<div class="select-option locations">
						<select name="job_location" id="job_location" value="<?php echo esc_html(self::get_value('job_location'));?>">
							<option value="" <?php echo empty(self::get_value('job_location')) ? 'selected': ''; ?>>
								Select Location
							</option>
							<?php foreach ($locations as $location): ?>
								<option value="<?php echo esc_html($location->id)?>" <?php echo self::get_value('job_location') == $location->id ? 'selected' : '' ?>>
									<?php echo esc_html($location->name); ?>
								</option>
							<?php endforeach;?>
						</select>
					</div>
				<?php endif; ?>
				
				<div class="d-flex">
					<button class="ej-btn ej-info-btn-light mr15" type="submit"><?php esc_html_e("Submit",'easyjobs');?></button>
					<button id="ej-reset-form" class="ej-btn ej-danger-btn" type="reset"><?php esc_html_e("Reset",'easyjobs');?></button>
				</div>
			</form>
			<p id="ejErrorMessage" class="error-message">Please, provide at least one filed value.</p>
		<?php
		endif;
		return ob_get_flush();
	}

	public static function get_value($name){
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only query arg (public job filter value), no state change.
		if(isset($_GET[$name])){
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only query arg (public job filter value), no state change.
			return sanitize_text_field( wp_unslash( $_GET[$name] ) );
		}
		return '';
	}

	public static function get_allowed_params_from_request($request)
	{
		$params = ['rows','order','orderby', 'page', 'status','search'];
		$filtered = [];
		foreach ($params as $param){
			if(!empty($request[$param])){
				$filtered[$param] = sanitize_text_field($request[$param]);
			}
		}
		return $filtered;
	}

	/**
	 * Get published job location from api
	 *
	 * @param  array $arg
	 *
	 * @return object|false
	 * @since 2.4.1
	 */
	private static function get_job_locations() {
		$locations = Easyjobs_Api::get( 'job_locations' );

		return $locations->status == 'success' ? $locations->data : array();
	}

	private static function get_categories($jobs, $easyjobs_show_open_job = '')
	{
		$categories = [];
		$inserted = [];
		foreach ($jobs as $job){
			if(!in_array($job->category->id, $inserted) && !$job->is_expired && $easyjobs_show_open_job === 'yes'){
				$categories[] = [
					'id' => $job->category->id,
					'name' => $job->category->name
				];
				$inserted[] = $job->category->id;
			} elseif (!in_array($job->category->id, $inserted)) {
				$categories[] = [
					'id' => $job->category->id,
					'name' => $job->category->name
				];
				$inserted[] = $job->category->id;
			}

		}
		return $categories;
	}

	/**
	 * Get company details
	 * @return object|false
	 */
	public static function get_company_details( $cached = false ) {
		$company_details = get_option( 'easyjobs_company_details' );
		if ( $cached && ! empty( $company_details ) ) {
			return self::unserialize_cached_data( $company_details );
		}
		$settings = EasyJobs_DB::get_settings();
		if ( ! empty( $settings['easyjobs_api_key'] ) ) {
			$company_details = Easyjobs_Api::get( 'company' );
			if ( self::is_success_response( $company_details->status ) ) {
				update_option( 'easyjobs_company_details', serialize( $company_details->data ) );
				return $company_details->data;
			}
		}
		return false;
	}

	public static function get_parent_page_id( ) {
        return get_option( 'easyjobs_parent_page' );
    }

	public static function get_wp_pages( ) {
        return get_option('easyjobs_wp_pages');
    }

	public static function update_wp_pages( $array ) {
		return update_option('easyjobs_wp_pages', $array);
	}

	public static function sync_job_pages( $jobs, $jobs_with_page_id = [] ) {
        $parent_page = self::create_parent_page();
        $new_pages = [];
        if(empty($jobs_with_page_id)){
            $pages = self::get_wp_pages();
            if(!empty($pages)){
	            $jobs_with_page_id = $pages;
            }
        }
		if(!empty($parent_page)){
            $jobs_with_page_id['all'] = $parent_page;
		}
        foreach ($jobs as $job){
	        if( ! is_object( $job ) || empty($job->id)){
		        continue;
	        }

	        if ( array_key_exists( $job->id, $jobs_with_page_id ) ) {
		        continue;
	        }
	        $page_id = wp_insert_post(
		        array(
			        'post_type'     => 'page',
			        'post_title'    => $job->title,
			        'post_status'   => 'publish',
			        'post_parent'   => $parent_page,
			        'post_content'  => '[easyjobs_details id=' . $job->id . ']',
			        'page_template' => 'easyjobs-template.php',
		        )
	        );
	        if ( $page_id ) {
		        update_post_meta( $page_id, 'easyjobs_job_id', $job->id );
		        $new_pages[ $job->id ] = $page_id;
	        }
        }
        if(!empty($new_pages)){
            $new_pages = $jobs_with_page_id + $new_pages;
            Easyjobs_Helper::update_wp_pages($new_pages);
            return $new_pages;
        }
        return $jobs_with_page_id;
    }

	public static function get_job_pages_by_meta(  ) {
        global $wpdb;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- maintenance rebuild of the job=>page map from all easyjobs_job_id meta rows (no core API for that); must read fresh data, result is stored via update_wp_pages().
		$metas = $wpdb->get_results("SELECT * FROM " . $wpdb->prefix . "postmeta WHERE meta_key='easyjobs_job_id' AND meta_value IS NOT NULL ");
        $pages = [];
        if(!empty($metas)){
            foreach ($metas as $meta){
                $pages[$meta->meta_value] = $meta->post_id;
            }
        }
        return $pages;
    }

	public static function easyjobs_header($header) {
		if ( function_exists( 'wp_is_block_theme' ) && wp_is_block_theme() ) {
			?>
            <!doctype html>
            <html <?php language_attributes();?>>
            <head>
                <meta charset="<?php bloginfo( 'charset' );?>">
				<?php wp_head();?>
            </head>
            <body <?php body_class();?>>
			<?php
			if ( function_exists( 'wp_body_open' ) ) {
				wp_body_open();
			} else {
				do_action( 'wp_body_open' ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- core hook, fallback for WordPress < 5.2 where wp_body_open() does not exist.
			}
			?>
			<?php echo $header; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Block theme header template part rendered by core do_blocks(); escaped by the blocks themselves and may contain markup (svg, forms, scripts) that kses would strip. ?>
			<?php
		} else {
			get_header();
		}
	}
	public static function easyjobs_footer($footer) {
		if ( function_exists( 'wp_is_block_theme' ) && wp_is_block_theme() ) {
			echo $footer; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Block theme footer template part rendered by core do_blocks(); escaped by the blocks themselves and may contain markup (svg, forms, scripts) that kses would strip.
			wp_footer();
		} else {
			get_footer();
		}
	}

	public static function view( $name, $template = 'default', $args = array() ) {
        extract( $args );
		// dd($atts);
		$template = self::sanitize_template( $template );
		$path = EASYJOBS_PUBLIC_PATH . 'partials-blocks/' . $template . '/' . $name . '.php';
		if( ! file_exists( $path ) ) {
			$path = EASYJOBS_PUBLIC_PATH . 'partials-blocks/default/' . $name . '.php';
		}
		if ( function_exists( 'get_block_wrapper_attributes' ) ) {
			$wrapper_attributes = get_block_wrapper_attributes();
		} else {
			// WP < 5.6 fallback: the default block class core would add for this block.
			$block_slugs        = array(
				'list'   => 'job-list',
				'info'   => 'job-header',
				'footer' => 'job-footer',
			);
			$wrapper_attributes = isset( $block_slugs[ $name ] ) ? 'class="wp-block-easyjobs-' . $block_slugs[ $name ] . '"' : '';
		}
		ob_start();
		include $path;
		return ob_get_clean();
    }

	/**
	 * Kept for back-compat: renders the "content unavailable" message.
	 *
	 * @return string
	 */
	public static function err_view() {
		return self::render_unavailable();
	}

	/**
	 * Whether the unavailable message was already printed on this request.
	 *
	 * @var bool
	 */
	private static $unavailable_rendered = false;

	/**
	 * Markup shown in place of EasyJobs content (shortcode, block or Elementor
	 * widget) when it cannot render: no API key, or no company data from
	 * easy.jobs. Printed once per request so a career page made of several
	 * blocks shows a single message.
	 *
	 * Admins (manage_options) get a notice with a link to connect; visitors get
	 * a neutral message that leaks no setup details.
	 *
	 * @since 2.8.6
	 * @param string $reason 'disconnected' (no API key) or 'unavailable' (no company data).
	 * @return string
	 */
	public static function render_unavailable( $reason = 'disconnected' ) {
		if ( self::$unavailable_rendered ) {
			return '';
		}
		self::$unavailable_rendered = true;

		$is_admin = current_user_can( 'manage_options' );
		if ( $is_admin ) {
			$message = 'unavailable' === $reason
				? __( 'EasyJobs could not load your company data from easy.jobs, so this content is hidden from visitors.', 'easyjobs' )
				: __( 'EasyJobs is not connected, so this content is hidden from visitors.', 'easyjobs' );
			$html    = sprintf(
				'<div class="easyjobs-shortcode-wrapper ej-unavailable"><div class="elej-error-msg">%s <a href="%s">%s</a></div></div>',
				esc_html( $message ),
				esc_url( admin_url( 'admin.php?page=easyjobs-admin' ) ),
				esc_html__( 'Open EasyJobs settings', 'easyjobs' )
			);
		} else {
			$html = sprintf(
				'<div class="easyjobs-shortcode-wrapper ej-unavailable"><p class="ej-unavailable-msg">%s</p></div>',
				esc_html__( 'Our careers page is temporarily unavailable. Please check back soon.', 'easyjobs' )
			);
		}

		/**
		 * Filters the markup shown when EasyJobs content cannot render.
		 *
		 * Return an empty string to show nothing.
		 *
		 * @since 2.8.6
		 * @param string $html     Markup.
		 * @param string $reason   'disconnected' or 'unavailable'.
		 * @param bool   $is_admin Whether the viewer can manage options.
		 */
		return (string) apply_filters( 'easyjobs_unavailable_output', $html, $reason, $is_admin );
	}

	public static function add_view_url( $jobs ) {
		$job_with_page_id     = Easyjobs_Helper::get_job_with_page( $jobs );
		foreach ( $jobs as $r ) {
			if ( ! self::is_published_job( $r ) ) {
				continue;
			}
			$r->view_url = get_permalink( $job_with_page_id[ $r->id ] );
		}
	}
}
