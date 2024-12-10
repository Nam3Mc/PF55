"use client"


// react
import React, { useState } from "react";

// next
import Link from 'next/link';
import Image from "next/image";

// Navbar.tsx
export const Navbar: React.FC = () => {

    const [isClick, setIsClick] = useState(false);
    const toggleMenu = (): void => {
      setIsClick(!isClick);
    }

    return (
        <nav className="bg-primario">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

                {/* Boton Hamburguesa */}
                <div className="md:hidden flex items-center">
                    <button
                    className="p-2 rounded-md text-arena hover:text-arena focus:outline-none focus:ring-2 focus:ring-inset focus:ring-arena"
                    onClick={toggleMenu}
                    >
                    {isClick ? (
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    )}
                    </button>
                </div>


                {/* Seccion izquierda - Links menu */}
                <div className="hidden md:flex space-x-4">
                    <Link href="/">
                      <div className="text-arena hover:bg-arena hover:text-accion rounded-lg p-2">Inicio</div>
                    </Link>

                    <Link href="/">
                      <div className="text-arena hover:bg-arena hover:text-accion rounded-lg p-2">Sobre nosotros</div>
                    </Link>
                </div>
                
                 {/* Seccion Centro - Logo */}
                <div className="flex justify-center flex-1 lg:mr-32">
                    <Link href="/">
                    Logo
                    </Link>
                </div>

                 {/* Seccion Derecha - perfil, reserva, favoritos / Login o registro botones */}
                 {/* <div className="flex items-center space-x-4 mt-4">
                    <Link href="/">
                        <button className="bg-secundario text-primario w-full py-2 px-4 rounded mb-4 hover:bg-accion hover:text-arena" >Inicia sesión</button>
                    </Link>
                    <Link href="/">
                        <button className="bg-secundario text-primario w-full py-2 px-4 rounded mb-4 hover:bg-accion hover:text-arena" >Registrate</button>
                    </Link>
                </div> */}
                
                <div className="hidden md:flex items-center space-x-4">
                    <Link href="">
                        <i className="fi fi-rr-key text-arena rounded-lg p-2 hover:bg-arena hover:text-accion"> Reservas</i>
                    </Link>
                    <Link href="/">
                        <i className="fi fi-rr-heart text-arena rounded-lg p-2 hover:bg-arena hover:text-accion"> Favoritos</i>
                    </Link>
                    <Link href="/">
                        <i className="fi fi-rr-user text-arena rounded-lg p-2 hover:bg-arena hover:text-accion"> Perfil</i>
                    </Link>
                </div>
            </div>

            {/* Menu hamburguesa */}
            {isClick && (
                <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link href="/">
                        <i className="fi fi-rr-user text-arena rounded-lg p-2 hover:bg-arena hover:text-accion"> Perfil</i>
                    </Link>
                    <Link href="">
                        <i className="fi fi-rr-key text-arena rounded-lg p-2 hover:bg-arena hover:text-accion"> Reservas</i>
                    </Link>
                    <Link href="/">
                        <i className="fi fi-rr-heart text-arena rounded-lg p-2 hover:bg-arena hover:text-accion"> Favoritos</i>
                    </Link>
                    
                    <Link href="/">
                        <div className="text-arena hover:bg-arena hover:text-accion rounded-lg p-2">Inicio</div>
                    </Link>
                    <Link href="/">
                        <div className="text-arena hover:bg-arena hover:text-accion rounded-lg p-2">Sobre nosotros</div>
                    </Link>

                </div>
            )}

        </nav>
    )
}

export default Navbar;