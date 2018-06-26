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
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as ContributionsActions from '../modules/contributions';

interface Props {
  dispatch: any;
  params: any;
}

interface State {
  approvalStatus: string;
  acceptHighlight: boolean;
  declineHighlight: boolean;
}

class Approvals extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      approvalStatus: '',
      acceptHighlight: false,
      declineHighlight: false,
    };
  }

  handleApproval = e => {
    const { dispatch } = this.props;
    const field = e.target.elements;
    e.preventDefault();

    // dispatch to server
    dispatch(
      ContributionsActions.approveContribution({
        approvalNotes: field.approvalNotes.value,
        approvalStatus: this.state.approvalStatus,
        contributionId: (this.props as any).match.params.contrib_id,
      })
    );
  };

  approveContrib = e => {
    this.setState({
      approvalStatus: 'approved',
      acceptHighlight: true,
      declineHighlight: false,
    });
  };

  denyContrib = e => {
    this.setState({
      approvalStatus: 'denied',
      acceptHighlight: false,
      declineHighlight: true,
    });
  };

  render() {
    return (
      <form onSubmit={this.handleApproval}>
        <div className="form-group">
          <label>Approve/Deny</label>
          <div className="btn-toolbar">
            <div className="btn-group" role="group">
              <button
                id="approveBtn"
                type="button"
                className="btn btn-success btn-sm active"
                onClick={this.approveContrib}
                disabled={this.state.acceptHighlight}
              >
                <i className="fa fa-check" />
              </button>
              <button
                id="denyBtn"
                type="button"
                className="btn btn-danger btn-sm active"
                onClick={this.denyContrib}
                disabled={this.state.declineHighlight}
              >
                <i className="fa fa-ban" />
              </button>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>Approval Notes</label>
          <textarea
            className="form-control"
            rows={3}
            name="approvalNotes"
            required={true}
          />
        </div>
        <div className="form-group">
          <div className="btn-group">
            <Link className="btn btn-secondary" to="/admin">
              Cancel
            </Link>
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default connect(state => ({}))(Approvals);
