export const reducer = (state, action) => {
	switch (action.type) {
		case 'ERROR_ALERT':
			return [ ...state, { type: 'Error', alertText: action.alertText } ];

		case 'SUCCESS_ALERT':
			return [ ...state, { type: 'Success', alertText: action.alertText } ];

		case 'ALERT_ALERT':
			return [ ...state, { type: 'Alert', alertText: action.alertText } ];

		case 'REMOVE_ALERT':
			const updatedAlerts = [ ...state ];
			updatedAlerts.splice(action.index, 1);
			return updatedAlerts;

		case 'CLEAR_ALERTS':
			return [];

		default:
			return state;
	}
};
