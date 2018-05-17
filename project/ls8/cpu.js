/**
 * LS-8 v2.0 emulator skeleton code
 */

/**
 * Class for simulating a simple Computer (CPU & memory)
 */

// tick() switch statement vars
const LDI = 0b10011001,
    PRN = 0b01000011,
    HLT = 0b00000001,
    MUL = 0b10101010,
    DIV = 0b10101011,
    ADD = 0b10101000,
    SUB = 0b10101001,
    INC = 0b01111000,
    DEC = 0b01111001,
    POP = 0b01001100,
    PUSH = 0b01001101,
    CALL = 0b01001000,
    RET = 0b00001001;

const SP = 7;

class CPU {
    /**
     * Initialize the CPU
     */
    constructor(ram) {
        this.ram = ram;

        this.reg = new Array(8).fill(0); // General-purpose registers R0-R7

        this.reg[SP] = 244;

        // Special-purpose registers
        this.PC = 0; // Program Counter

        this.handler = []; // arr of functions to handle IR

        this.handler[LDI] = this.handle_LDI.bind(this);
        this.handler[PRN] = this.handle_PRN.bind(this);
        this.handler[HLT] = this.handle_HLT.bind(this);
        this.handler[MUL] = this.handle_MUL.bind(this);
        this.handler[DIV] = this.handle_DIV.bind(this);
        this.handler[SUB] = this.handle_SUB.bind(this);
        this.handler[ADD] = this.handle_ADD.bind(this);
        this.handler[INC] = this.handle_INC.bind(this);
        this.handler[DEC] = this.handle_DEC.bind(this);
        this.handler[POP] = this.handle_POP.bind(this);
        this.handler[PUSH] = this.handle_PUSH.bind(this);
        this.handler[CALL] = this.handle_CALL.bind(this);
        this.handler[RET] = this.handle_RET.bind(this);
    }

    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        this.ram.write(address, value);
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        this.clock = setInterval(() => {
            this.tick();
        }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
    }

    /**
     * Stops the clock
     */
    stopClock() {
        clearInterval(this.clock);
    }

    /**
     * SAVE THIS FOR EOD OR TOMORROW
     * ALU functionality
     *
     * The ALU is responsible for math and comparisons.
     *
     * If you have an instruction that does math, i.e. MUL, the CPU would hand
     * it off to it's internal ALU component to do the actual work.
     *
     * op can be: ADD SUB MUL DIV INC DEC CMP
     */
    alu(op, regA, regB) {
        switch (op) {
            case "MUL":
                this.reg[regA] *= this.reg[regB];
                break;

            case "DIV":
                this.reg[regA] /= this.reg[regB];
                break;

            case "SUB":
                this.reg[regA] -= this.reg[regB];
                break;

            case "ADD":
                this.reg[regA] += this.reg[regB];
                break;

            case "INC":
                this.reg[regA]++;
                break;

            case "DEC":
                this.reg[regA]--;
                break;
        }
    }

    /**
     * Advances the CPU one cycle
     */
    tick() {
        // Load the instruction register (IR--can just be a local variable here) IR: Instruction Register, contains a copy of the currently executing instruction
        // from the memory address pointed to by the PC. (I.e. the PC holds the
        // index into memory of the instruction that's about to be executed
        // right now.)
        // IR: Instruction Register, contains a copy of the currently executing instruction

        const IR = this.ram.read(this.PC);

        // Debugging output
        // console.log(`${this.PC}: ${IR.toString(2)}`);

        // Get the two bytes in memory _after_ the PC in case the instruction
        // needs them.

        const operandA = this.ram.read(this.PC + 1);
        const operandB = this.ram.read(this.PC + 2);

        const handle = this.handler[IR];
        handle(operandA, operandB);

        // Execute the instruction. Perform the actions for the instruction as
        // outlined in the LS-8 spec.

        // Increment the PC register to go to the next instruction. Instructions
        // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
        // instruction byte tells you how many bytes follow the instruction byte
        // for any particular instruction.
        if (IR !== CALL && IR !== RET) {
            this.PC += (IR >> 6) + 1;
        }
    }

    handle_LDI(operandA, operandB) {
        this.reg[operandA] = operandB;
    }

    handle_PRN(operandA, operandB) {
        console.log(this.reg[operandA]);
    }

    handle_HLT(operandA, operandB) {
        this.stopClock();
    }

    handle_MUL(operandA, operandB) {
        this.alu("MUL", operandA, operandB);
    }

    handle_DIV(operandA, operandB) {
        this.alu("DIV", operandA, operandB);
    }

    handle_SUB(operandA, operandB) {
        this.alu("SUB", operandA, operandB);
    }

    handle_ADD(operandA, operandB) {
        this.alu("ADD", operandA, operandB);
    }

    handle_INC(operandA, operandB) {
        this.alu("INC", operandA, null);
    }

    handle_DEC(operandA, operandB) {
        this.alu("DEC", operandA, operandB);
    }

    handle_PUSH(operandA, operandB) {
        this.stackPointer--; // 243 - 1 = 242 reset
        this.ram.write(this.stackPointer, this.reg[operandA]);
    }

    handle_POP(operandA, operandB) {
        this.reg[operandA] = this.ram.read(this.stackPointer); // 1 | 2
        this.stackPointer++; // 242 + 1 = 243 back to the top of the stack
    }

    handle_CALL(operandA, operandB) {
        this.reg[SP]--;
        this.ram.write(this.reg[SP], this.PC + 2);
        this.PC = this.reg[operandA];
    }

    handle_RET(operandA, operandB) {
        this.PC = this.ram.read(this.reg[SP]);
        this.reg[SP]++;
    }
}

module.exports = CPU;

// switch (IR) {
//     case LDI:
//         this.reg[operandA] = operandB;
//         break;

//     case PRN:
//         console.log(this.reg[operandA]);
//         break;

//     case HLT:
//         this.stopClock();
//         break;

//     case MUL:
//         this.alu("MUL", operandA, operandB);
//         break;

//     case DIV:
//         this.alu("DIV", operandA, operandB);
//         break;

//     case SUB:
//         this.alu("SUB", operandA, operandB);
//         break;

//     case ADD:
//         this.alu("ADD", operandA, operandB);
//         break;

//     case INC:
//         this.alu("INC", operandA, null);
//         break;

//     case DEC:
//         this.alu("DEC", operandA, null);
//         break;

//     default:
//         console.log(`unable to perform: ${IR} ${this.PC}`);
//         this.stopClock();
// }
