'use strict';
 *
 *  Copyright 2016-2017 Red Hat, Inc, and individual contributors.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const { Client, alias, KubeConfig } = require('kubernetes-client');
const { getTokenFromBasicAuth, getUserFromAuthToken } = require('./basic-auth-request');
const Request = require('kubernetes-client/backends/request');

const serviceCatalogCRD = require('./specs/service-catalog-crd.json');

// A list of shorthand aliases
const resourceAliases = {
  'apps.openshift.io': ['app'],
  'authorization.openshift.io': ['authorization'],
  'build.openshift.io': ['build'],
  'image.openshift.io': ['image'],
  'network.openshift.io': ['network'],
  'oauth.openshift.io': ['oauth'],
  'project.openshift.io': ['project'],
  'quota.openshift.io': ['quota'],
  'route.openshift.io': ['route'],
  'security.openshift.io': ['security'],
  'template.openshift.io': ['template'],
  'user.openshift.io': ['user']
};
function getNames (resourceType) {
  const aliases = [resourceType];
  if (resourceAliases[resourceType]) {
    return aliases.concat(resourceAliases[resourceType]);
  }
  return alias(resourceType);
}
const spec = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(__dirname, 'specs', 'openshift-openapi-spec.json.gz'))));
async function openshiftClient (settings = {}) {
  let config = settings.config;
  const clientConfig = { backend: null, /* spec, */ getNames };
  if (!settings.loadSpecFromCluster) {
    clientConfig.spec = spec;
  }
  const kubeconfig = new KubeConfig();
  let fullyUserDefined = false;
  if (config) {
    if (typeof config === 'string') {
      kubeconfig.loadFromFile(config);
      clientConfig.backend = new Request({ kubeconfig });
    } else if (typeof config === 'object' && config.auth) {
      if ('user' in config.auth || 'username' in config.auth || 'token' in config.auth) {
        const { insecureSkipTlsVerify, url, authUrl } = config;
        let user = config.auth.username || config.auth.user;
        const password = config.auth.password || config.auth.pass;

        let accessToken;

        if (config.auth.token) {
          const openshiftUser = await getUserFromAuthToken({ insecureSkipTlsVerify, url, token: config.auth.token });
          accessToken = config.auth.token;
          user = openshiftUser.metadata.name;
        } else {
          accessToken = await getTokenFromBasicAuth({ insecureSkipTlsVerify, url, user, password, authUrl });
        }
        const clusterUrl = url;
        // Create clusterName from clusterUrl by removing 'https://'
        const clusterName = clusterUrl.replace(/(^\w+:|^)\/\//, '');
        config = {
          apiVersion: 'v1',
          clusters: [
            {
              cluster: {
                server: clusterUrl,
                'insecure-skip-tls-verify': insecureSkipTlsVerify
              },
              name: clusterName
            }
          ],
          contexts: [
            {
              context: {
                cluster: clusterName,
                user: `${user}/${clusterName}`
              },
              name: `default/${clusterName}/${user}`
            }
          ],
          'current-context': `default/${clusterName}/${user}`,
          kind: 'Config',
          preferences: {},
          users: [
            {
              name: `${user}/${clusterName}`,
              user: {
                token: accessToken
              }
            }
          ]
        };

        kubeconfig.loadFromString(JSON.stringify(config));
        clientConfig.backend = new Request({ kubeconfig });
      }
    } else if (config.clusters) {
      if (config instanceof KubeConfig) {
        // They passed in an actual KubeConfig object
        // No need to stringify and reload
        clientConfig.backend = new Request({ kubeconfig: config });
      } else {
        kubeconfig.loadFromString(JSON.stringify(config));
        clientConfig.backend = new Request({ kubeconfig });
      }
      fullyUserDefined = true;
    }
  } else {
    kubeconfig.loadFromDefault();
    clientConfig.backend = new Request({ kubeconfig });
  }

  let client = new Client(clientConfig);
  if (settings.loadSpecFromCluster) {
    try {
      await client.loadSpec();
    } catch (err) {
      // Warn the user there was an error and loading the other spec
      console.warn('Warning: Remote client spec unable to load', err.message);
      console.warn('Warning: Loading default spec instead');
      clientConfig.spec = spec;
      client = new Client(clientConfig);
    }
  }

  // CRD with the service instance stuff, but only to this client, not the cluster
  client.addCustomResourceDefinition(serviceCatalogCRD);

  client.kubeconfig = fullyUserDefined ? config : kubeconfig;
  return client;
}

module.exports = exports = openshiftClient;
