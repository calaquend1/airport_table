import React, {Component} from 'react';
import {  Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import './table.css'
import flights from './data/delayed.json'
import departures1 from './data/departures1.json'
import arrivals251 from './data/arrivals251.json'
import {Headers, Rows} from './functions'

const tabs = ["Arrivals", "Departures",  "Delayed"]

export default class Table extends Component{

    constructor(props){
        super(props)
        this.search = this.search.bind(this)
        this.searchNumber = this.searchNumber.bind(this)
        this.setOffline = this.setOffline.bind(this)
    }

    state = {
        offline : true,
        activeTab : 'Arrivals',
        data : flights,
        date : new Date()
    }
    componentDidMount(){
      if(!this.state.offline){
        this.search()
      } else {
          this.setOffline()
      }
    }
    
    search(s,number){
        var date = new Date()
        var appId = '2bfbe0fc'
        var appKey = 'ac721595590bd2b8658549f311cda505'
        var requestedAirport = "SVO"
        var flightsType = this.state.activeTab === 'Arrivals' ? "arr" : this.state.activeTab === 'Departures' ? 'dep' : 'arr'
        var requestedDate = date.getFullYear() + '/' + (Number(date.getMonth())+1) + '/' + (Number(date.getDate())-5)
        var requestedHour = date.getHours()
        var requestedNumHours = "6"
        var url = "https://api.flightstats.com/flex/flightstatus/rest/v2/json/airport/status/"+requestedAirport+'/'+
        flightsType+'/'+requestedDate+'/'+requestedHour+'?appId='+appId+'&appKey='+appKey+'&utc=false&numHours='+requestedNumHours+'&maxFlights=25'
        fetch("https://cors-anywhere.herokuapp.com/"+url)
        .then(response => response.json())
        .then(data => { if (s === 'searchNumber'){
            var x = {...data}
            x.flightStatuses = x.flightStatuses.filter(item => item.flightNumber.search(number) !== -1)
            this.setState({
                data : x
            })
        } else if(this.state.activeTab === 'Delayed'){
            var y = {...data}
            y.flightStatuses = y.flightStatuses.filter(item => {return item.delays ? item.delays.arrivalGateDelayMinutes : false })
            this.setState({
                data : y
            })
        } else {
            this.setState({ data },() => {
                return this.state.data
            })
        }  
        })
        .catch(err => console.log('error: '+err.message))
    }

    setOffline(){
        if (this.state.activeTab === 'Delayed'){
            var x = {...flights}
            var y = [...departures1.flightStatuses]
            x.flightStatuses = [...x.flightStatuses,...y]
        }
        this.setState({
            data : this.state.activeTab === 'Arrivals' ? flights : 
            this.state.activeTab === 'Departures' ? departures1 : 
            this.state.activeTab === 'Delayed' ? x : ''
        })
    }
    searchNumber(number){
        if (this.state.offline){
            this.setState({data : this.state.activeTab === 'Arrivals' ? flights : this.state.activeTab === 'Departures' ? departures1 : this.state.activeTab === 'Delayed' ? arrivals251 : '' },() =>{ // здесь может быть ошибка из-за того, что дата будет пустая
                var x = {...this.state.data}
                x.flightStatuses = x.flightStatuses.filter(item => item.flightNumber.search(number) !== -1)
                this.setState({
                    data : x
                })
            })
        } else {
            this.search('searchNumber',number)
        }
    }
    
    render(){
        return(<>
        <div>
            <Nav className='nav' tabs style={{cursor:'pointer'}}>
                {tabs.map(item => 
                <NavItem>
                    <NavLink 
                    className={classnames({ active: this.state.activeTab === item})}
                    onClick={() => { this.setState({activeTab : item, date : new Date()},() => {
                        if (this.state.offline){
                            this.setOffline()
                        } else {
                            this.search()
                        }
                    })}}
                    >
                        {item}
                    </NavLink>
                </NavItem>
                )}
            </Nav>
            <div className="parent2">
                <div className='input'>Search flight number</div>
                <input className='input i' onChange={(e) => {
                    e.target.value ? this.searchNumber(e.target.value) : this.state.offline ? this.setOffline() : this.search()
                }}
                type="number" id="number" name="number" min="0" />
                <button className="button push_button red" onClick={() => this.setState({offline : !this.state.offline},() =>{
                    if (this.state.offline){
                        this.setOffline()
                    } else {
                        this.search()
                    }
                })}>{this.state.offline ? 'Turn to online mode' : 'Turn to offline mode'}</button>
            </div>
            <div style={{width:'100%',overflowX:'auto',overflowY:'auto'}}> 
                <table>
                    <thead>
                        <tr className="parent">
                            {Headers(this.state.activeTab).map((item,index) =>{
                                return (
                                    <th className={'div'+(+index+1)}>{item}</th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data ? this.state.data.flightStatuses.map(item => Rows(item,this.state.activeTab)) : null}  
                    </tbody>
                </table>
            </div>
        </div>
        </>)
    }
}