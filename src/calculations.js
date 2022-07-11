export default function calculations(prevOperand, currentOperand, operator) {
    let result

    switch(operator){
        case '+':
            result = parseFloat(prevOperand) + parseFloat(currentOperand)
            break
            case '-':
            result = parseFloat(prevOperand) - parseFloat(currentOperand)
            break
            case 'x':
            result = parseFloat(prevOperand) * parseFloat(currentOperand)
            break
            case '÷':
            result = parseFloat(prevOperand) / parseFloat(currentOperand)
            break
    }
    return result
}