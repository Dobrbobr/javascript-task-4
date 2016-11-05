'use strict';

exports.isStar = false;
var PRIORITIES = {
    'filterIn': 1,
    'sortBy': 2,
    'select': 3,
    'format': 4,
    'limit': 5
};

function clone(collection) {
    return collection.map(function (person) {
        return Object.assign({}, person);
    });
}

exports.query = function (collection) {
    var functions = [].slice.call(arguments, 1);
    var copyCollection = clone(collection);

    functions = functions.sort(function (a, b) {
        return PRIORITIES[a.name] - PRIORITIES[b.name];
    });

    functions.forEach(function (func) {
        copyCollection = func(copyCollection);
    });

    return copyCollection;
};

exports.select = function () {
    var properties = [].slice.call(arguments);

    return function select(collection) {
        return collection.map(function (person) {
            for (var key in person) {
                if (properties.indexOf(key) === -1) {
                    delete person[key];
                }
            }

            return person;
        });
    };
};

exports.filterIn = function (property, values) {

    return function filterIn(collection) {
        return collection.filter(function (person) {
            return values.some(function (item) {
                return person[property] === item;
            });
        });
    };
};

exports.sortBy = function (property, order) {
    order = order === 'asc' ? 1 : -1;

    return function sortBy(collection) {
        var sortCollection = collection.sort(function (a, b) {
            return a[property] <= b[property] ? -1 * Number(order) : 1 * Number(order);
        });

        return sortCollection;
    };
};

exports.format = function (property, formatter) {
    return function format(collection) {
        return collection.map(function (person) {
            if (!person.hasOwnProperty(property)) {
                return person;
            }
            person[property] = formatter(person[property]);

            return person;
        });
    };
};

exports.limit = function (count) {

    return function limit(collection) {

        return collection.slice(0, count);
    };
};

if (exports.isStar) {

    exports.or = function () {
        return;
    };

    exports.and = function () {
        return;
    };
}
