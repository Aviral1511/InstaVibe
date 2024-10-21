export const USER_API_ENDPOINT = 'http://localhost:3000/api/user';
export const POST_API_ENDPOINT = 'http://localhost:3000/api/posts';
export const MESSAGE_API_ENDPOINT = 'http://localhost:3000/api/messages';

export const readFileAsDataUrl = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if(typeof reader.result === 'string') resolve(reader.result);
        }
        reader.readAsDataURL(file);
    })
}