import React, { Component } from 'react'
import { Table, Heading, Link, IconButton, Pane, Icon, Button } from 'evergreen-ui'
import { filter } from 'fuzzaldrin-plus'

import EditProjectDialog from './EditProjectDialog'

const Order = {
  NONE: 'NONE',
  ASC: 'ASC',
  DESC: 'DESC'
}

export default class ProjectList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      searchQuery: '',
      orderedColumn: 1,
      ordering: Order.NONE,
      column2Show: 'email',
      projects: [],
      editProjectVisible: false,
      editProject: null
    }
  }

  componentDidMount () {
    this.props.projectStore.fetchProjects()
  }

  sort () {
    this.props.projectStore.fetchProjects(true)
    const order = this.state.ordering === Order.ASC ? Order.DESC : Order.ASC
    this.setState({ ordering: order })
  }

  // Filter the profiles based on the name property.
  filter (projects) {
    const searchQuery = this.state.searchQuery.trim()

    // If the searchQuery is empty, return the profiles as is.
    if (searchQuery.length === 0) return projects

    return projects.filter(p => {
      // Use the filter from fuzzaldrin-plus to filter by name.
      const result = filter([p.name], searchQuery)
      return result.length === 1
    })
  }

  getIconForOrder (order) {
    switch (order) {
      case Order.ASC:
        return 'arrow-up'
      case Order.DESC:
        return 'arrow-down'
      default:
        return 'arrow-down'
    }
  }

  getIconForStatus (status) {
    switch (status) {
      case 'OK':
        return 'tick-circle'
      default:
        return 'error'
    }
  }

  getColorForStatus (status) {
    switch (status) {
      case 'OK':
        return 'success'
      default:
        return 'danger'
    }
  }

  handleFilterChange (value) {
    this.setState({ searchQuery: value })
  }

  handleEditProject (project) {
    console.log(project)
    this.setState({
      editProject: project,
      editProjectVisible: true
    })
  }

  render () {
    const { state: { projects } } = this.props.projectStore

    const items = this.filter(projects)

    return (
      <Pane>
        <Pane display='flex' alignItems='center'>
          <Heading size={500}>PROJECTS</Heading>
          {this.state.editProjectVisible
            ? <EditProjectDialog
              projectStore={this.props.projectStore}
              project={this.state.editProject}
              isShown={this.state.editProjectVisible}
              onDone={() => this.setState({ editProjectVisible: false })}
            /> : null
          }
          <Button onClick={() => this.setState({ editProjectVisible: !this.state.editProjectVisible })} marginLeft={14} iconBefore='plus' appearance='minimal' intent='none'>NEW</Button>
        </Pane>

        <Table marginY={24}>
          <Table.Head>
            <Table.TextHeaderCell maxWidth={80} textProps={{ size: 400 }}>
              <Pane display='flex'>
                ID
                <IconButton
                  marginLeft={10}
                  icon={this.getIconForOrder(this.state.ordering)}
                  appearance='minimal'
                  height={20}
                  onClick={() => this.sort()}
                />
              </Pane>
            </Table.TextHeaderCell>
            <Table.SearchHeaderCell maxWidth={260}
              onChange={v => this.handleFilterChange(v)}
              value={this.state.searchQuery}
            />
            <Table.TextHeaderCell textProps={{ size: 400 }}>
              Description
            </Table.TextHeaderCell>
            <Table.TextHeaderCell maxWidth={100} textProps={{ size: 400 }}>
              Reports
            </Table.TextHeaderCell>
            <Table.TextHeaderCell maxWidth={80} textProps={{ size: 400 }}>
              Status
            </Table.TextHeaderCell>
            <Table.HeaderCell maxWidth={40}>
            </Table.HeaderCell>
          </Table.Head>
          <Table.Body>
            {items.map(p => (
              <Table.Row key={p.id}>
                <Table.TextCell maxWidth={80} isNumber>
                  {p.id}
                </Table.TextCell>
                <Table.TextCell maxWidth={260} textProps={{ size: 400 }}>
                  <Link href='#'>{p.name}</Link>
                </Table.TextCell>
                <Table.TextCell textProps={{ size: 400 }}>{p.description}</Table.TextCell>
                <Table.TextCell maxWidth={100} isNumber>
                  {p.reports}
                </Table.TextCell>
                <Table.TextCell
                  maxWidth={80}
                  isNumber display='flex' textAlign='center'>
                  <Icon
                    icon={this.getIconForStatus(p.status)}
                    color={this.getColorForStatus(p.status)} />
                </Table.TextCell>
                <Table.Cell maxWidth={40}>
                  <IconButton icon='edit' height={24} appearance='minimal' onClick={ev => this.handleEditProject(p)} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Pane>
    )
  }
}