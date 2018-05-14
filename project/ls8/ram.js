/**
 * RAM access
 
    RAM: A grid of bits. This is commonly interacted with as an array of bytes, where each byte is 8-bits (thus forming a 2D grid of bits). RAM contains both data (as binary numbers) and instructions (as binary numbers).

 */
class RAM {
    constructor(size) {
        this.mem = new Array(size);
        this.mem.fill(0);
    }

    /**
    MAR: Memory Address Register, holds the memory address we're reading or writing
    MDR: Memory Data Register, holds the value to write or the value just read  

     * Write (store) MDR value at address MAR
     * 
     */
    write(MAR, MDR) {
        // !!! IMPLEMENT ME
        // write the value in the MDR to the address MAR
        // push MAR into MDR
        this.mem[MAR] = MDR;
    }

    /**
     * Read (load) MDR value from address MAR
     *
     * @returns MDR
     */
    read(MAR) {
        // !!! IMPLEMENT ME
        // Read the value in address MAR and return it
        return this.mem[MAR];
    }
}

module.exports = RAM;
