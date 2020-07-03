import React from 'react';
import { FaTimes, FaTimesCircle, FaCheck, FaExclamation } from 'react-icons/fa';

function Alert({ alert, index, dispatch }) {
	return (
		<div className="alert">
			<span
				className="alert__color"
				style={
					alert.type === 'Error' ? (
						{ backgroundColor: 'red' }
					) : alert.type === 'Success' ? (
						{ backgroundColor: 'green' }
					) : (
						{ backgroundColor: 'dodgerblue' }
					)
				}
			/>
			{alert.type === 'Error' ? (
				<FaTimesCircle style={{ color: 'red' }} />
			) : alert.type === 'Success' ? (
				<FaCheck style={{ color: 'green' }} />
			) : (
				<FaExclamation style={{ color: 'dodgerblue' }} />
			)}
			<span className="alert__text">
				<strong>{alert.type}: </strong>
				{alert.alertText}
			</span>
			<button className="alert__close" onClick={() => dispatch({ type: 'REMOVE_ALERT', index: index })}>
				<FaTimes />
			</button>
		</div>
	);
}
export default Alert;
