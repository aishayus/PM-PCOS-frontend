import React from 'react'
import { Link } from 'react-router-dom'
import { FaWhatsapp, FaInstagram, FaLinkedinIn, FaTiktok } from "react-icons/fa6";
import { PiFlowerLotus } from "react-icons/pi";

const Footer = () => {
    return (
        <section className=''>
            <div className='flex flexCenter flex-col md:flex-row gap-10 my-8'>
                <Link to={''} className='text-2xl text-[#F2E0D2] bg-[#9E182B] p-2 rounded-full '><FaWhatsapp /></Link>
                <Link to={''} className='text-2xl text-[#F2E0D2] bg-[#9E182B] p-2 rounded-full '><FaInstagram /></Link>
                <Link to={''} className='text-2xl text-[#F2E0D2] bg-[#9E182B] p-2 rounded-full '><FaLinkedinIn /></Link>
                <Link to={''} className='text-2xl text-[#F2E0D2] bg-[#9E182B] p-2 rounded-full '><FaTiktok /></Link>
            </div>
            <div className='bg-[#9E182B] flex flexCenter flex-col pt-16 md:pt-12'>
                <PiFlowerLotus className='text-[75px] border p-2 rounded-full bg-[#F2E0D2] text-[#9E182B]' />
                <h2 className='bold-24 my-2 text-[#F2E0D2]'>PM-PCOS</h2>
                <p className='my-2 italic regular-14 text-[#F2E0D2]'>Where women's health matters</p>

                <div className='w-64 md:w-[800px] border-t-2 mt-16 md:mt-12 pt-10 md:pt-5 pb-5 text-center text-xs text-[#F2E0D2]'>
                    Copyright &copy; PM-PCOS | All rights reserved
                </div>
            </div>
        </section>
    )
}

export default Footer
