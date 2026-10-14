( function ( $ ) {
	'use strict';

	/**
	 * All of the code for public-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
	 */
	$( '.ej-social-button' ).on( 'click', function () {
		window.open(
			this.href,
			'',
			'left=20,top=20,width=600,height=300,toolbar=0,resizable=1'
		);
		return false;
	} );

	$( '.office__gallery__slider' ).owlCarousel( {
		center: true,
		loop: true,
		margin: 30,
		nav: false,
		dots: false,
		responsive: {
			0: {
				items: 1,
			},
			575: {
				items: 3,
			},
			992: {
				items: 4,
			},
		},
	} );

	// $(document).on('submit', '.ej-job-filter-form', function (e) {
	// 	e.preventDefault();

	// 	let searchTerm = $('.search-bar .form-control').val()?.toLowerCase()?.trim();
	// 	let category = $('.category select').val();
	// 	let location = $('.locations select').val();
	// 	let found = false;
	// 	let list = $('.ej-job-list');

	// 	if (searchTerm === undefined || category === undefined || location === undefined) {
	// 		$('.ej-job-list-item-cat').each(function () {
	// 			let resultText = $(this)?.find('.ej-job-title a')?.text()?.toLowerCase();
	// 			let resultCategory = $(this)?.data('category');
	// 			let resultLocation = $(this)?.data('location');

	// 			// Check if the item matches each selected filter independently
	// 			let titleMatch = resultText.includes(searchTerm) || !searchTerm;
	// 			let categoryMatch = category == resultCategory || category == 'all' || !category;
	// 			let locationMatch = location == resultLocation || location == 'all' || !location;

	// 			if (titleMatch && categoryMatch && locationMatch) {
	// 				if (list.find('.no-job').length) {
	// 					list.find(".no-job").remove();
	// 				}
	// 				$(this).fadeIn();
	// 				found = true;
	// 			} else {
	// 				$(this).hide();
	// 			}
	// 		});
	// 	} else {
	// 		$('.ej-job-list-item-cat').each(function () {
	// 			let resultText = $(this).find('.ej-job-title a').text()?.toLowerCase();
	// 			let resultCategory = $(this).data('category');
	// 			let resultLocation = $(this).data('location');

	// 			// Check if the item matches each selected filter independently
	// 			let titleMatch = resultText.includes(searchTerm) || searchTerm == '';
	// 			let categoryMatch = category == resultCategory || category == 'all';
	// 			let locationMatch = location == resultLocation || location == 'all';

	// 			if (titleMatch && categoryMatch && locationMatch) {
	// 				if (list.find('.no-job').length) {
	// 					list.find(".no-job").remove();
	// 				}
	// 				$(this).fadeIn();
	// 				found = true;
	// 			} else {
	// 				$(this).hide();
	// 			}
	// 		});
	// 	}

	// 	if (!found) {
	// 		if (!list.find('.no-job').length) {
	// 			list.append('<div class="no-job ej-job-list-item"><div class="ej-job-list-item-inner"><div class="ej-job-list-item-col"><h3 class="ej-job-title">No open job positions</h3></div><div class="ej-job-list-item-col"></div></div></div>');
	// 		}
	// 	}
	// });

	// URL rebuild with given filter values
	$( document ).on( 'submit', '#ejJobFilterForm', function ( e ) {
		// Get the values of the input fields
		const jobTitle = $( '#job_title' ).val();
		const jobCategory = $( '#job_category' ).val();
		const jobLocation = $( '#job_location' ).val();
		const pageId = $( '#page_id' ).val();

		function areFieldsEmpty( title, location, category ) {
			// Check if all three fields are empty
			if ( ! title && ! location && ! category ) {
				return true;
			}

			// Check if at least one field is not empty
			if ( title || location || category ) {
				return false;
			}

			// If none of the above conditions are met, return true
			return true;
		}

		if ( areFieldsEmpty( jobTitle, jobLocation, jobCategory ) ) {
			e.preventDefault();
			$( '#ejErrorMessage' ).show();
		} else {
			e.preventDefault();
			// Build the URL
			const baseUrl = window.location.href.split( '?' )[ 0 ];
			const queryParams = [];

			if ( pageId ) {
				queryParams.push( 'page_id=' + encodeURIComponent( pageId ) );
			}
			if ( jobTitle ) {
				queryParams.push(
					'job_title=' + encodeURIComponent( jobTitle )
				);
			}
			if ( jobCategory ) {
				queryParams.push(
					'job_category=' + encodeURIComponent( jobCategory )
				);
			}
			if ( jobLocation ) {
				queryParams.push(
					'job_location=' + encodeURIComponent( jobLocation )
				);
			}
			const finalUrl = baseUrl + '?' + queryParams.join( '&' );

			// Redirect to the filtered URL
			window.location.href = finalUrl;
		}
	} );

	// Scroll to job list section while using pagination
	$( document ).ready( function () {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams( queryString );

		// Check if jobPage is not null and scroll to the section with the id "job-list"
		if (
			urlParams.has( 'job_page' ) ||
			urlParams.has( 'job_location' ) ||
			urlParams.has( 'job_category' ) ||
			urlParams.has( 'job_title' )
		) {
			// Scroll to the "job-list" section with a smooth animation
			$( '#easyjobs-list' )[ 0 ].scrollIntoView( {
				behavior: 'instant',
			} );
		}
	} );

	// Search reset
	$( document ).on( 'click', '#ej-reset-form', function ( e ) {
		const urlParts = window.location.href.split( '?' );
		let pageUrl = urlParts[ 0 ];
		if ( urlParts?.length >= 1 && urlParts[ 1 ]?.includes( 'page_id' ) ) {
			const paramParts = urlParts[ 1 ]?.split( '&' );
			pageUrl += '?' + paramParts[ 0 ];
		}
		if ( urlParts?.length <= 1 ) {
			e.preventDefault();
		} else {
			window.location.href = pageUrl;
		}
	} );

	// Default template: Read more / Show less swaps the company description
	// teaser and the full text in place.
	$( '.ej-description-toggle' ).on( 'click', function ( e ) {
		e.preventDefault();
		const $section = $( this ).closest( '.ej-section-content' );
		const expand = $( this ).attr( 'aria-expanded' ) === 'false';
		$section
			.find( '.ej-company-description-short' )
			.prop( 'hidden', expand );
		$section
			.find( '.ej-company-description-full' )
			.prop( 'hidden', ! expand );
		$section
			.find(
				expand
					? '.ej-company-description-full .ej-description-toggle'
					: '.ej-company-description-short .ej-description-toggle'
			)
			.trigger( 'focus' );
	} );

	$( '.ej-modal-trigger' ).on( 'click', function ( e ) {
		e.preventDefault();
		$( '.ej-modal' ).fadeIn( 300 );
	} );
	$( '.ej-modal-close' ).on( 'click', function ( e ) {
		e.preventDefault();
		$( '.ej-modal' ).fadeOut( 200 );
	} );
} )( jQuery );
