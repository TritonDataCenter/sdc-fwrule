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
 * Copyright (c) 2014, Joyent, Inc. All rights reserved.
 *
 *
 * Unit tests for the firewall rule validators
 */

var sys = require('sys');
var validator = require('../lib/validators.js');

var IS_NODE_08 = (process.version.indexOf('v0.8') === 0);

exports['IPv4 addresses'] = function (t) {
    var i;
    var valid = [
        '1.2.3.4',
        '1.0.0.0'
    ];

    var invalid = [
        '1',
        'asdf',
        '0.0.0.0',
        '255.255.255.255',
        '256.0.0.1'
    ];

    if (IS_NODE_08) {
        // net.isIPv4 thinks this is valid in node 0.8:
        valid.push('01.02.03.04');
    } else {
        invalid.push('01.02.03.04');
    }

    for (i in valid) {
        t.ok(validator.validateIPv4address(valid[i]), valid[i]);
    }

    for (i in invalid) {
        t.ok(!validator.validateIPv4address(invalid[i]), invalid[i]);
    }

    t.done();
};

exports['IPv4 subnets'] = function (t) {
    var i;
    var valid = [
        '1.2.3.4/24',
        '1.0.0.0/32',
        '10.88.88.24/32',
        '10.88.88.24/1'
    ];

    var invalid = [
        '1',
        'asdf',
        '0.0.0.0/32',
        '1.0.0.0/33',
        '1.0.0.0/0'
    ];

    if (IS_NODE_08) {
        // net.isIPv4 thinks this is valid in node 0.8:
        valid.push('01.02.03.04/24');
    } else {
        invalid.push('01.02.03.04/24');
    }

    for (i in valid) {
        t.ok(validator.validateIPv4subnet(valid[i]), valid[i]);
    }

    for (i in valid) {
        t.ok(!validator.validateIPv4subnet(invalid[i]), invalid[i]);
    }

    t.done();
};
