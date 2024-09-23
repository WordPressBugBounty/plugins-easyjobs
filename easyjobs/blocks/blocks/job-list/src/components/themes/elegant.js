import { __ } from '@wordpress/i18n';

import JobFilter from "./common/filter";
import Pagination from './common/pagination';

const {
    DynamicInputValueHandler,
} = window.EJControls;

const Elegant = ({props, jobsData}) => {
	const {setAttributes, attributes} = props;
	const {
		titleText, 
		hideTitle,
		applyBtnText, 
		filterByTitle, 
		filterByCategory, 
		filterByLocation,
		showCompanyName,
		showLocation,
		showDateLine,
		showNoOfJob,
	} = attributes;
	
    return (
        <>
			<div className='ej-job-body easyjobs-blocks easyjobs-blocks-job-list'>
				<div class="easyjobs-shortcode-wrapper ej-template-elegant" id="easyjobs-list">
					<div class="ej-section">
						<div class="section__header section__header--flex ej-job-filter-wrap">
							{!hideTitle &&
								<div class="ej-section-title">
									<span class="ej-section-title-text">
									<DynamicInputValueHandler
										placeholder={__("Add title..", "essential-blocks")}
										className="eb-button-text"
										value={titleText}
										onChange={(newText) => setAttributes({ titleText: newText })}
										allowedFormats={[
											"core/bold",
											"core/italic",
											"core/strikethrough",
										]}
									/>
									</span>
								</div>
							}
							{(filterByTitle || filterByCategory || filterByLocation) && 
								<JobFilter 
									props={props}
									categories={jobsData.categories} 
									locations={jobsData.locations}
								/>
							}
						</div>
					</div>
					<div class="ej-job-list ej-job-list-elegant">
						<div class="ej-row">
							{jobsData.jobs.data && jobsData.jobs.data.map((job, i) => {
								return (
									<div class="ej-col-lg-6 ej-job-list-item-cat">
										<div class="job__card <?php if(isset($job->is_pinned) && $job->is_pinned) echo 'ej-has-badge'?>">
											<h3 class="ej-job-title">
												<a onClick={(e)=>e.preventDefault()} href="#"
											>
													{job.title}
												</a>
											</h3>
											<p class="meta">
												{showCompanyName && (
													<>
														<i class="easyjobs-icon easyjobs-briefcase"> </i>
														<a onClick={(e)=>e.preventDefault()} href="#" class="office__name">
															{job.company_name}
														</a>
													</>
												)}
												{showLocation && (job.is_remote || job.job_address.city || job.job_address.country) &&
													<span class="office__location">
														<i class="easyjobs-icon easyjobs-map-maker"></i>
														{job.is_remote ? (
																<span>{__( ' Anywhere', 'easyjobs' )}</span>
															) : (
																<span> {job.job_address?.city && job.job_address?.city?.name}
																{(job.job_address?.country && job.job_address?.city) && ", "}
																{job.job_address?.country &&
																	job.job_address?.country.name
																}</span>
															)
														}
													</span>
												}
											</p>
											<div class="job__bottom">
												<div class="job__apply">
													<a onClick={(e)=>e.preventDefault()} href={`${job.apply_url ? job.apply_url : '#'}`} class="button button__primary radius-15" target="_blank">
														<DynamicInputValueHandler
															placeholder={__("Add text..", "essential-blocks")}
															className="eb-button-text"
															value={applyBtnText}
															onChange={(newText) => setAttributes({ applyBtnText: newText })}
															allowedFormats={[
																"core/bold",
																"core/italic",
																"core/strikethrough",
															]}
														/>
													</a>
												</div>
												{showNoOfJob && job.vacancies &&
													<div class="job__vacancy">
														<h4>{job.vacancies}</h4>
														<p>{__( 'No of vacancies', 'easyjobs' )}</p>
													</div>
												}
											</div>
											{showDateLine && (
												<span class="deadline">
													<i class="ej-icon ej-calender"></i>
													{job.expire_at}
												</span>
											)}
										</div>
									</div>
								)
							})}
						</div>
						{jobsData.jobs && jobsData.jobs.last_page > 1 &&
							<Pagination jobs={jobsData.jobs} />
						}
					</div>
				</div>
			</div>
        </>
    );
}

export default Elegant;