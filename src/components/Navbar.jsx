import React from 'react'
import { FaWpforms } from "react-icons/fa";
import { FaWatchmanMonitoring } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { IoMdClose } from "react-icons/io";

const Navbar = ({containerStyles, menuOpen, toggleMenu}) => {
    const navItems = [
        { to: '/myform', label: 'Form', icon: <FaWpforms className='w-5 h-5'/>},
        { to: '/myhealth', label: 'My Health', icon: <FaWatchmanMonitoring className='w-5 h-5'/>},
    ]

    const handleNavItemClick = () => {
        if (window.innerWidth < 768) {
            toggleMenu();
        }
    };

    return (
        <nav className={containerStyles}>
            {menuOpen && (
                <>
                    <IoMdClose onClick={toggleMenu} className='text-2xl self-end cursor-pointer relative left-7 top-3'/>
                </>
            )}


            {navItems.map(({to, label, icon}) => (
            <NavLink key={label} to={to} 
                onClick={handleNavItemClick}
                className={({isActive}) => `${isActive ? 'border-b-2 border-b-[#9E182B] px-2 py-0.5' : ''}`}>
                <span className='flex items-center gap-x-2'>{icon}{label}</span>
            </NavLink>
            ))}
        </nav>

    )
}

export default Navbar
