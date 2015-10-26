'use strict';

var _        = require('lodash');
var $        = require('jquery');
var React    = require('react');
var ReactDOM = require('react-dom');

const FILTERS = [ 'all', 'active', 'done' ];

// Top bar ---------------------------------------------------------------------

var TopBar = React.createClass({
    render: function () {
        var handleChange = event => {
            this.props.items.forEach((item, itemIdx) => {
                if ( event.target.checked ) {
                    return this.props.completeItem(itemIdx);
                }
                return this.props.activateItem(itemIdx);
            });
        };
        return (
            <div>
                <input
                    type="checkbox"
                    defaultChecked={false}
                    onChange={handleChange} />
                <input type="input" placeholder="What needs to be done?"/>
            </div>
        )
    }
});

// Items -----------------------------------------------------------------------

var ItemList = React.createClass({
    render: function () {
        var itemNodes = this.props.items.map((item, idx) => {
            return (
                <li key={idx}>
                    <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => this.props.toggleItem(idx)} />
                    <span>{item.text}</span>
                </li>
            );
        });
        return (
            <ul>
                {itemNodes}
            </ul>
        );
    }
});

// Bottom ----------------------------------------------------------------------

var Info = React.createClass({
    render: function () {
        var itemsLeft = _.filter(this.props.items, item => !item.done).length;
        return (
            <span>
                {itemsLeft} items remaining
            </span>
        );
    }
});

var Filters = React.createClass({
    render: function () {
        var filterButtonNodes = _.map(FILTERS, (filter, idx) => (
            <button
                key={idx}
                style={this.props.filter === filter ? {color: 'red'} : {color: 'black'}}
                onClick={() => this.props.setFilter(filter)}>
                {filter}
            </button>
        ) );
        return (
            <span>
                {filterButtonNodes}
            </span>
        )
    }
});

var BottomBar = React.createClass({
    render: function () {
        return (
            <div>
                <Info items={this.props.items} />
                <Filters
                    filter={this.props.filter}
                    setFilter={this.props.setFilter} />
                <button
                    style={_.filter(this.props.items, item => item.done).length > 0 ? {display: 'block'} : {display: 'none'}}>
                    Clear completed
                </button>
            </div>
        )
    }
});

// MAIN ------------------------------------------------------------------------

var TodoApp = React.createClass({
    getInitialState: () => {
        return {
            filter: 'all',
            items: [
                {
                    done: true,
                    text: 'Test todo item'
                },
                {
                    done: false,
                    text: 'Test todo item 2'
                }
            ]
        };
    },
    setFilter: function (filter) {
        this.setState({filter: filter});
    },
    toggleItem: function (itemIdx) {
        var nextItems = this.state.items;
        nextItems[itemIdx].done = !this.state.items[itemIdx].done;
        this.setState({items: nextItems});
    },
    completeItem: function (itemIdx) {
        var nextItems = this.state.items;
        nextItems[itemIdx].done = true;
        this.setState({items: nextItems});
    },
    activateItem: function (itemIdx) {
        var nextItems = this.state.items;
        nextItems[itemIdx].done = false;
        this.setState({items: nextItems});
    },
    addItem: function (text) {
        var nextItems = this.state.items;
        nextItems.push({done: false, text: text});
        this.setState({items: nextItems});
    },
    render: function () {
        return (
            <div>
                <h1>Todo App</h1>
                <TopBar
                    items={this.state.items}
                    addItem={this.addItem}
                    completeItem={this.completeItem}
                    activateItem={this.activateItem} />
                <ItemList
                    items={this.state.items}
                    toggleItem={this.toggleItem} />
                <BottomBar
                    items={this.state.items}
                    filter={this.state.filter}
                    setFilter={this.setFilter} />
            </div>
        )
    }
});

ReactDOM.render(
    <TodoApp />,
    $('#react-root')[0]
);
