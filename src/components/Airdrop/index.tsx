const Airdrop = () => {
    return (
        <div className="container min-h-screen flex items-start justify-center px-[40px]">
            <div className="w-full py-[20px] lg:!py-[20px] flex flex-col mt-[60px] items-center justify-center">
                <div className="max-w-[600px] w-full flex flex-col items-center justify-center gap-[20px]">
                    <div className="create__container w-full p-0 w-full mb-[40px]">
                        <div className="create__form-container">
                            <h2 className="create__heading">
                                <img className="create__heading-icon" src="assets/images/create_lp_icon.svg" alt="Feature Create Icon" />
                                <span>Airdrop Tokens</span>
                            </h2>
                            <h3 className="create__subheading">Send Tokens with one transaction to multiple wallets at once.</h3>
                            <form className="create__form" noValidate={false}>
                                <h4 className="create__input-name">Choose Token</h4>

                                {/* <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="mb-4 w-full flex flex-row justify-between border-[1px] border-gray-500 text-white focus:ring-[1px] focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center bg-transparent hover:bg-[#8A52EB] focus:ring-[#8A52EB]" type="button">
                                    Connect wallet to proceed
                                    <svg className="w-2.5 h-2.5 ms-3 focus:color-[#8A52EB]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                                    </svg>
                                </button> */}

                                <div id="dropdown" className="z-10 hidden divide-y divide-gray-100 rounded-lg shadow w-44 bg-gray-700">
                                    <ul className="py-2 text-sm text-gray-200" aria-labelledby="dropdownDefaultButton">
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-gray-600 hover:text-white">Dashboard</a>
                                        </li>
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-gray-600 hover:text-white">Settings</a>
                                        </li>
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-gray-600 hover:text-white">Earnings</a>
                                        </li>
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-gray-600 hover:text-white">Sign out</a>
                                        </li>
                                    </ul>
                                </div>

                                <div className="flex flex-row justify-between items-center w-full gap-[20px]">
                                    <div className="relative z-0 w-full mb-4 group">
                                        <input type="text" name="wallet" id="wallet" className="block py-2.5 px-0 w-full text-sm bg-transparent border-solid border-b-[1px] text-white border-gray-500 focus:border-[#8A52EB] focus:outline-none focus:ring-0 peer" placeholder=" " required />
                                        <label htmlFor="wallet" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8A52EB] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Enter wallet to airdrop</label>
                                    </div>
                                    <div className="relative z-0 w-full mb-4 group">
                                        <input type="text" name="amount" id="amount" defaultValue={100} className="block py-2.5 px-0 w-full text-sm bg-transparent border-solid border-b-[1px] text-white border-gray-500 focus:border-[#8A52EB] focus:outline-none focus:ring-0 peer" placeholder=" " required />
                                        <label htmlFor="amount" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8A52EB] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Enter amount to airdrop</label>
                                    </div>
                                </div>
                            
                                <button type="button" className="create__deploy uppercase" disabled={false}>
                                    Airdrop (0.050 SOL)
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Airdrop;