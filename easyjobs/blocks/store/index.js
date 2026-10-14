import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { createReduxStore, register } from '@wordpress/data';

const DEFAULT_STATE = {
	companyInfo: [],
	companyDetails: [],
};

const actions = {
	setCompanyInfo( companyInfo ) {
		return {
			type: 'SET_COMPANY_INFO',
			companyInfo,
		};
	},
	setCompanyDetails( companyDetails ) {
		return {
			type: 'SET_COMPANY_DETAILS',
			companyDetails,
		};
	},
	fetchFromAPI( params = {} ) {
		return {
			type: 'FETCH_FROM_API',
			params,
		};
	},
};

const store = createReduxStore( 'easyjobs', {
	reducer( state = DEFAULT_STATE, action ) {
		switch ( action.type ) {
			case 'SET_COMPANY_INFO':
				return {
					...state,
					companyInfo: action.companyInfo,
				};
			case 'SET_COMPANY_DETAILS':
				return {
					...state,
					companyDetails: action.companyDetails,
				};
		}

		return state;
	},

	actions,

	selectors: {
		getCompanyInfo( state, params ) {
			return state.companyInfo;
		},
		getCompanyDetails( state, params ) {
			return state.companyDetails;
		},
	},

	controls: {
		FETCH_FROM_API( action ) {
			let url = EasyJobsBlocksJs.ajax_url;
			if ( action.params && Object.keys( action.params ).length ) {
				url = addQueryArgs( url, action.params );
			}
			return apiFetch( { url } );
		},
	},

	resolvers: {
		*getCompanyInfo( params ) {
			const companyInfo = yield actions.fetchFromAPI( {
				action: 'easyjobs_get_company_info',
				blocks_nonce: EasyJobsBlocksJs.blocks_nonce,
				...params,
			} );
			if ( companyInfo.status === 'success' ) {
				return companyInfo.status === 'success'
					? actions.setCompanyInfo( companyInfo.data )
					: console.log( 'Unable to fetch data.' );
			} else if ( companyInfo.status === 'api-error' ) {
				return companyInfo.status === 'api-error'
					? actions.setCompanyInfo( [ 'api-error' ] )
					: console.log( 'Unable to fetch data.' );
			}
		},
		*getCompanyDetails( params ) {
			const companyDetails = yield actions.fetchFromAPI( {
				action: 'easyjobs_get_company_details',
				blocks_nonce: EasyJobsBlocksJs.blocks_nonce,
				...params,
			} );
			// todo: check if job is empty and dispatch error
			if ( companyDetails.status === 'success' ) {
				return companyDetails.status === 'success'
					? actions.setCompanyDetails( companyDetails.data )
					: console.log( 'Unable to fetch data.' );
			} else if ( companyDetails.status === 'api-error' ) {
				return companyDetails.status === 'api-error'
					? actions.setCompanyDetails( [ 'api-error' ] )
					: console.log( 'Unable to fetch data.' );
			}
			// return actions.setCompanyDetails( companyDetails.data );
		},
	},
} );

register( store );
