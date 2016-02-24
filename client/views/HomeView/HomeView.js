import React from 'react'
import classes from './HomeView.scss'
import MarkDownRender from '../../components/MarkDownRender/MarkDownRender'

const content = `
# WolferX
**Architecture**
Nginx, Reactjs, Nodejs, MySQL

**Philosophy**
Deploy the best practice of engineering to issues
that encountered during implementation.

**Atmosphere**
Here is for meet up! group up! talk and learn!
for not being alone when gear something up.

**Goal**
To build a solid web application end-to-end solution, that
helps any great idea become a tangible product easier,
faster, and reliable.
`


class HomeView extends React.Component {

  render() {
    return (
      <div className={ classes.homeView }>
        <MarkDownRender mdContent={ content } />
      </div>
    )
  }
}

export default HomeView
