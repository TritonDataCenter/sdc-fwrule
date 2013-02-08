#
# Copyright (c) 2013, Joyent, Inc. All rights reserved.
#

#
# Tools
#
JISON	:= ./node_modules/jison/lib/jison/cli-wrapper.js
NODEUNIT := node_modules/nodeunit/bin/nodeunit
NPM := npm

#
# Repo-specific targets
#
.PHONY: test
test: $(NODEUNIT)
	@$(NODEUNIT) --reporter tap test/*.js

.PHONY: parser
parser: $(JISON)
	$(JISON)  -o lib/parser.js ./src/fwrule.jison

$(NODEUNIT):
	$(NPM) install

$(JISON):
	$(NPM) install
