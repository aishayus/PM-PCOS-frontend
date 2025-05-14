import React from 'react';
import { FaHome } from "react-icons/fa";
import { MdOutlineFeaturedPlayList } from "react-icons/md";
import { IoMdCodeWorking, IoMdClose, IoMdContact } from "react-icons/io";
import { CgSupport } from 'react-icons/cg';

const NavBeforeLogin = ({ containerStyles, menuOpen, toggleMenu }) => {
    const navItems = [
        { href: '#',           label: 'Home',        icon: <FaHome className='w-5 h-5' /> },
        { href: '#features',   label: 'Features',    icon: <MdOutlineFeaturedPlayList className='w-5 h-5' /> },
        { href: '#howitworks', label: 'How It Works',icon: <IoMdCodeWorking className='w-5 h-5' /> },
        { href: '#about',      label: 'About',       icon: <CgSupport className='w-5 h-5' /> },
        { href: '#contact',    label: 'Contact',     icon: <IoMdContact className='w-5 h-5' /> },
    ];
    
    const handleNavItemClick = () => {
        if (window.innerWidth < 768) {
            toggleMenu();
        }
    };

    return (
        <nav className={containerStyles}>
        {menuOpen && (
            <IoMdClose onClick={toggleMenu} className='text-2xl self-end cursor-pointer relative left-7 top-3'/>
        )}
        {navItems.map(({ href, label, icon }) => (
            <a 
                key={label} 
                href={href} 
                onClick={handleNavItemClick}
                className='flex items-center gap-x-2 py-1 hover:border-b-2 hover:border-[#9E182B]' 
            >
                {icon}{label}
            </a>
        ))}
        </nav>
    );
};

export default NavBeforeLogin;