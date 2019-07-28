import React from 'react'

export function formatDate(date) {
	var dat = new Date(date)
	dat = Date.parse(dat)
	if (dat == 'Invalid Date'){
		var d = date.toString().split(' ')
		var dd = d[0].split('.')
		var tt = d[1].split(':')
		var nDate = new Date()
		nDate.setDate(dd[0]) 
		nDate.setMonth(dd[1]-1)  
		nDate.setFullYear(dd[2])  
		nDate.setHours(tt[0])  
		nDate.setMinutes(tt[1])
		return formatDate(nDate)
	} else{
        dat = new Date(date)
		let dayOfMonth = dat.getDate();
		let month = dat.getMonth() + 1;
		let year = dat.getFullYear();
		let hour = dat.getHours();
		let minutes = dat.getMinutes();
  
		month = month < 10 ? '0' + month : month;
		dayOfMonth = dayOfMonth < 10 ? '0' + dayOfMonth : dayOfMonth;
		minutes = minutes < 10 ? '0' + minutes : minutes;
		return `${dayOfMonth}.${month}.${year} ${hour}:${minutes}`
	}
}

export function Headers(status){
    if (status === 'Delayed'){
        return [
            'Status','Arrival Airport', 'Departure Airport','Code', 'Delay','Terminal','Flight Number' // status - arrival or departure
        ]
    }
    return [
        status === 'Arrivals' ? 'Arrival Time' : status === 'Departures' ? 'Departure Time' : '',
        status === 'Arrivals' ? 'Departure Airport' : status === 'Departures' ? 'Arrival Airport' : '',
        'Code',
        status === 'Arrivals' ? 'Arrival Terminal' : status === 'Departures' ? 'Departure Terminal' : '',
        'Flight Number','Status','Flight Duration']
}

export function Rows(item,tab){
    if (tab === 'Delayed'){
        return(<tr className="parent">
            <td className="div1">{item.arrivalAirportFsCode === 'SVO' ? 'Arrival' : 'Departure'}</td> 
            <td className="div2">{item.arrivalAirportFsCode}</td>
            <td className="div3">{item.departureAirportFsCode}</td>
            <td className="div4">{item.carrierFsCode}</td>
            <td className="div5">{item.delays ? item.delays.arrivalGateDelayMinutes : 'TBD'}</td>
            <td className="div6">{'TBD'}</td>
            <td className="div7">{item.flightNumber}</td>
        </tr>)
    }
    var time = tab === 'Arrivals' ?  formatDate(item.arrivalDate.dateLocal) : tab === 'Departures' ? formatDate(item.departureDate.dateLocal) : ''
    var time2 = tab === 'Arrivals' ?  item.arrivalDate.dateLocal : tab === 'Departures' ? item.departureDate.dateLocal : ''
    var date = new Date()
    date.setDate(new Date(time2).getDate())
    var style = new Date(time2).getTime() - new Date(date).getTime()
    return( 
        <tr className="parent"> 
            <td style={{color : (style > 0 && style < 3600000) ? 'red' : 'inherit'}} className="div1">{time}</td>
            <td className="div2">{tab === 'Arrivals' ? item.departureAirportFsCode : tab === 'Departures' ? item.arrivalAirportFsCode : ''}</td>
            <td className="div3">{item.carrierFsCode}</td>
            <td className="div4">{item.airportResources ? tab === 'Arrivals' ? item.airportResources.arrivalTerminal : tab === 'Departures' ? item.airportResources.departureTerminal : '' : ''}</td>
            <td className="div5">{item.flightNumber}</td>
            <td className="div6">{status(item.status)}</td>
            <td className="div7">{item.flightDurations.airMinutes}</td>
        </tr>
    )  
}

export function status(status){
    switch (status) {
        case 'L':
            return 'Landed'
        case 'S':
            return 'Scheduled'
        case 'A':
            return 'Active'
        case 'U':
            return 'Unknown'
        case 'R':
            return 'Redirected'
        case 'D':
            return 'Diverted'
        case 'c':
            return 'Cancelled'
        default:
          return null
      }
}