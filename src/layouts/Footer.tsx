import { useLayoutEffect, useState, useEffect } from "react";
import "./Footer.scss";

const Footer = () => {
    return (
        <footer className="relative h-[160px] flex items-center justify-center w-full">
            <div className="absolute bottom-0 z-20 w-full flex flex-row justify-center h-[160px] bg-[#000000] border-x-0 border-b-0 border-t-[#303030] border-[1px] border-solid">
                <div className="container h-[160px] flex flex-row items-center justify-center gap-[20px]">
                    <div className="footer__container">
                        <div className="footer__start">
                            <img className="w-10" src="assets/images/logo-sm.png" alt="Footer Logo" data-xblocker="passed" style={{ visibility: "visible" }} />
                            <div className="footer__description hidden sm:block">
                                <h6 className="footer__heading">DEPLOYSOL.XYZ</h6>
                                <p className="footer__paragraph">Best Solution you can find to Deploy Tokens on Solana</p>
                            </div>
                        </div>
                        <div className="footer__end">
                            <div className="footer__menu footer-menu-nav">
                                <h6 className="footer__menu-heading">Menu</h6>
                                <ul className="footer__menu-list">
                                    <li className="footer__menu-item">
                                        <a href="/create">Create Token</a>
                                    </li>
                                    <li className="footer__menu-item">
                                        <a href="https://openbook.deploysol.xyz/">Openbook Manager</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="footer__menu footer__menu--socials">
                                <h6 className="footer__menu-heading">Socials</h6>
                                <div className="footer__menu-list footer__menu-list--socials">
                                    <a>
                                        <svg className="cursor-pointer border-[1px] rounded-full w-[30px] h-[30px]" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="currentColor" d="M11.994 2a10 10 0 1 0 10 10a10 10 0 0 0-10-10m3.18 15.152a.705.705 0 0 1-1.002.352l-2.715-2.11l-1.742 1.608a.3.3 0 0 1-.285.039l.334-2.989l.01.009l.007-.059s4.885-4.448 5.084-4.637c.202-.189.135-.23.135-.23c.012-.23-.361 0-.361 0l-6.473 4.164l-2.695-.918s-.414-.148-.453-.475c-.041-.324.466-.5.466-.5l10.717-4.258s.881-.392.881.258Z"/></svg>
                                    </a>
                                    <a>
                                        <svg className="cursor-pointer border-[1px] rounded-full w-[26px] h-[26px]" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="currentColor" d="M18.205 2.25h3.308l-7.227 8.26l8.502 11.24H16.13l-5.214-6.817L4.95 21.75H1.64l7.73-8.835L1.215 2.25H8.04l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"/></svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;