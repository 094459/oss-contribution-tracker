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
import DatePicker = require('react-bootstrap-date-picker');
import SweetAlert from 'react-bootstrap-sweetalert';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import Select from 'react-select';

import * as ContributionsActions from '../modules/contributions';

interface OwnProps {
  contrib_data: any;
  projects: any;
}

interface Props extends OwnProps {
  dispatch: any;
}

interface State {
  contrib: any;
  project_name: string;
  project_id: string;
  contribution_github_status: string;
  approval_status: string;
  projectDisabled: boolean;
  alert: any;
}

class ContributionsEditor extends React.Component<Partial<Props>, State> {
  constructor(props) {
    super(props);
    this.state = {
      contrib: props.contrib_data,
      project_name: null,
      project_id: '',
      contribution_github_status: '',
      approval_status: '',
      projectDisabled: false,
      alert: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.contrib_data !== undefined) {
      this.setState({
        contrib: nextProps.contrib_data,
      });
      /* Checks only need to run once after the props are delivered but
       I need to display the passed in values
      */
      if (this.state.contribution_github_status === '') {
        this.setState({
          contribution_github_status: nextProps.contrib_data.contribution_github_status,
        });
      }
      if (this.state.approval_status === '') {
        this.setState({
          approval_status: nextProps.contrib_data.approval_status,
        });
      }
      if (this.state.project_id === '') {
        this.setState({
          project_id: nextProps.contrib_data.project_id,
        });
      }
      if (this.state.project_name === '') {
        this.setState({
          project_name: nextProps.contrib_data.project_name,
        });
      }
    } else {
      this.setState({
        contribution_github_status: 'denied',
        approval_status: 'denied',
        project_id: '-9999',
        project_name: '',
      });
    };
  }

  handleSubmit = (e) => {
    const { dispatch } = this.props;
    let field = e.target.elements;
    e.preventDefault();
    // Gather changes or pass existing values
    /*
      Was going to simplify with a loop but it would require identical variable names and it
      seemed more confusing than it was worth.
    */
    let changes = this.state.contrib;

    if (!this.state.projectDisabled) {
      changes.project_name = this.state.project_name;
      changes.project_id = this.state.project_id;
      changes.project_new = false;
    } else {
      changes.project_name = field.newProjectNameInput.value;
      changes.project_new = true;
    };

    if (field.contributionDescInput.value.length !== 0) {
      changes.contribution_description = field.contributionDescInput.value;
    };

    if (field.contributionDateInput.value.length !== 0) {
      changes.contribution_date = field.contributionDateInput.value;
    };

    if (field.contributorAliasInput.value.length !== 0) {
      changes.contributor_alias = field.contributorAliasInput.value;
    };

    if (field.githubStatusInput.value !== this.state.contrib.contribution_github_status) {
      changes.contribution_github_status = field.githubStatusInput.value;
    };

    if (field.githubCommitUrlInput.value.length !== 0) {
      changes.contribution_commit_url = field.githubCommitUrlInput.value;
    };

    if (field.contributionUrlInput.value.length !== 0) {
      changes.contribution_commit_url = field.contributionUrlInput.value;
    };

    if (field.approvalStatusInput.value !== this.state.contrib.approval_status) {
      changes.approval_status = field.approvalStatusInput.value;
    };

    if (field.approvalNotesInput.value.length !== 0) {
      changes.approval_notes = field.approvalNotesInput.value;
    };

    if (field.approvalDateInput.value.length !== 0) {
      changes.approval_date = field.approvalDateInput.value;
    };

    if (field.contributionSubmissionDateInput.value.length !== 0) {
      changes.contribution_submission_date = field.contributionSubmissionDateInput.value;
    };

    if (field.contributionClosedDateInput.value.length !== 0) {
      changes.contribution_closed_date = field.contributionClosedDateInput.value;
    };

    // dispatch changes to server
    dispatch(ContributionsActions.updateContribution(changes));
    let getAlert = () => (
      <SweetAlert
        success
        title="Success"
        onConfirm={() => this.hideAlert()}>Entry has been updated
      </SweetAlert>
    );
    this.setState({
      alert: getAlert(),
    });
  }

  hideAlert = () => {
    this.setState({
      alert: null,
    });
    document.getElementById('to-home').click();
  }

  handleSelectChange = (change, loc) => {
    if (this.state[loc] !== change.value) {
      this.setState({
        [loc]: change.value,
      });
    }
  }

