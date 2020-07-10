const mailer = require('./email');
const Utils = {
    getMatch(req) {
        let q = {};
        if (req.query.completed) {
            q['completed'] = req.query.completed === 'true';
        }
        return q;
    },
    getOptions(req, defaultSortKey, defaultSortMethod) {
        return {
            limit: +req.query.limit || 10,
            skip: +req.query.skip || 0,
            sort: this.getSort(req, defaultSortKey, defaultSortMethod)
        };
    },
    getSort(req, defaultSortKey, defaultSortMethod) {
        if (req.query.sortBy) {
            if (req.query.sortBy.indexOf(':') > -1) {
                const split = req.query.sortBy.split(':');
                const key = (split[0] ? split[0] : (defaultSortKey ? defaultSortKey : 'updatedAt'));
                const asc_desc = (split[1] && (split[1] === 'asc' || split[1] === 'desc')) ? split[1]
                    : (defaultSortMethod && (defaultSortMethod === 'asc' || defaultSortMethod === 'desc') ? defaultSortMethod : 'desc');
                const value = asc_desc === 'asc' ? 1 : -1;
                const ret = {};
                ret[key] = value;
                return ret;
            } else {
                const key = (req.query.sortBy ? req.query.sortBy : (defaultSortKey ? defaultSortKey : 'updatedAt'));
                const ret = {};
                ret[key] = -1;
                return ret;
            }
        } else {
            return {
                updatedAt: -1
            };
        }
    },
    sendWelcomeEmail(email, name) {
        mailer.send({
            to: email,
            from: 'harshit.dev25@gmail.com',
            subject: 'Welcome to Task Manager',
            text: `Hi ${name}, Welcome to my Task Manager App`
        });
    },
    sendGoodbyeEmail(email, name) {
        mailer.send({
            to: email,
            from: 'harshit.dev25@gmail.com',
            subject: 'GoodBye',
            text: `Hi ${name}, Thanks for using this App`
        });
    }
};

module.exports = Utils;