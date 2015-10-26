'use strict';

var _        = require('lodash');
var $        = require('jquery');
var React    = require('react');
var ReactDOM = require('react-dom');

const FILTERS = [ 'all', 'active', 'done' ];

// Top bar ---------------------------------------------------------------------

class TopBar extends React.Component {
    handleSelectAll (event) {
        this.props.items.forEach((item, itemIdx) => {
            if ( event.target.checked ) {
                return this.props.completeItem(itemIdx);
            }
            return this.props.activateItem(itemIdx);
        });
    }

    handleSubmit (event) {
        event.preventDefault();
        var newItemText = this.refs.newItemBox.value.trim();
        if (!newItemText) {
            return;
        }
        this.props.addItem(newItemText);
        this.refs.newItemBox.value = null;
    }

    render () {
        return (
            <form onSubmit={this.handleSubmit}>
                <input
                    type="checkbox"
                    defaultChecked={false}
                    onChange={this.handleSelectAll} />
                <input
                    type="input"
                    placeholder="What needs to be done?"
                    ref="newItemBox" />
            </form>
        )
    }
}

// Items -----------------------------------------------------------------------

var ItemList = React.createClass({
    render: function () {
        var handleDelete = (event, idx) => {
            event.preventDefault();
            this.props.removeItem(idx);
        };
        var itemNodes = this.props.items.map((item, idx) => {
            return (
                <li key={idx}>
                    <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => this.props.toggleItem(idx)} />
                    <span>{item.text}</span>
                    <a
                        href="#"
                        className="pull-right"
                        onClick={(event) => handleDelete(event, idx)} >
                        x
                    </a>
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

var ClearCompletedButton = React.createClass({
    render: function () {
        var areCompletedItems = !!_.filter(this.props.items, item => item.done).length;
        return (
            <button
                className={areCompletedItems ? '' : 'hidden'}>
                Clear completed
            </button>
        );
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
                <ClearCompletedButton
                    items={this.props.items} />
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
        this.state.items[itemIdx].done = !this.state.items[itemIdx].done;
        this.setState({items: this.state.items});
    },
    completeItem: function (itemIdx) {
        this.state.items[itemIdx].done = true;
        this.setState({items: this.state.items});
    },
    activateItem: function (itemIdx) {
        this.state.items[itemIdx].done = false;
        this.setState({items: this.state.items});
    },
    addItem: function (text) {
        this.state.items.push({done: false, text: text});
        this.setState({items: this.state.items});
    },
    removeItem: function (itemIdx) {
        this.state.items.splice(itemIdx, 1);
        this.setState({items: this.state.items});
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
                    toggleItem={this.toggleItem}
                    removeItem={this.removeItem} />
                <BottomBar
                    items={this.state.items}
                    filter={this.state.filter}
                    setFilter={this.setFilter}
                    removeItem={this.removeItem} />
            </div>
        )
    }
});

ReactDOM.render(
    <TodoApp />,
    $('#react-root')[0]
);