  projectList = (e?: any) => {
    // check for length as this can return an empty object
    if (this.props.projects.length) {
      const projects = this.props.projects;
      return projects.map(listValue => {
        return { label: listValue.project_name, value: listValue.project_id };
      });
    } else {
      return [];
    };
  }

  handleProjectChange = (proj) => {
    this.setState({
      project_name: proj.label,
      project_id: proj.value,
    });
  }

  toggleProjectSelect = (e) => {
    this.setState({projectDisabled: e.target.checked});
    let elm = document.getElementById('new-project-text') as HTMLInputElement;
    elm.disabled = this.state.projectDisabled;
  }

  render() {
    let values = [
      { label: 'approved', value: 'approved' },
      { label: 'pending', value: 'pending' },
      { label: 'denied', value: 'denied' },
    ];
    let projectOptions = this.projectList();
    let initialProjectId = this.state.project_id ? this.state.project_id : ''; // Pulled this out as it wasn't appearing in the initial render
    let approval_notes = this.state.contrib.approval_notes;
    return (
      <div className="row">
        <h2>Edit Contribution</h2>
        <form id="edit-contributions-form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Project Name</label>
            <br/>
              <Select
                name="projectIdInput"
                placeholder={initialProjectId}
                options={projectOptions}
                onChange={this.handleProjectChange}
                value={this.state.project_id}
                disabled={this.state.projectDisabled}
                required
                clearable={false}
                autosize={true}
                menuContainerStyle={{ zIndex: 5 }}
                openOnFocus={true}
              />
            <label>Contributor Alias</label>
            <br />
            <div className="form-group">
              <input type="text" className="form-control" id="contributorAliasInput" placeholder={ this.state.contrib.contributor_alias } />
            </div>
            <label>Date of Contribution</label>
            <br />
            <div className="form-group">
              <DatePicker id="contributionDateInput" name="contributionDateInput" value={this.state.contrib.contribution_date} />
            </div>
            <label>Contribution Notification Date</label>
            <br />
            <div className="form-group">
              <DatePicker id="contributionSubmissionDateInput" name="contributionSubmissionDateInput" value={ this.state.contrib.contribution_submission_date} />
            </div>
            <label>Approval Date</label>
            <br />
            <div className="form-group">
              <DatePicker id="approvalDateInput" name="approvalDateInput" value={ this.state.contrib.approval_date } />
            </div>
            <label>Contribution Closed Date</label>
            <br />
            <div className="form-group">
              <DatePicker name="contributionClosedDateInput" value={ this.state.contrib.contribution_closed_date } />
            </div>
            <label>GitHub Status</label>
            <br />
            <div className="form-group">
              <Select
                name="githubStatusInput"
                placeholder={this.state.contribution_github_status}
                options={values}
                onChange={(change) => this.handleSelectChange(change, 'contribution_github_status')}
                value={this.state.contribution_github_status}
                clearable={false}
                autosize={true}
                menuContainerStyle={{ zIndex: 5 }}
                openOnFocus={true}
              />
            </div>
            <label>GitHub Commit URL</label>
            <br />
            <div className="form-group">
              <input type="text" className="form-control" id="githubCommitUrlInput" placeholder={ this.state.contrib.contribution_commit_url } />
            </div>
          </div>
          <div>
            <label>Contribution URL</label>
            <br />
            <div className="form-group">
              <input type="text" className="form-control" id="contributionUrlInput" placeholder={ this.state.contrib.contribution_url } />
            </div>
            <label>Contribution Description</label>
            <br />
            <div className="section">
               <textarea className="form-control" rows={2} id="contributionDescInput" placeholder={ this.state.contrib.contribution_description } />
            </div>
            <label>Internal Approval Status</label>
            <br />
            <div className="form-group">
              <Select
                name="approvalStatusInput"
                placeholder={ this.state.approval_status }
                options={values}
                onChange={(change) => this.handleSelectChange(change, 'approval_status')}
                value={ this.state.approval_status }
                clearable={false}
                autosize={true}
                menuContainerStyle={{ zIndex: 5 }}
                openOnFocus={true}
              />
            </div>
            <label>Approval Notes</label>
            <br />
            <div className="form-group">
              <textarea className="form-control" rows={2} id="approvalNotesInput" placeholder={ approval_notes } />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-10">
              <IndexLink className="btn btn-default im-red" id="to-home" to="/admin">Cancel</IndexLink>
              <button className="btn btn-default im-blue" type="submit">Submit</button>
            </div>
          </div>
        </form>
        {this.state.alert}
      </div>
    );
  }
}

export default connect((state, props: OwnProps) => ({
  ...props,
}))(ContributionsEditor);