const Pagination = ( { jobs } ) => {
    // const { jobs } = props;
    const renderList = () => {
		const listItems = [];
		for ( let i = 1; i <= jobs.last_page; i++ ) {
		  listItems.push(<li class={`page-item ${jobs.current_page == i ? 'active' : ''}`} aria-current="page"><a onClick={(e)=>e.preventDefault()} href="<?php echo esc_url($job_page_url)?>" class="page-link">{i}</a></li>);
		}
		return listItems;
	};
    return (
        <div class="custom-job-pagination">
            <nav>
                <ul class="pagination">
                    <li class="page-item <?php echo $jobs_data->current_page == 1 ? 'disabled' : ''; ?>" aria-disabled="true" aria-label="« Previous">
                        <a onClick={(e)=>e.preventDefault()} href="<?php echo esc_url( $prev_page ); ?>" class="page-link" aria-hidden="true">
                            <i class="easyjobs-icon easyjobs-arrow-left"></i><span class="pagination-text">Prev</span>
                        </a>
                    </li>
                    {renderList()}
                    <li class="page-item <?php echo $jobs_data->current_page == $jobs_data->last_page ? 'disabled' : ''; ?>">
                        <a onClick={(e)=>e.preventDefault()} class="page-link" href="<?php echo esc_url( $next_page ); ?>" rel="next" aria-label="Next »"><span class="pagination-text">Next</span>
                            <i class="easyjobs-icon easyjobs-arrow-right"></i>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Pagination;