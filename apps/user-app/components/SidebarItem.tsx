"use client"
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

const SidebarItem = ({ href, icon, title }: {
    href: string,
    icon: any,
    title: string
}) => {
    const router = useRouter()
    const pathname = usePathname()
    const selected = pathname === href

    return (
        <div className={`flex p-2 pl-8 gap-2 cursor-pointer relative ${selected ? "text-[#6a51a6] left-1" : "text-slate-500"}`} onClick={
            () => {
                router.push(href)
            }
        }>
            <div className='pr-2'>
                {icon}
            </div>
            <div className={`font-bold ${selected ? "text-[#6a51a6]" : "text-slate-500"}`}>
                {title}
            </div>
        </div>
    )
}

export default SidebarItem