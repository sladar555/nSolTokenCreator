const CaretDirection = ({arrangeDir}: any) => {
    return (
        <div className="faq-item-arrow-wrapper">
            {
                (arrangeDir)? 
                    <div className="flex flex-col py-0 my-0 w-6 h-6 font-extrabold faq-item-arrow faq-item-arrowup"></div>: 
                    <div className="flex flex-col py-0 my-0 w-6 h-6 font-extrabold faq-item-arrow faq-item-arrowdown"></div>
            }
        </div>
    )
}

export default CaretDirection;