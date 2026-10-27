<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://easy.jobs
 * @since      1.0.0
 *
 * @package    Easyjobs
 * @subpackage Easyjobs/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Easyjobs
 * @subpackage Easyjobs/public
 * @author     EasyJobs <support@easy.jobs>
 */
class Easyjobs_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * The elementor widgets list.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      array    $elementor_widgets    The current elementor widgets of this plugin.
	 */

	private $elementor_widgets = [ 'easyjobs-landingpage', 'easyjobs-job-list' ];

	/**
	 * Shortcodes that render EasyJobs content.
	 *
	 * @since 2.8.5
	 * @var string[]
	 */
	const SHORTCODES = array( 'easyjobs', 'easyjobs_list', 'easyjobs_details' );

	/**
	 * Gutenberg blocks that render EasyJobs content.
	 *
	 * @since 2.8.5
	 * @var string[]
	 */
	const BLOCKS = array( 'easyjobs/job-landing', 'easyjobs/job-list', 'easyjobs/job-header', 'easyjobs/job-footer' );

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string $plugin_name       The name of the plugin.
	 * @param      string $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version     = $version;
		add_action( 'wp_head', [ $this, 'easyjobs_generated_frontend_script' ] );
	}

	/**
	 * Register the stylesheets and scripts for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_assets() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Easyjobs_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Easyjobs_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */
        /**
         * Styles
         */
        wp_enqueue_style( $this->plugin_name . 'owl', EASYJOBS_PUBLIC_URL . 'assets/vendor/owl.carousel.min.css', array(), $this->version, 'all' );
        wp_enqueue_style( $this->plugin_name, EASYJOBS_PUBLIC_URL . 'assets/dist/css/easyjobs-public.min.css', array(), $this->version, 'all' );

        /**
         * Scripts
         */

        wp_enqueue_script( $this->plugin_name . 'owl', EASYJOBS_PUBLIC_URL . 'assets/vendor/owl.carousel.min.js', array( 'jquery' ), $this->version, true );
        wp_enqueue_script( $this->plugin_name, EASYJOBS_PUBLIC_URL . 'assets/dist/js/easyjobs-public.min.js', array( 'jquery', $this->plugin_name . 'owl' ), $this->version, true );
	}

	/**
	 * Whether the current front-end request renders EasyJobs content, so the
	 * brand-colour CSS and (when enabled on easy.jobs) Google Translate load.
	 *
	 * Decided per request from the page itself: the EasyJobs page template, or a
	 * singular post whose content has an EasyJobs shortcode or block, or whose
	 * Elementor data has an EasyJobs widget. This replaces the old site-wide
	 * `easyjobs_widgets_or_shortcode` option, which any Contributor's save_post
	 * flipped for the whole site.
	 *
	 * @since 2.8.5
	 * @return bool
	 */
	public function page_uses_easyjobs() {
		$uses = false;
		if ( is_page_template( 'easyjobs-template.php' ) ) {
			$uses = true;
		} elseif ( is_singular() ) {
			$post = get_queried_object();
			if ( $post instanceof WP_Post ) {
				$uses = $this->post_uses_easyjobs( $post );
			}
		}
		/**
		 * Whether to load the EasyJobs front-end assets on this request.
		 *
		 * Use it for EasyJobs content the detection cannot see, for example a
		 * shortcode in a widget area or a theme template.
		 *
		 * @since 2.8.5
		 * @param bool $uses Detected value.
		 */
		return (bool) apply_filters( 'easyjobs_load_frontend_assets', $uses );
	}

	/**
	 * Whether a post contains an EasyJobs shortcode, block or Elementor widget.
	 *
	 * @since 2.8.5
	 * @param WP_Post $post Post to inspect.
	 * @return bool
	 */
	public function post_uses_easyjobs( $post ) {
		$content = (string) $post->post_content;
		if ( $this->has_easyjobs_shortcode( $content ) ) {
			return true;
		}
		if ( function_exists( 'has_block' ) ) {
			foreach ( self::BLOCKS as $block ) {
				if ( has_block( $block, $content ) ) {
					return true;
				}
			}
		}
		$elementor = get_post_meta( $post->ID, '_elementor_data', true );
		if ( is_string( $elementor ) && '' !== $elementor ) {
			$elementor = json_decode( $elementor, true );
		}
		return is_array( $elementor ) && $this->has_widget_or_shortcode( $elementor );
	}

	/**
	 * Whether text contains an EasyJobs shortcode.
	 *
	 * Uses get_shortcode_regex() with our tag names instead of has_shortcode(),
	 * which only matches registered shortcodes (they register on `init`, after
	 * some callers run).
	 *
	 * @since 2.8.5
	 * @param string $content Text to search.
	 * @return bool
	 */
	private function has_easyjobs_shortcode( $content ) {
		return false !== strpos( $content, '[' ) && 1 === preg_match( '/' . get_shortcode_regex( self::SHORTCODES ) . '/', $content );
	}

	/**
	 * Walk an Elementor element tree looking for an EasyJobs widget or a
	 * shortcode widget holding an EasyJobs shortcode.
	 *
	 * @param array $editor_data Elementor elements.
	 * @return bool
	 */
	private function has_widget_or_shortcode( $editor_data ) {
		foreach ( $editor_data as $data ) {
			if ( ! is_array( $data ) ) {
				continue;
			}
			if ( isset( $data['widgetType'] ) ) {
				if ( in_array( $data['widgetType'], $this->elementor_widgets, true ) ) {
					return true;
				}
				if ( 'shortcode' === $data['widgetType'] && isset( $data['settings']['shortcode'] ) && is_string( $data['settings']['shortcode'] ) && $this->has_easyjobs_shortcode( $data['settings']['shortcode'] ) ) {
					return true;
				}
			} elseif ( ! empty( $data['elements'] ) && is_array( $data['elements'] ) && $this->has_widget_or_shortcode( $data['elements'] ) ) {
				return true;
			}
		}
		return false;
	}

	public function easyjobs_generated_frontend_script() {
		if ( $this->page_uses_easyjobs() ) :
			$company_info = Easyjobs_Helper::get_company_details( true );
			if ( ! empty( $company_info ) && ! empty( $company_info->translate_input_fields ) ) {
				$this->enqueue_google_translate( isset( $company_info->lang ) ? $company_info->lang : '' );
			}
			$this->easyjobs_brand_color_css( $company_info );
		endif;
	}

	/**
	 * Load Google Translate on the career pages.
	 *
	 * Runs only when the company enabled "Translate input fields" on easy.jobs.
	 * Disclosed in README.txt → External services.
	 *
	 * @since 2.8.3
	 * @param string $language Target language code from easy.jobs (e.g. "de", "zh-CN").
	 * @return void
	 */
	public function enqueue_google_translate( $language ) {
		wp_enqueue_script(
			'easyjobs-google-translate',
			'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit',
			array(),
			EASYJOBS_VERSION,
			true
		);
		wp_add_inline_script( 'easyjobs-google-translate', $this->get_google_translate_init_script( $language ), 'before' );
	}

	/**
	 * Inline script that sets the target language and the Translate callback.
	 *
	 * @since 2.8.3
	 * @param string $language Target language code.
	 * @return string
	 */
	public function get_google_translate_init_script( $language ) {
		$language = preg_replace( '/[^A-Za-z_-]/', '', (string) $language );
		return 'document.documentElement.classList.add("notranslate");'
			. 'document.cookie = "googtrans=/auto/" + ' . wp_json_encode( $language ) . ';'
			. 'function googleTranslateElementInit() {'
			. 'new google.translate.TranslateElement({}, "google_translate_element");'
			. '}';
	}

	private function colour_brightness($hex, $percent) {
		// Work out if hash given
		$hash = '';
		if (stristr($hex, '#')) {
			$hex  = str_replace('#', '', $hex);
			$hash = '#';
		}
		/// HEX TO RGB
		$rgb = [hexdec(substr($hex, 0, 2)), hexdec(substr($hex, 2, 2)), hexdec(substr($hex, 4, 2))];
		//// CALCULATE
		for ($i = 0; $i < 3; $i++) {
			// See if brighter or darker
			if ($percent > 0) {
				// Lighter
				$rgb[$i] = round($rgb[$i] * $percent) + round(255 * (1 - $percent));
			} else {
				// Darker
				$positivePercent = $percent - ($percent * 2);
				$rgb[$i]         = round($rgb[$i] * (1 - $positivePercent)); // round($rgb[$i] * (1-$positivePercent));
			}
			// In case rounding up causes us to go to 256
			if ($rgb[$i] > 255) {
				$rgb[$i] = 255;
			}
		}
		//// RBG to Hex
		$hex = '';
		for ($i = 0; $i < 3; $i++) {
			// Convert the decimal digit to hex
			$hexDigit = dechex($rgb[$i]);
			// Add a leading zero if necessary
			if (strlen($hexDigit) == 1) {
				$hexDigit = "0" . $hexDigit;
			}
			// Append to the hex string
			$hex .= $hexDigit;
		}
		return $hash . $hex;
	}

	private function easyjobs_brand_color_css( $company_info ) {
		// Company details can be false (not connected yet, or the API call failed);
		// without a brand color there is nothing to print.
		if ( ! is_object( $company_info ) || empty( $company_info->brand_color ) ) {
			return;
		}
		$light_brand_color = '';
		if ( isset( $company_info->selected_template ) && $company_info->selected_template === 'classic' ) {
			$light_brand_color = $this->colour_brightness( $company_info->brand_color, .1 );
		}
		?>
		<style type="text/css">
			.ej-header .ej-btn, 
			.ej-template-classic .carrier__company .button, 
			.ej-template-elegant .ej-company-info .ej-btn,
			.easyjobs-shortcode-wrapper .ej-job-list .ej-job-list-item .ej-job-list-item-inner .ej-job-list-item-col .ej-info-btn-light,
			.ej-template-classic .button__success:not(.hover__highlight),
			.ej-template-elegant .button__primary:not(.hover__highlight),
			.ej-btn.ej-info-btn,
			.ej-template-elegant .button,
			.easyjobs-shortcode-wrapper.ej-template-classic .button__success:not(.hover__highlight) {
				color: #ffffff;
				background-color: <?php echo esc_attr( $company_info->brand_color ); ?>;
			}

			.ej-template-classic .label__primary,
			.ej-template-elegant .label.label__primary,
			.ej-template-classic .label__primary,
			.easyjobs-shortcode-wrapper.ej-template-classic .label__primary {
				background-color: <?php echo esc_attr( $light_brand_color ); ?> !important;
				color: <?php echo esc_attr( $company_info->brand_color ); ?> !important;
			}


			.ej-template-classic .button__success:not(.hover__highlight),
			.ej-template-elegant .button__primary:not(.hover__highlight) {
				border-color: <?php echo esc_attr( $company_info->brand_color ); ?>;
			}


			.ej-header .ej-btn:hover, 
			.ej-template-classic .carrier__company .button:hover, 
			.ej-template-elegant .ej-company-info .ej-btn:hover,
			.easyjobs-shortcode-wrapper .ej-job-list .ej-job-list-item .ej-job-list-item-inner .ej-job-list-item-col .ej-info-btn-light:hover,
			.ej-template-elegant .button__primary:not(.hover__highlight):hover,
			.ej-btn.ej-info-btn:hover,
			.ej-template-elegant .button:hover,
			.easyjobs-shortcode-wrapper.ej-template-classic .button__success:not(.hover__highlight):hover {
				color: #fff;
				background-color: <?php echo esc_attr( $company_info->brand_color ); ?>;
			}


			.ej-section .ej-section-title .ej-section-title-icon,
			.easyjobs-shortcode-wrapper .ej-job-list .ej-job-list-item .ej-job-list-item-inner .ej-job-list-info .ej-job-list-info-block a,
			.easyjobs-shortcode-wrapper .ej-job-list .ej-job-list-item .ej-job-list-item-inner .ej-job-list-info .ej-job-list-info-block span,
			.ej-template-classic .job__card .job__vacancy h4,
			.ej-template-elegant .job__card .job__bottom .job__vacancy h4,
			.ej-template-elegant .section__header .job-filter .select-option:after,
			.ej-template-classic .section__header .job-filter .select-option:after,
			.ej-template-classic .job__card .job__info h3 a:hover,
			.ej-template-classic .job__card .job__info .meta a:hover,
			.ej-template-elegant .job__card h3 a:hover,
			.ej-template-elegant .job__card .meta a:hover,
			.easyjobs-details .ej-content-block h1:before,
			.ej-section .ej-section-title .ej-section-title-icon,
			.easyjobs-shortcode-wrapper .ej-job-list .ej-job-list-item .ej-job-list-item-inner .ej-job-list-item-col .ej-job-list-info .ej-job-list-info-block a {
				color: <?php echo esc_attr( $company_info->brand_color ); ?>;
			}
			.ej-template-elegant .company__description ul li::before,
			.ej-template-elegant .job__details .job__details__block__list li::before,
			.easyjobs-shortcode-wrapper.ej-template-classic .company__description ul li:before {
				background-color: <?php echo esc_attr( $company_info->brand_color ); ?> !important;
			}
			<?php
			$brand_rgb = Easyjobs_Helper::hex_to_rgb( isset( $company_info->brand_color ) ? $company_info->brand_color : '' );
			if ( $brand_rgb ) :
				$brand_rgb = implode( ', ', $brand_rgb );
				?>
			.ej-btn.ej-info-btn,
			.ej-btn.ej-info-btn:hover,
			.ej-btn.ej-info-btn:focus,
			.ej-btn.ej-info-btn-light:hover {
				box-shadow: 0 10px 10px rgba(<?php echo esc_attr( $brand_rgb ); ?>, 0.3);
			}

			.easyjobs-details .ej-content-block ul li::before {
				background-color: rgb(<?php echo esc_attr( $brand_rgb ); ?>);
			}

			.ej-section .ej-section-title .ej-section-title-icon,
			.easyjobs-details .ej-content-block h1:before {
				background-color: rgba(<?php echo esc_attr( $brand_rgb ); ?>, 0.1);
			}

			.easyjobs-details .ej-remote-label {
				background-color: rgba(<?php echo esc_attr( $brand_rgb ); ?>, 0.15);
				color: rgb(<?php echo esc_attr( $brand_rgb ); ?>);
			}

			/* Company description Read more / Show less, in every state (as on the career page). */
			.easyjobs-shortcode-wrapper .ej-section .ej-read-more,
			.easyjobs-shortcode-wrapper .ej-section .ej-read-more:hover,
			.easyjobs-shortcode-wrapper .ej-section .ej-read-more:focus,
			.easyjobs-shortcode-wrapper .ej-section .ej-read-more:active,
			.easyjobs-shortcode-wrapper .about__company .ej-modal-trigger,
			.easyjobs-shortcode-wrapper .about__company .ej-modal-trigger:visited,
			.easyjobs-shortcode-wrapper .about__company .ej-modal-trigger:hover,
			.easyjobs-shortcode-wrapper .about__company .ej-modal-trigger:focus,
			.easyjobs-shortcode-wrapper .about__company .ej-modal-trigger:active {
				color: rgb(<?php echo esc_attr( $brand_rgb ); ?>) !important;
			}

			/* Pinned job corner badge + job type label on the job list. */
			.ej-has-badge:before {
				border-top-color: rgb(<?php echo esc_attr( $brand_rgb ); ?>);
			}

			.ej-section .ej-job-list .primary-label {
				background-color: rgba(<?php echo esc_attr( $brand_rgb ); ?>, 0.1);
				color: rgb(<?php echo esc_attr( $brand_rgb ); ?>);
			}
			<?php endif; ?>
		</style>
		<?php
	}

    /**
     * Initialize public functions
     *
     * @since 1.0.0
     * @return void
     */
    public function init() {
		// Register the shortcodes even without an API key, so a disconnected site
		// shows the "unavailable" message instead of the raw shortcode text.
		new Easyjobs_Shortcode();
		if ( ! $this->is_api_key_set() ) {
            return;
		}
		add_action('easyjobs_job_filter', [$this, 'job_filter'], 10, 1);
    }

	/**
	 * Ask search engines not to index EasyJobs pages while the API is
	 * disconnected: they only show the "unavailable" message then.
	 *
	 * Hooked to core `wp_robots` and to the Yoast SEO / Rank Math robots
	 * filters, which replace the core robots tag when those plugins are active.
	 * All three pass an array keyed by directive.
	 *
	 * @since 2.8.6
	 * @param array $robots Robots directives.
	 * @return array
	 */
	public function noindex_when_disconnected( $robots ) {
		if ( ! is_array( $robots ) || $this->is_api_key_set() || ! $this->page_uses_easyjobs() ) {
			return $robots;
		}
		if ( 'wp_robots' === current_filter() ) {
			$robots['noindex'] = true;
			unset( $robots['index'] );
		} else {
			$robots['index'] = 'noindex';
		}
		return $robots;
	}

    /**
     * Check if api key is set in database
     *
     * @since 1.0.0
     * @return bool
     */
    private function is_api_key_set() {
         $settings = EasyJobs_DB::get_settings();
        if ( ! empty( $settings['easyjobs_api_key'] ) ) {
            return true;
        }
        return false;
    }

	/**
	 * Register elementor category
	 *
	 * @param $elements_manager
	 *
	 * @return void
	 * @since 1.0.4
	 */
	public function register_widget_categories( $elements_manager ) {
		$elements_manager->add_category(
			'easyjobs',
			array(
				'title' => 'EasyJobs',
				'icon'  => 'font',
            ),
            1
        );
	}
	/**
	 * Register Elementor widget
	 *
	 * @param $widgets_manager
	 *
	 * @return void
	 * @since 1.0.4
	 */
	public function register_widget( $widgets_manager ) {
		// require file
		require_once EASYJOBS_PUBLIC_PATH . '../includes/elementor/trait-easyjobs-elementor-template.php';
		require_once EASYJOBS_PUBLIC_PATH . '../includes/elementor/class-easyjobs-elementor-landingpage.php';
		require_once EASYJOBS_PUBLIC_PATH . '../includes/elementor/class-easyjobs-elementor-job-list.php';

		$widgets_manager->register_widget_type( new Easyjobs_Elementor_Landingpage() );
		$widgets_manager->register_widget_type( new Easyjobs_Elementor_Job_List() );
	}
    /**
     * Job filter and search
     * @param $jobs array
     * @return false|string
	 */
	public function job_filter($jobs){
		ob_start();
		?>
        <form class="ej-job-filter-form job-filter d-flex">
            <div class="search-bar">
                <input type="text" name="job_title" value="" class="form-control" placeholder="Job Title">
            </div>
            <div class="select-option">
                <select name="job_category">
                    <option value="0" disabled selected>Select Category</option>
                    <?php foreach ($this->get_categories($jobs) as $category): ?>
                        <option value="<?php echo esc_html($category['id'])?>"><?php echo esc_html($category['name']); ?></option>
                    <?php endforeach;?>
                </select>
            </div>
            <button class="ej-btn ej-info-btn-light" type="submit"><?php esc_html_e("Submit",'easyjobs');?></button>
            <a href="/" class="ej-btn ej-danger-btn"><?php esc_html_e("Reset",'easyjobs');?></a>
        </form>
		<?php
		return ob_get_flush();
	}

	public function get_categories($jobs)
	{
        $categories = [];
        $inserted = [];
        foreach ($jobs as $job){
            if(!in_array($job->category->id, $inserted)){
				$categories[] = [
					'id' => $job->category->id,
					'name' => $job->category->name
				];
                $inserted[] = $job->category->id;
			}

		}
        return $categories;
    }
}
