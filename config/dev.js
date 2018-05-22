/* Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
*/

console.log('*** Running Development Stack ***');
const base = require('./default');

const config = base.config;

config.server = {
  hostname: '0.0.0.0',
  port: 8000,
};

config.database = {
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: () => null,
  ssl: null,
};

config.fallbackUser = 'nobody';

config.ldap = {
  o: '', // objectClass
  url: 'ldaps://', // ldap server url
  attributes: [],
};

config.admin = {
  posixGroup: [''], // admin posix group(s)
};

config.approver = {
  posixGroup: '', // approver posix group
};

// Users defined for dropdowns
config.display = {
  signatory: [
    'ADD A SIGNATORY', // user(s) that approve CCLAs
  ],
  poc: [
    'ADD A Point of Contact', // user(s) that are points of contacts for CCLAs
  ],
};

// load once asked for
function load() {
  return Promise.resolve(config);
}

module.exports = {
  default: config,
  config: config,
  load: base.load,
};
