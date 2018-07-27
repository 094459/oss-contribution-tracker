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
import * as React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  id: string;
  type: string;
}

export default class TableEditCellForCla extends React.Component<
  Partial<Props>,
  {}
> {
  render() {
    const path = `/${this.props.type}/${this.props.id}`;
    return (
      <div className="center">
        <Link to={path}>
          <i className="fa fa-pencil-square" />
        </Link>
      </div>
    );
  }
}
