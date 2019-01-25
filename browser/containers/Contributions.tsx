/* Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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
import * as React from 'react';
import { Component } from 'react';

import ContributionsForm from '../components/ContributionsForm';
import { reqJSON } from '../util/index';

interface Props {
  dispatch: any;
}

interface State {
  projects: any[];
  approvers: any[];
}

export default class Contributions extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      approvers: [],
    };
  }

  async componentDidMount() {
    // Maybe store user info in redux once I have session stuff
    const projects = await reqJSON('/api/projects');
    const approvers = await reqJSON('/api/approvers');
    this.setState({
      projects: projects.projectList,
      approvers: approvers.approverList,
    });
  }

  render() {
    const { approvers, projects } = this.state;

    return <ContributionsForm approvers={approvers} projects={projects} />;
  }
}
