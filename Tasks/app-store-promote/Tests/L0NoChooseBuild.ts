 /*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import os = require('os');

let taskPath = path.join(__dirname, '..', 'app-store-promote.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('authType', 'UserAndPass');
tmr.setInput('username', 'creds-username');
tmr.setInput('password', 'creds-password');
tmr.setInput('appIdentifier', 'com.microsoft.test.appId');

//tmr.setInput('chooseBuild', 'specify');

// provide answers for task mock
let a: ma.TaskLibAnswers = <ma.TaskLibAnswers> {
    'which': {
        'ruby': '/usr/bin/ruby',
        'gem': '/usr/bin/gem',
        'deliver': '/usr/bin/deliver',
        'pilot': '/usr/bin/pilot'
    },
    'checkPath' : {
        '/usr/bin/ruby': true,
        '/usr/bin/gem': true,
        '/usr/bin/deliver': true,
        '/usr/bin/pilot': true
    },
    'exec': {
        '/usr/bin/gem install deliver': {
            'code': 0,
            'stdout': '1 gem installed'
        },
        'deliver submit_build -u creds-username': {
            'code': 0,
            'stdout': 'consider it delivered!'
        }
    }
};
tmr.setAnswers(a);

// This is how you can mock NPM packages...
os.platform = () => {
    return 'darwin';
};
tmr.registerMock('os', os);

tmr.run();
