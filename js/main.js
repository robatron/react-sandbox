'use strict';

var _        = require('lodash');
var $        = require('jquery');
var React    = require('react');
var ReactDOM = require('react-dom');

var TopBar = React.createClass({
    render: function () {
        return (
            <div>
                <input type="checkbox" />
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
                        defaultChecked={item.done}
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
        return (
            <span>
                <button>All</button>
                <button>Active</button>
                <button>Completed</button>
            </span>
        )
    }
});

var BottomBar = React.createClass({
    render: function () {
        return (
            <div>
                <Info items={this.props.items} />
                <Filters />
                <button>Clear completed</button>
            </div>
        )
    }
});

// MAIN ------------------------------------------------------------------------

var TodoApp = React.createClass({
    getInitialState: () => {
        return {
            filter: 'all', // all, active, completed
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
    toggleItem: function (itemIdx) {
        var nextItems = this.state.items;
        nextItems[itemIdx].done = !this.state.items[itemIdx].done;
        this.setState({items: nextItems});
    },
    render: function () {
        return (
            <div>
                <h1>Todo App</h1>
                <TopBar />
                <ItemList
                    items={this.state.items}
                    toggleItem={this.toggleItem} />
                <BottomBar items={this.state.items} />
            </div>
        )
    }
});

ReactDOM.render(
    <TodoApp />,
    $('#react-root')[0]
);
