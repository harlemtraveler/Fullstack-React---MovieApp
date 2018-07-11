import React from 'react';
import { NavLink } from 'react-router-dom';

const isActive = (match, location) => {
    return match && match.path === location.pathname
}

export const Sidebar = props => (
    <div className="sidebar">
        <section>
            <div className='heading'>Nav</div>
            <ul>
                <li>
                    <NavLink
                        to='/' isActive={isActive}>
                        Discover
                    </NavLink>
                </li>
            </ul>
        </section>
        <section>
            <div className='heading'>Links</div>
            <ul>
                <li>
                    <NavLink
                        to='/' isActive={isActive}
                    >Home</NavLink></li>
                <li>
                    <NavLink
                        to='/about' isActive={isActive}
                    >About</NavLink></li>
            </ul>
        </section>
    </div>
)

export default Sidebar;
