# sdc-fwrule

This repository is part of the Joyent Triton project. See the [contribution
guidelines](https://github.com/joyent/triton/blob/master/CONTRIBUTING.md) --
*Triton does not use GitHub PRs* -- and general documentation at the main
[Triton project](https://github.com/joyent/triton) page.

This contains shared code for manipulating Triton firewall rules.
There are two parts to this package:

* A Jison grammar (src/fwrule.jison) that specifies a DSL for writing
  firewall rules. This is used to generate the parser (lib/parser.js)
* A rule object that wraps the parser and provides various convenience
  and serialization methods.

The parser is currently checked in to avoid requiring jison to be installed
in order to use this package.

After making changes to this repo, repos which depend on it should be updated
and tested appropriately:

* [sdc-fwapi](https://github.com/joyent/sdc-fwapi) should have the sdc-fwrule
  Git commit bumped in its `package.json`.
* [smartos-live](https://github.com/joyent/smartos-live) contains a copy in
  `src/fw/tools/fwrule` which gets copied into other locations in the repo by
  the `src/fw/tools/bin/rebuild-node-modules` script.
* [sdc-cn-agent](https://github.com/joyent/sdc-cn-agent) keeps a checked-in copy
  of fwadm and therefore fwrule in `node\_modules/fw` which should be kept in
  sync with fwadm.
* [sdc-firewaller-agent](https://github.com/joyent/sdc-firewaller-agent) keeps a
  checked-in copy of fwadm and therefore fwrule in `deps/fw` which should be
  kept in sync with fwadm.

# Repository

    docs/           Documentation (restdown format)
    lib/            Source files
    node_modules/   node.js dependencies (populate by running "npm install")
    src/            Contains the jison grammar for creating the firewall rule
                    parser
    tools/          Tools and configuration files
    test/           Test suite (using nodeunit)


# Development

If you update the jison grammar, run the following to regenerate the parser:

    make parser

Before checking in, please run:

    make check

and fix any warnings. Note that jsstyle will stop after the first file with an
error, so you may need to run this multiple times while fixing.

For non-trivial changes, please add a unit test that covers the functionality
of the change. If this is a syntax change, update docs/rules.md.in and
docs/examples.md.in accordingly.


# Testing

To run all tests:

    make test

To run an individual test:

    ./node_modules/.bin/nodeunit <path to test file>
