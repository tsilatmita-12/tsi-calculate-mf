class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                computation = prev / current;
                break;
            default:
                return;
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            // Map internal action names to display symbols
            const operationSymbols = {
                'add': '+',
                'subtract': '-',
                'multiply': '×',
                'divide': '÷'
            };
            this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${operationSymbols[this.operation] || ''}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Add click effect and handling
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        // Animation
        button.classList.add('pressed');
        setTimeout(() => button.classList.remove('pressed'), 100);

        // Logic
        if (button.dataset.number) {
            calculator.appendNumber(button.dataset.number);
            calculator.updateDisplay();
        }
        if (button.dataset.action) {
            const action = button.dataset.action;
            if (action === 'clear') {
                calculator.clear();
                calculator.updateDisplay();
            } else if (action === 'delete') {
                calculator.delete();
                calculator.updateDisplay();
            } else if (action === 'equals') {
                calculator.compute();
                calculator.updateDisplay();
            } else {
                calculator.chooseOperation(action);
                calculator.updateDisplay();
            }
        }
    });
});

// Basic Keyboard Support
document.addEventListener('keydown', (e) => {
    let key = e.key;
    if (key >= '0' && key <= '9') {
        calculator.appendNumber(key);
    } else if (key === '.') {
        calculator.appendNumber(key);
    } else if (key === '=' || key === 'Enter') {
        calculator.compute();
    } else if (key === 'Backspace') {
        calculator.delete();
    } else if (key === 'Escape') {
        calculator.clear();
    } else if (key === '+' || key === '-') {
        calculator.chooseOperation(key === '+' ? 'add' : 'subtract');
    } else if (key === '*') {
        calculator.chooseOperation('multiply');
    } else if (key === '/') {
        calculator.chooseOperation('divide');
    }
    calculator.updateDisplay();
});
