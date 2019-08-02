import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            factText: "",
            facts: null
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        const response = await fetch("/facts");
        const factsObj = await response.json();
        this.setState({facts: factsObj})
    }

    handleInputChange(evnt) {
        this.setState({factText: evnt.target.value})
    }

    async handleSubmit () {
        const response = await fetch("/facts", {
          method: "POST",
          headers:{
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              fact: this.state.factText
            })
        });
        if (response.status === 201) {
          console.log("fact created")
        }
    }

    listTheFacts (facts) {
        let i = 0;
        let allOrderedFacts = this.orderFacts(facts)
        let listItems = [];
        allOrderedFacts.forEach((fact) => {
        listItems.push(
            <div key={i}>
                <p>{new Date(fact.when).toLocaleString()}</p>
                <p>{fact.text}</p>
                <br/>
            </div>
            )
        i++;
        })
        return (
            <div id="facts">{listItems}</div>
        );
    }
      
    orderFacts(facts) {
        facts.sort(function(a, b){return Date.parse(b.when) - Date.parse(a.when)})
        return facts;
    }

    render() {
        if (this.state.facts) {
            return (
                <div id="page">
                <h1>The information is being gathered....</h1>
                <input onChange={this.handleInputChange} placeholder="a piece of information" id="input" type="text"></input>
                <button id="button" onClick={this.handleSubmit}>submit</button>
                <h2>here is The Information....</h2>
                {this.listTheFacts(this.state.facts)}
              </div>
            )
          } else {
            return (
                <div>
                    <h1>The information is being gathered....</h1>
                    <input onChange={this.handleInputChange} placeholder="a piece of information" id="input" type="text"></input>
                    <button id="button" onClick={this.handleSubmit}>submit</button>
                </div>
            )
          }
    }               
}

ReactDOM.render(
<App />, 
document.getElementById('root'));

serviceWorker.unregister();
