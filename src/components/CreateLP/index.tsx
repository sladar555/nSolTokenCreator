const CreateLP = () => {
    return (
        <div className="container min-h-screen flex items-center justify-center px-0">
            <div className="py-[20px] lg:!py-[20px]">
                <div className="w-full container flex flex-col items-center justify-center gap-[20px]">
                    <div className="create__container w-full p-0 max-w-[600px] mb-[40px]">
                        <div className="create__form-container w-full px-[2px] sm:px-[8px]">
                            <h2 className="create__heading">
                                <img className="create__heading-icon" src="assets/images/create_lp_icon.svg" alt="Feature Create Icon" />
                                <span>Add Raydium LP</span>
                            </h2>
                            <h3 className="create__subheading">Create a Raydium LP.</h3>
                            <form className="create__form" noValidate={false}>
                                <h4 className="create__input-name">Input Market ID</h4>
                                <div className="relative z-0 w-full mb-4 group">
                                    <input type="text" name="market_id" id="market_id" className="block py-2.5 px-0 w-full text-sm bg-transparent border-solid border-b-[1px] text-white border-gray-500 focus:border-[#8A52EB] focus:outline-none focus:ring-0 peer" placeholder=" " required />
                                    <label htmlFor="market_id" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8A52EB] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Market ID</label>
                                </div>
                            
                                <button type="button" className="create__deploy uppercase focus:outline-0 focus:ring-0" disabled={false}>
                                    Connect Wallet To Proceed
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="create__container w-full p-0 max-w-[600px] mb-[40px]">
                        <div className="create__form-container">
                            <h2 className="create__heading">
                                <img className="create__heading-icon" src="assets/images/create_lp_icon.svg" alt="Feature Create Icon" />
                                <span>Remove Raydium LP</span>
                            </h2>
                            <h3 className="create__subheading">You are able to remove the Liquidity Pool in case Raydium is not displaing it yet.</h3>
                            <form className="create__form" noValidate={false}>
                                <h4 className="create__input-name">Input your token address (CA)</h4>
                                <div className="relative z-0 w-full mb-4 group">
                                    <input type="text" name="token_address" id="token_address" className="block py-2.5 px-0 w-full text-sm bg-transparent border-solid border-b-[1px] text-white border-gray-500 focus:border-[#8A52EB] focus:outline-none focus:ring-0 peer" placeholder=" " required />
                                    <label htmlFor="token_address" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8A52EB] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Token Address (CA)</label>
                                </div>
                            
                                <button type="button" className="create__deploy uppercase focus:outline-0 focus:ring-0" disabled={false}>
                                    Connect Wallet To Proceed
                                </button>
                            </form>
                            <h3 className="create__subheading text-center">* Service fee is 0.1 SOL. If you are removing a pool of 10 SOL, you get 9.90 SOL.</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateLP;