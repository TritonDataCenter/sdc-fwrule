/*
 * CDDL HEADER START
 *
 * The contents of this file are subject to the terms of the
 * Common Development and Distribution License, Version 1.0 only
 * (the "License").  You may not use this file except in compliance
 * with the License.
 *
 * You can obtain a copy of the license at http://smartos.org/CDDL
 *
 * See the License for the specific language governing permissions
 * and limitations under the License.
 *
 * When distributing Covered Code, include this CDDL HEADER in each
 * file.
 *
 * If applicable, add the following below this CDDL HEADER, with the
 * fields enclosed by brackets "[]" replaced with your own identifying
 * information: Portions Copyright [yyyy] [name of copyright owner]
 *
 * CDDL HEADER END
 *
 * Copyright (c) 2015, Joyent, Inc. All rights reserved.
 *
 */

/*
 * firewall rule parser: validation functions
 */

var net = require('net');
var util = require('util');
var VError = require('verror').VError;



// --- Globals



var portRE = /^[0-9]{1,5}$/;
var UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;



// --- Exports



/**
 * Constructor for an invalid parameter error
 */
function InvalidParamError(field) {
    VError.apply(this, Array.prototype.slice.call(arguments, 1));
    this.field = field;
}

util.inherits(InvalidParamError, VError);


/**
 * Returns true if ip is a valid IPv4 address, and not all zeroes or
 * the broadcast address
 */
function validateIPv4address(ip) {
    if (!net.isIPv4(ip) || (ip == '255.255.255.255') || (ip == '0.0.0.0')) {
        return false;
    }

    return true;
}


/**
 * Returns true if subnet is in valid CIDR form
 */
function validateIPv4subnet(subnet) {
    var parts = subnet.split('/');
    if (!validateIPv4address(parts[0])) {
        return false;
    }

    if (!Number(parts[1]) || (parts[1] < 1) || (parts[1] > 32)) {
        return false;
    }

    return true;
}


/**
 * Returns true if port is a valid port number
 */
function validatePort(port) {
    if (!portRE.exec(port)) {
        return false;
    }

    var portNum = Number(port);

    if (isNaN(portNum) || portNum > 65535 || portNum < 1) {
        return false;
    }

    return true;
}

/**
 * Returns true if port is a valid port number or 'all'
 */
function validatePortOrAll(port) {
    if (validatePort(port)) {
        return true;
    }

    if (typeof (port) !== 'string') {
        return false;
    }

    if (port.toLowerCase() === 'all') {
        return true;
    }

    return false;
}

/**
 * Returns true if protocol is one of tcp, udp, icmp (mixing of upper
 * and lower-case allowed)
 */
function validateProtocol(protocol) {
    var protoLC = protocol.toLowerCase();
    if ((protoLC != 'tcp') && (protoLC != 'udp') && (protoLC != 'icmp')) {
        return false;
    }
    return true;
}


/**
 * Returns true if action is a valid firewall action ('allow' or 'block',
 * mixed case allowed)
 */
function validateAction(action) {
    var actionLC = action.toLowerCase();
    if ((actionLC != 'allow') && (actionLC != 'block')) {
        return false;
    }
    return true;
}


/**
 * Returns true if bool is a valid boolean value, false otherwise
 */
function validateBoolean(bool) {
    if (typeof (bool) !== 'boolean' && bool !== 'true' && bool !== 'false') {
        return false;
    }

    return true;
}


/**
 * Throws an InvalidParamError if the string is invalid
 */
function validateString(name, str) {
    if (typeof (str) !== 'string') {
        throw new InvalidParamError(name, name + ' must be a string');
    }

    if (str.length > 255) {
        throw new InvalidParamError(name,
            name + ' must be shorter than 255 characters');
    }
}


/**
 * Returns true if uuid is a valid UUID
 */
function validateUUID(uuid) {
    return UUID_REGEX.test(uuid);
}


module.exports = {
    bool: validateBoolean,
    InvalidParamError: InvalidParamError,
    validateAction: validateAction,
    validateIPv4address: validateIPv4address,
    validateIPv4subnet: validateIPv4subnet,
    validatePort: validatePort,
    validatePortOrAll: validatePortOrAll,
    validateProtocol: validateProtocol,
    validateString: validateString,
    validateUUID: validateUUID
};
