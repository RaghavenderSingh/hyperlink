

let privateKey: string | null = null;

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
