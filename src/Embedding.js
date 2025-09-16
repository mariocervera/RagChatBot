export class Embedding {

    constructor({ array, plainText }) {
        this._array = array;
        this._plainText = plainText;
    }

    array() {
        return this._array;
    }

    plainText() {
        return this._plainText;
    }
}
