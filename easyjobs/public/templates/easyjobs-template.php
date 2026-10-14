<?php
/**
 * Template Name: Easyjobs Template
 * Description: Template for easyjobs pages
 *
 * @link       https://easy.jobs
 * @since      1.0.0
 *
 * @package    EasyJobs
 * @subpackage EasyJobs/public
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
$easyjobs_header = '';
$easyjobs_footer = '';
if ( function_exists( 'wp_is_block_theme' ) && wp_is_block_theme() ) {
	$easyjobs_theme_name = wp_get_theme()->get('TextDomain');
	$easyjobs_header = do_blocks('<!-- wp:template-part {"slug":"header","theme":"' . $easyjobs_theme_name . '"} /-->');
	$easyjobs_footer = do_blocks('<!-- wp:template-part {"slug":"footer","theme":"' . $easyjobs_theme_name . '"} /-->');
}
Easyjobs_Helper::easyjobs_header($easyjobs_header);
global $post;

?>
<div class="easyjobs-frontend-wrapper ej-frontend-fluid <?php echo get_post_meta( $post->ID, 'easyjobs_job_id', true ) == 'all' ? 'easyjobs-landing-page' : 'easyjobs-single-page'; ?>">
	<div class="easyjobs-content-wrapper">
		<?php
		/**
		 * Hooks anything before content
		 *
		 * @since 1.0.0
		 */
		do_action( 'easyjobs_before_content' );
		?>

		<?php if ( have_posts() ) : ?>
			<?php
			while ( have_posts() ) :
				the_post();
				?>
				<?php the_content(); ?>
			<?php endwhile; ?>
		<?php endif; ?>

		<?php
		/**
		 * Hooks anything after content
		 *
		 * @since 1.0.0
		 */
		do_action( 'easyjobs_after_content' );
		?>
	</div>
</div>

<?php Easyjobs_Helper::easyjobs_footer($easyjobs_footer); ?>
