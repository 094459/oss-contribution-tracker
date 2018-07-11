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
import * as mockery from 'mockery';

describe('index', () => {
  let mock: any;
  let strategic: any;

  beforeEach(() => {
    mockery.enable({ useCleanCache: true, warnOnUnregistered: false });
    mock = {
      dbcontributions: {
        getLastWeekCount: jasmine.createSpy('dbcontributions').and.returnValue({
          numcontribs: '1',
        }),
        getMTDCount: jasmine.createSpy('dbcontributions').and.returnValue({
          numcontribs: '2',
        }),
        getLastMonthCount: jasmine
          .createSpy('dbcontributions')
          .and.returnValue({
            numcontribs: '3',
          }),
        getYTDCount: jasmine.createSpy('dbcontributions').and.returnValue({
          numcontribs: '4',
        }),
      },
      dbgroups: {
        listGroups: jasmine.createSpy('dbgroups').and.returnValue([
          {
            group_id: 1,
            group_name: 'Test 1',
            projects: [1, 2],
          },
          {
            group_id: 2,
            group_name: 'Test 2',
            projects: [1, 3],
          },
        ]),
        searchGroupIdsByProjectId: jasmine
          .createSpy('dbgroups')
          .and.callFake(projectId => {
            if (projectId === 1) {
              return { groups: [1, 2] };
            } else if (projectId === 2) {
              return { groups: [1] };
            } else if (projectId === 3) {
              return { groups: [2] };
            } else {
              return { groups: [] };
            }
          }),
        getGroupById: jasmine.createSpy('dbgroups').and.callFake(groupId => {
          if (groupId === 1) {
            return {
              group_id: 1,
              group_name: 'Test 1',
              projects: [1, 2],
            };
          } else if (groupId === 2) {
            return {
              group_id: 2,
              group_name: 'Test 2',
              projects: [1, 3],
            };
          } else {
            return {};
          }
        }),
        getGroupsByProjectId: jasmine
          .createSpy('dbgroups')
          .and.callFake(projectId => {
            if (projectId.toString() === '1') {
              return [
                {
                  group_id: 1,
                  group_name: 'Test 1',
                  projects: [1, 2],
                },
                {
                  group_id: 2,
                  group_name: 'Test 2',
                  projects: [1, 3],
                },
              ];
            } else if (projectId.toString() === '2') {
              return [
                {
                  group_id: 1,
                  group_name: 'Test 1',
                  projects: [1, 2],
                },
              ];
            } else if (projectId.toString() === '3') {
              return [
                {
                  group_id: 2,
                  group_name: 'Test 2',
                  projects: [1, 3],
                },
              ];
            } else {
              return [{}];
            }
          }),
      },
      dbprojects: {
        getAllStrategicProjects: jasmine
          .createSpy('dbprojects')
          .and.returnValue([
            {
              project_id: 1,
              project_name: 'A',
              project_url: 'A.com',
              project_verified: true,
              project_auto_approval: true,
            },
            {
              project_id: 2,
              project_name: 'B',
              project_url: 'B.com',
              project_verified: true,
              project_auto_approval: true,
            },
            {
              project_id: 3,
              project_name: 'C',
              project_url: 'C.com',
              project_verified: true,
              project_auto_approval: true,
            },
          ]),
        getProjectsByGroup: jasmine
          .createSpy('dbprojects')
          .and.callFake(groupId => {
            if (groupId === 1) {
              return [
                {
                  project_id: 1,
                  project_name: 'A',
                  project_url: 'A.com',
                  project_verified: true,
                  project_auto_approval: true,
                },
                {
                  project_id: 2,
                  project_name: 'B',
                  project_url: 'B.com',
                  project_verified: true,
                  project_auto_approval: true,
                },
              ];
            } else if (groupId === 2) {
              return [
                {
                  project_id: 1,
                  project_name: 'A',
                  project_url: 'A.com',
                  project_verified: true,
                  project_auto_approval: true,
                },
                {
                  project_id: 3,
                  project_name: 'C',
                  project_url: 'C.com',
                  project_verified: true,
                  project_auto_approval: true,
                },
              ];
            }
          }),
        searchProjectById: jasmine
          .createSpy('dbprojects')
          .and.callFake(projectId => {
            if (projectId === 1) {
              return [
                {
                  project_id: 1,
                  project_name: 'A',
                  project_url: 'A.com',
                  project_verified: true,
                  project_auto_approval: true,
                },
              ];
            } else if (projectId === 2) {
              return [
                {
                  project_id: 2,
                  project_name: 'B',
                  project_url: 'B.com',
                  project_verified: true,
                  project_auto_approval: true,
                },
              ];
            } else if (projectId === 3) {
              return [
                {
                  project_id: 3,
                  project_name: 'C',
                  project_url: 'C.com',
                  project_verified: true,
                  project_auto_approval: true,
                },
              ];
            } else {
              return [];
            }
          }),
      },
      dbusers: {
        getUsernamesByGroup: jasmine
          .createSpy('dbusers')
          .and.callFake(groupId => {
            if (groupId.toString() === '1') {
              return { names: ['alpha', 'beta'] };
            } else if (groupId.toString() === '2') {
              return { names: ['alpha', 'charlie'] };
            } else {
              return { names: ['alpha', 'beta', 'charlie'] };
            }
          }),
        getUsersByGroup: jasmine.createSpy('dbusers').and.callFake(groupId => {
          if (groupId === '1') {
            return [
              {
                amazon_alias: 'alpha',
                github_alias: 'alpha',
                groups: { 1: '2017-01-01', 2: '2017-01-01' },
              },
              {
                amazon_alias: 'beta',
                github_alias: 'beta',
                groups: { 1: '2017-06-01' },
              },
            ];
          } else if (groupId === '2') {
            return [
              {
                amazon_alias: 'alpha',
                github_alias: 'alpha',
                groups: { 1: '2017-01-01', 2: '2017-01-01' },
              },
              {
                amazon_alias: 'charlie',
                github_alias: 'charlie',
                groups: { 2: '2018-02-01' },
              },
            ];
          }
        }),
      },
    };
    mockery.registerMock('../../db/groups', {
      listGroups: mock.dbgroups.listGroups,
      searchGroupIdsByProjectId: mock.dbgroups.searchGroupIdsByProjectId,
      getGroupsByProjectId: mock.dbgroups.getGroupsByProjectId,
      getGroupById: mock.dbgroups.getGroupById,
    });
    mockery.registerMock('../../db/projects', {
      searchProjectById: mock.dbprojects.searchProjectById,
      getProjectsByGroup: mock.dbprojects.getProjectsByGroup,
      getAllStrategicProjects: mock.dbprojects.getAllStrategicProjects,
    });
    mockery.registerMock('../../db/users', {
      getUsersByGroup: mock.dbusers.getUsersByGroup,
      getUsernamesByGroup: mock.dbusers.getUsernamesByGroup,
    });
    mockery.registerMock('../../db/contributions', {
      getLastWeekCount: mock.dbcontributions.getLastWeekCount,
      getMTDCount: mock.dbcontributions.getMTDCount,
      getLastMonthCount: mock.dbcontributions.getLastMonthCount,
      getYTDCount: mock.dbcontributions.getYTDCount,
    });
    mockery.registerAllowable('./index');
    strategic = require('./index');
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('strategic groups', () => {
    it('should list all strategic groups', async done => {
      const groups = await strategic.listGroups({});
      expect(mock.dbgroups.listGroups).toHaveBeenCalled();
      expect(mock.dbusers.getUsernamesByGroup).toHaveBeenCalled();
      expect(mock.dbcontributions.getLastWeekCount).toHaveBeenCalled();
      expect(mock.dbcontributions.getMTDCount).toHaveBeenCalled();
      expect(mock.dbcontributions.getLastMonthCount).toHaveBeenCalled();
      expect(mock.dbcontributions.getYTDCount).toHaveBeenCalled();
      expect(groups).toEqual({
        groupList: [
          {
            group_id: 1,
            group_name: 'Test 1',
            projects: [1, 2],
            numUsers: 2,
            numProjects: 2,
            contribWeek: 1,
            contribMTD: 2,
            contribMonth: 3,
            contribYear: 4,
          },
          {
            group_id: 2,
            group_name: 'Test 2',
            projects: [1, 3],
            numUsers: 2,
            numProjects: 2,
            contribWeek: 1,
            contribMTD: 2,
            contribMonth: 3,
            contribYear: 4,
          },
        ],
      });
      done();
    });

    it('should list all strategic projects', async done => {
      const projects = await strategic.listStrategicProjects({});
      expect(mock.dbprojects.getAllStrategicProjects).toHaveBeenCalled();
      expect(mock.dbgroups.searchGroupIdsByProjectId).toHaveBeenCalled();
      expect(mock.dbusers.getUsernamesByGroup).toHaveBeenCalled();
      expect(mock.dbcontributions.getLastWeekCount).toHaveBeenCalled();
      expect(mock.dbcontributions.getMTDCount).toHaveBeenCalled();
      expect(mock.dbcontributions.getLastMonthCount).toHaveBeenCalled();
      expect(mock.dbcontributions.getYTDCount).toHaveBeenCalled();
      expect(projects).toEqual({
        projectList: [
          {
            project_id: 1,
            project_name: 'A',
            project_url: 'A.com',
            project_verified: true,
            project_auto_approval: true,
            numGroups: 2,
            numUsers: 3,
            contribWeek: 1,
            contribMTD: 2,
            contribMonth: 3,
            contribYear: 4,
          },
          {
            project_id: 2,
            project_name: 'B',
            project_url: 'B.com',
            project_verified: true,
            project_auto_approval: true,
            numGroups: 1,
            numUsers: 2,
            contribWeek: 1,
            contribMTD: 2,
            contribMonth: 3,
            contribYear: 4,
          },
          {
            project_id: 3,
            project_name: 'C',
            project_url: 'C.com',
            project_verified: true,
            project_auto_approval: true,
            numGroups: 1,
            numUsers: 2,
            contribWeek: 1,
            contribMTD: 2,
            contribMonth: 3,
            contribYear: 4,
          },
        ],
      });
      done();
    });

    it('should get group info by id', async done => {
      const group = await strategic.getGroup({}, 1);
      expect(mock.dbgroups.getGroupById).toHaveBeenCalled();
      expect(mock.dbprojects.getProjectsByGroup).toHaveBeenCalled();
      expect(mock.dbusers.getUsernamesByGroup).toHaveBeenCalled();
      expect(mock.dbcontributions.getLastWeekCount).toHaveBeenCalled();
      expect(mock.dbcontributions.getMTDCount).toHaveBeenCalled();
      expect(mock.dbcontributions.getLastMonthCount).toHaveBeenCalled();
      expect(mock.dbcontributions.getYTDCount).toHaveBeenCalled();
      expect(group).toEqual({
        group: { group_id: 1, group_name: 'Test 1', projects: [1, 2] },
        projects: [
          {
            project_id: 1,
            project_name: 'A',
            project_url: 'A.com',
            project_verified: true,
            project_auto_approval: true,
            contribWeek: 1,
            contribMTD: 2,
            contribMonth: 3,
            contribYear: 4,
          },
          {
            project_id: 2,
            project_name: 'B',
            project_url: 'B.com',
            project_verified: true,
            project_auto_approval: true,
            contribWeek: 1,
            contribMTD: 2,
            contribMonth: 3,
            contribYear: 4,
          },
        ],
        users: [
          {
            amazon_alias: 'alpha',
            github_alias: 'alpha',
            groups: { 1: '2017-01-01', 2: '2017-01-01' },
            contribWeek: 1,
            contribMTD: 2,
            contribMonth: 3,
            contribYear: 4,
          },
          {
            amazon_alias: 'beta',
            github_alias: 'beta',
            groups: { 1: '2017-06-01' },
            contribWeek: 1,
            contribMTD: 2,
            contribMonth: 3,
            contribYear: 4,
          },
        ],
      });
      done();
    });

    it('should get strategic project info by id', async done => {
      const project = await strategic.getStrategicProject({}, 1);
      expect(mock.dbprojects.searchProjectById).toHaveBeenCalled();
      expect(mock.dbgroups.searchGroupIdsByProjectId).toHaveBeenCalled();
      expect(mock.dbusers.getUsernamesByGroup).toHaveBeenCalled();
      expect(mock.dbcontributions.getLastWeekCount).toHaveBeenCalled();
      expect(mock.dbcontributions.getMTDCount).toHaveBeenCalled();
      expect(mock.dbcontributions.getLastMonthCount).toHaveBeenCalled();
      expect(mock.dbcontributions.getYTDCount).toHaveBeenCalled();
      expect(project).toEqual({
        project: {
          project_id: 1,
          project_name: 'A',
          project_url: 'A.com',
          project_verified: true,
          project_auto_approval: true,
        },
        groups: [
          {
            group_id: 1,
            group_name: 'Test 1',
            projects: [1, 2],
            contribWeek: 1,
            contribMTD: 2,
            contribMonth: 3,
            contribYear: 4,
          },
          {
            group_id: 2,
            group_name: 'Test 2',
            projects: [1, 3],
            contribWeek: 1,
            contribMTD: 2,
            contribMonth: 3,
            contribYear: 4,
          },
        ],
        users: [
          {
            amazon_alias: 'alpha',
            contribWeek: 1,
            contribMTD: 2,
            contribMonth: 3,
            contribYear: 4,
          },
          {
            amazon_alias: 'beta',
            contribWeek: 1,
            contribMTD: 2,
            contribMonth: 3,
            contribYear: 4,
          },
          {
            amazon_alias: 'charlie',
            contribWeek: 1,
            contribMTD: 2,
            contribMonth: 3,
            contribYear: 4,
          },
        ],
      });
      done();
    });

    it('should list the projects in a group', async done => {
      const projects = await strategic.listProjects({ body: { id: 1 } });
      expect(mock.dbprojects.getProjectsByGroup).toHaveBeenCalled();
      expect(projects).toEqual({
        projectList: [
          {
            project_id: 1,
            project_name: 'A',
            project_url: 'A.com',
            project_verified: true,
            project_auto_approval: true,
          },
          {
            project_id: 2,
            project_name: 'B',
            project_url: 'B.com',
            project_verified: true,
            project_auto_approval: true,
          },
        ],
      });
      done();
    });
  });
});
