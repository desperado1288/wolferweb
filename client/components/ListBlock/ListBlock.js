import React, { PropTypes } from 'react'
import classes from './listBlock.scss'
import ListItem from '../ListItem/ListItem'

function ListBlock ({ title, items }) {
  return (
    <div className={ `panel panel-default ${classes.listBlock}` } >
      <div className='panel-heading'>
        <h3 className='panel-title'>{ title }</h3>
      </div>
      <div className='panel-body'>
        <ul className='list-group item-container'>
          <li className={`list-group-item disabled ${classes.listHeaderWrapper}`}>
            <div>
              Documents:
            </div>
            <div>
              Keywords
            </div>
          </li>
          {items.map(
            (item, index) =>
              <li className='list-group-item' key={ index }>
                <ListItem item={ item }/>
              </li>
          )}
        </ul>
      </div>
    </div>
  )
}

ListBlock.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired
}

export default ListBlock
