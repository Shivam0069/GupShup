export const HOST = "http://localhost:4000";
const AUTH_ROUTE = `${HOST}/api/auth`;
export const CHECK_USER_ROUTE = `${AUTH_ROUTE}/check-user`;
export const ONBOARD_USER_ROUTE = `${AUTH_ROUTE}/onboard-user`;
export const GET_CONTACTS_ROUTE = `${AUTH_ROUTE}/get-contacts`;
export const GET_CALL_TOKEN_ROUTE = `${AUTH_ROUTE}/generate-token`;

const MESSAGES_ROUTE = `${HOST}/api/messages`;
export const ADD_MESSAGE_ROUTE = `${MESSAGES_ROUTE}/add-message`;
export const GET_MESSAGES = `${MESSAGES_ROUTE}/get-messages`;
export const ADD_IMAGE_MESSAGE_ROUTE = `${MESSAGES_ROUTE}/add-image-message`;
export const ADD_AUDIO_MESSAGE_ROUTE = `${MESSAGES_ROUTE}/add-audio-message`;
export const GET_INITIAL_CONTACTS_ROUTE = `${MESSAGES_ROUTE}/get-initial-contacts`;
