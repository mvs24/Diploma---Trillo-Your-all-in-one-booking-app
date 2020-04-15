import React from 'react';
import {connect} from 'react-redux'

const RequestedFlights = props => {
	return (
		<div>
			req
		</div>
	)
} 

const mapStateToProps = state => ({
	requestedFlights: state.flights.requestedFlights
})

export default connect(mapStateToProps)(RequestedFlights);