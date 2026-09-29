<?php
/**
 * Render job details for shortcode
 *
 * @since 1.0.0
 */

global $post;
?>
<div class="easyjobs-shortcode-wrapper ej-template-classic translate">
	<?php if ( ! empty( $company ) && ! empty( $job ) ) : ?>
		<?php
		/**
		 * Hooks anything before job details
		 *
		 * @since 1.0.0
		 */
		do_action( 'easyjobs_before_job_details' );
		?>
        <div class="pb100 mt60">
            <div class="ej-container">
                <div class="ej-row">
                    <div class="ej-col-lg-7">
                        <div class="job__details easyjobs-details">
                            <h1 class="job__title"><?php echo esc_html($job->title)?></h1>
                            <div class="meta">
								<?php $ej_job_address = Easyjobs_Helper::get_job_address_text( $job ); ?>
								<?php if ( $job->is_remote || (isset($job->remote_location_type) && $job->remote_location_type === 'specific') || '' !== $ej_job_address ) { ?>
									<span class="label label__primary">
										<i class="easyjobs-icon easyjobs-map-maker"></i>
										<?php if ( isset($job->remote_location_type) && $job->remote_location_type === 'specific' ) : ?>
											<?php if ( !empty($job->remote_countries) ) : ?>
												<?php
													$country_names = array_map( function( $country ) {
														return esc_html( $country->name );
													}, $job->remote_countries );
													echo implode( ', ', $country_names );
												?>
											<?php else : ?>
												<?php esc_html_e( 'Remote', 'easyjobs' ); ?>
											<?php endif; ?>
										<?php elseif ( $job->is_remote ) : ?>
											<?php esc_html_e( 'Anywhere', 'easyjobs' ); ?>
										<?php else : ?>
											<?php echo esc_html( $ej_job_address ); ?>
										<?php endif ?>
									</span>
								<?php } ?>

								<?php if ( ! empty( $job->job_type ) ) { ?>
									<span class="label label__primary"> <i class="easyjobs-icon"></i>
										<?php echo ucfirst(esc_html( $job->job_type )); ?>
									</span>
								<?php } ?>

								<?php if ( ! empty( $job->salary ) ) { ?>
									<span class="label label__primary"> <i class="easyjobs-icon easyjobs-credit-card"></i>
										<?php echo esc_html( $job->salary ) . ' ' . esc_html( $job->salary_type->name ); ?>
									</span>
								<?php } ?>
                            </div>
                            <div class="ej-mobile-apply">
                                <a href="<?php echo esc_url( $job->apply_url ); ?>" class="button button__success button__radius" target="_blank">
                                    <?php esc_html_e( 'Apply Now', 'easyjobs' ); ?>
                                </a>
                                <p class="deadline">
                                    <i class="easyjobs-icon easyjobs-calender"></i>
                                    <span><?php esc_html_e( 'Deadline', 'easyjobs' ); ?>:</span>
                                    <?php echo esc_html( Easyjobs_Helper::format_job_deadline( $job->expire_at ) ); ?>
                                </p>
                            </div>
							<?php if ( ! empty( $job->skills ) ) : ?>
                            <div class="job__details__block ej-content-block mt60">
                                <h3 class="title"><?php esc_html_e( 'Skills', 'easyjobs' ); ?></h3>
                                <div class="required__skill">
                                    <ul>
                                        <?php foreach ($job->skills as $skill): ?>
                                        <li><?php echo esc_html($skill->name);?></li>
                                        <?php endforeach;?>
                                    </ul>
                                </div>
                            </div>
                            <?php endif;?>
							<?php if ( ! is_null( $job->requirements ) && $job->requirements != "<p><br></p>" ) : ?>
                            <div class="job__details__block ej-content-block mt60">
                                <h3 class="title"><?php echo esc_html( get_theme_mod( 'easyjobs_single_job_description_title', __( 'Description','easyjobs' ) ) ); ?></h3>
                                <div class="company__description">
									<?php
									echo Easyjobs_Helper::render_job_content( $job->requirements ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- sanitized with wp_kses.
									?>
                                </div>
                            </div>
							<?php endif;?>
							<?php if ( ! is_null( $job->responsibilies ) && $job->responsibilies != "<p><br></p>" ) : ?>
                            <div class="job__details__block ej-content-block mt60">
                                <h3 class="title">
									<?php echo esc_html( get_theme_mod( 'easyjobs_single_job_responsibility_title' ,__('Job Responsibilities', 'easyjobs')) ); ?>
                                </h3>
                                <div class="company__description">
									<?php
									echo Easyjobs_Helper::render_job_content( $job->responsibilies ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- sanitized with wp_kses.
									?>
                                </div>
                            </div>
							<?php endif;?>
                            <?php if(!empty($job->other_benefits)) : ?>
                            <div class="job__details__block ej-content-block mt60">
                                <h3 class="title">
									<?php echo esc_html( get_theme_mod( 'easyjobs_single_job_benefits_title', __('Benefits', 'easyjobs')) ); ?>
                                </h3>
                                <div class="company__description">
									<?php
									echo Easyjobs_Helper::render_job_content( $job->other_benefits ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- sanitized with wp_kses.
									?>
                                </div>
                            </div>
							<?php endif;?>
                        </div>
                    </div>
                    <div class="ej-col-lg-5">
                        <div class="job__more__details">
                            <a href="<?php echo esc_url( $job->apply_url ); ?>" class="button button__success button__radius" target="_blank">
								<?php _e('Apply Now', 'easyjobs')?>
                            </a>
                            <p class="deadline">
                                <i class="easyjobs-icon easyjobs-calender"></i>
                                <span>
                                    <?php _e('Deadline', 'easyjobs')?>:
                                </span> <?php echo esc_html( Easyjobs_Helper::format_job_deadline( $job->expire_at ) ); ?>
                            </p>
							<?php if ( get_theme_mod( 'easyjobs_single_show_experience_level', false ) && ! empty( $job->experience_level->name ) ) { ?>
								<p class="deadline">
									<i class="easyjobs-icon easyjobs-briefcase-2"></i>
									<span>
										<?php _e('Experience', 'easyjobs')?>:
									</span> <?php echo esc_html($job->experience_level->name); ?>
								</p>
							<?php } ?>
                            <div class="infos">
                                <div class="info">
                                    <p>
                                        <?php
                                            if($job->employment_type->id == 99 && trim(strtolower($job->employment_type->name)) == 'other'){
                                                echo esc_html($job->meta->employment_type_other);
                                            }else{
                                                echo esc_html($job->employment_type->name);
                                            }
                                        ?>
                                    </p>
                                    <span><?php _e('Job Type', 'easyjobs')?></span>
                                </div>
								<?php if ( ! empty( $job->vacancies ) ) { ?>
									<div class="info">
										<p><?php echo ! empty( $job->vacancies ) ? esc_html( $job->vacancies ) : 'N/A'; ?></p>
										<span><?php _e('No of vacancies', 'easyjobs')?></span>
									</div>
								<?php } ?>
                            </div>
							<?php if ( ! empty( $job->office_time ) ) { ?>
								<p class="office__time">
									<i class="easyjobs-icon easyjobs-clock"></i>
									<span><?php _e('Office Time', 'easyjobs')?>:</span>
									<?php echo esc_html( $job->office_time ); ?>
								</p>
							<?php } ?>

							<?php $ej_company_short = Easyjobs_Helper::get_company_short_description( $company ); ?>
							<?php if ( '' !== $ej_company_short['text'] ) : ?>
								<div class="about__company">
									<p>
										<?php echo esc_html( $ej_company_short['text'] ); ?>
										<?php if ( $ej_company_short['has_more'] ) : ?>
											<a href="#" class="ej-modal-trigger"><?php esc_html_e( 'Read more', 'easyjobs' ); ?></a>
										<?php endif; ?>
									</p>
								</div>
							<?php endif; ?>
							<?php if ( ! get_theme_mod( 'easyjobs_single_disable_social_sharing', false ) ) : ?>
							<?php $ej_share_links = Easyjobs_Helper::get_job_share_links( $job ); ?>
                            <div class="share__options">
                                <p> <?php _e('Share on', 'easyjobs')?>:</p>
                                <ul>
									<?php if ( ! get_theme_mod( 'easyjobs_single_disable_social_sharing_fb', false ) ) : ?>

                                        <li>
                                            <a href="<?php echo esc_url( $ej_share_links['facebook'] ); ?>" class="ej-social-button social-button semi-button-primary facebook" target="_blank" rel="noopener noreferrer" aria-label="<?php esc_attr_e( 'Share on Facebook', 'easyjobs' ); ?>">
                                                <i class="easyjobs-icon easyjobs-facebook" aria-hidden="true"></i>
                                            </a>
                                        </li>
									<?php endif; ?>
									<?php if ( ! get_theme_mod( 'easyjobs_single_disable_social_sharing_twitter', false ) ) : ?>
                                        <li>
                                            <a href="<?php echo esc_url( $ej_share_links['twitter'] ); ?>" class="ej-social-button social-button semi-button-primary twitter" target="_blank" rel="noopener noreferrer" aria-label="<?php esc_attr_e( 'Share on X', 'easyjobs' ); ?>">
                                                <?php echo Easyjobs_Helper::get_x_logo_svg(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static markup. ?>
                                            </a>
                                        </li>
									<?php endif; ?>
									<?php
									if ( ! get_theme_mod( 'easyjobs_single_disable_social_sharing_linkedin', false ) ) :
										?>
                                        <li>
                                            <a href="<?php echo esc_url( $ej_share_links['linkedin'] ); ?>" class="ej-social-button social-button semi-button-primary linkedin" target="_blank" rel="noopener noreferrer" aria-label="<?php esc_attr_e( 'Share on LinkedIn', 'easyjobs' ); ?>">
                                                <i class="easyjobs-icon easyjobs-linkedin" aria-hidden="true"></i>
                                            </a>
                                        </li>
									<?php endif; ?>
                                </ul>
                            </div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="ej-modal">
            <div class="ej-modal-inner" role="document">
                <div class="ej-modal-content">
                    <div class="ej-modal-header">
                        <h5 class="ej-modal-title">
                            <?php _e('Company Description', 'easyjobs');?>
                        </h5>
                        <button type="button" class="ej-modal-close" aria-label="<?php esc_attr_e( 'Close', 'easyjobs' ); ?>">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="ej-modal-body">
                        <div class="company__description">
                            <?php echo Easyjobs_Helper::render_job_content( isset( $company->description ) ? $company->description : '' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- sanitized with wp_kses. ?>
                        </div>
                    </div>
                    <div class="ej-modal-footer">
                        <button type="button" class="btn btn-secondary ej-modal-close">
                            <?php _e('Close', 'easyjobs');?>
                        </button>
                    </div>
                </div>
            </div>
        </div>
		<?php
		/**
		 * Hooks anything after job details
		 *
		 * @since 1.0.0
		 */
		do_action( 'easyjobs_after_job_details' );
		?>
	<?php endif; ?>
</div>
