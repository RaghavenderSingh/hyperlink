

let privateKey: string | null = null;
let publicKey: string | null = null;

export const setPublicKey = (key: string) => {
    publicKey = key;
};
export const setPrivateKey = (key: string) => {
    privateKey = key;
};

export const getPrivateKey = () => {

    if (privateKey === null) {
        throw new Error("Private key is not set");
    }
    else {
        return privateKey;
    }

};
export const getPublicKey = () => {

    if (publicKey === null) {
        throw new Error("Public key is not set");
    }
    else {
        return publicKey;
    }

};
