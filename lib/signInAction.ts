import { handleSignIn } from "@/actions";



export async function signInAction() {
    await handleSignIn();
} 