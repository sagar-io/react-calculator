export default function Button(prop) {
    return (
        (prop.value === 'FACT') ? 
        <div className= {prop.isShowFactTray ? "calc-btn fact-btn active" : "calc-btn fact-btn"} onClick={prop.flipGetFact}>{prop.value}</div>
        :
        <div className="calc-btn" onClick={(e) => prop.handleClick(e)}>{prop.value}</div>
    )
}