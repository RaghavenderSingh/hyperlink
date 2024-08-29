import { Keypair } from "@solana/web3.js";
import _sodium from "libsodium-wrappers-sumo";
import bs58 from 'bs58'

const DEFAULT_HYPERLINK_KEYLENGTH = 32; // 32 bytes (256 bits)
const DEFAULT_ORIGIN = process.env.NEXT_PUBLIC_HYPERLINK_ORIGIN;
export const HYPERLINK_ORIGIN =
    process !== undefined && process.env !== undefined
        ? process.env.HYPERLINK_ORIGIN_OVERRIDE ?? DEFAULT_ORIGIN
        : DEFAULT_ORIGIN;
const HYPERLINK_PATH = "/i";

const VERSION_DELIMITER = "_";
const CURRENT_VERSION = 2;

const getSodium = async () => {
    await _sodium.ready;
    return _sodium;
};

const kdf = async (
    fullLength: number,
    pwShort: Uint8Array,
    salt: Uint8Array
) => {
    const sodium = await getSodium();
    return sodium.crypto_pwhash(
        fullLength,
        pwShort,
        salt,
        sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
        sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
        sodium.crypto_pwhash_ALG_DEFAULT
    );
};

const randBuf = async (l: number) => {
    const sodium = await getSodium();
    return sodium.randombytes_buf(l);
};

const pwToKeypair = async (pw: Uint8Array, salt: Uint8Array) => {
    const sodium = await getSodium();
    const seed = await kdf(sodium.crypto_sign_SEEDBYTES, pw, salt);
    return Keypair.fromSeed(seed);
};

export class HyperLink {
    url: URL;
    keypair: Keypair;
    salt: Uint8Array;

    private constructor(url: URL, keypair: Keypair, salt: Uint8Array) {
        this.url = url;
        this.keypair = keypair;
        this.salt = salt;
    }

    public static async create(): Promise<HyperLink> {
        const sodium = await getSodium();
        const pw = await randBuf(DEFAULT_HYPERLINK_KEYLENGTH);
        const salt = await randBuf(sodium.crypto_pwhash_SALTBYTES);
        const keypair = await pwToKeypair(pw, salt);
        const hash = bs58.encode(pw);
        const saltEncoded = bs58.encode(salt);
        const urlString = `${HYPERLINK_ORIGIN}${HYPERLINK_PATH}#${VERSION_DELIMITER}${CURRENT_VERSION}${VERSION_DELIMITER}${hash}${VERSION_DELIMITER}${saltEncoded}`;
        const link = new URL(urlString);
        return new HyperLink(link, keypair, salt);
    }

    public static async fromUrl(url: URL): Promise<HyperLink> {
        const parts = url.hash.slice(1).split(VERSION_DELIMITER);
        if (parts.length !== 4 || parseInt(parts[1]) !== CURRENT_VERSION) {
            throw new Error("Invalid or unsupported hyperlink version");
        }

        const pw = bs58.decode(parts[2]);
        const salt = bs58.decode(parts[3]);

        const keypair = await pwToKeypair(pw, salt);
        return new HyperLink(url, keypair, salt);
    }

    public static async fromLink(link: string): Promise<HyperLink> {
        return this.fromUrl(new URL(link));
    }
}