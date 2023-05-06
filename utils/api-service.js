// Trigger the abort method if a request takes longer than the specified time to execute.
function requestTimeout(ms) {
    let controller = new AbortController();
    setTimeout(() => controller.abort(), ms);
    return controller;
}

function setProps(method, headers, body) {
    let props = {
        method: method
    }

    if (headers) {
        props.headers = headers;
    }

    if (body) {
        if (body instanceof Blob) {
            props.body = body;
        } else {
            props.body = JSON.stringify(body);
        }
    }

    props.signal = requestTimeout(6000).signal

    return props
}

const fetchResource = (options) =>
    fetch(
        'http://localhost:3333/api/1.0.0/'
        + options.endpoint,
        setProps(
            options.method,
            options.headers,
            options.body
        )
    );

export async function addUser(userInfo) {
    let response, responseData;
    try {
        response = await fetchResource({
            endpoint: 'user',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: userInfo
        });
        if (response.ok) {
            responseData = await response.json();
        } else {
            responseData = await response.text();
        }
    } catch (error) {
        console.log(error);
    } finally {
        return { response: response, responseData: responseData };
    }
}

export async function getUserInfo(userId, authToken) {
    let response, responseData;
    try {
        response = await fetchResource({
            endpoint: 'user/' + userId,
            method: 'GET',
            headers: {
                'X-Authorization': authToken
            },
            body: null
        });
        responseData = await response.json();
    } catch (error) {
        console.log(error);
    } finally {
        return { response: response, responseData: responseData };
    }
}

export async function updateUserInfo(userId, authToken, userInfo) {
    let response, responseData;
    try {
        response = await fetchResource({
            endpoint: 'user/' + userId,
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': authToken
            },
            body: userInfo
        });
        responseData = await response.text();
    } catch (error) {
        console.log(error);
    } finally {
        return { response: response, responseData: responseData };
    }
}

export async function login(credentials) {
    let response, responseData;
    try {
        response = await fetchResource({
            endpoint: 'login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: credentials
        });
        responseData = await response.json();
    } catch (error) {
        console.log(error);
    } finally {
        return { response: response, responseData: responseData };
    }
}

export async function logout(authToken) {
    let response;
    try {
        response = await fetchResource({
            endpoint: 'logout',
            method: 'POST',
            headers: {
                'X-Authorization': authToken
            },
            body: null
        });
        response
    } catch (error) {
        console.log(error);
    } finally {
        return { response: response };
    }
}

export async function getUserProfilePhoto(userId, authToken) {
    let response, responseData;
    try {
        response = await fetchResource({
            endpoint: 'user/' + userId + '/photo',
            method: 'GET',
            headers: {
                'X-Authorization': authToken
            },
            body: null
        });
        let rawdata = await response.blob()
        responseData = URL.createObjectURL(rawdata);
    } catch (error) {
        console.log(error);
    } finally {
        return ({ response: response, responseData: responseData });
    }
}

export async function uploadUserProfilePhoto(userId, authToken, photoUri) {
    let response, responseData;

    let res = await fetch(photoUri);
    let photoBlob = await res.blob();

    try {
        response = await fetchResource({
            endpoint: 'user/' + userId + '/photo',
            method: 'POST',
            headers: {
                'Content-Type': photoBlob.type,
                'X-Authorization': authToken
            },
            body: photoBlob
        });
        responseData = await response.text();
    } catch (error) {
        console.log(error);
    } finally {
        return ({ response: response, responseData: responseData });
    }
}

export async function getContacts(authToken) {
    let response, responseData;
    try {
        response = await fetchResource({
            endpoint: 'contacts',
            method: 'GET',
            headers: {
                'X-Authorization': authToken
            },
            body: null
        });
        responseData = await response.json();
    } catch (error) {
        console.log(error);
    } finally {
        return ({ response: response, responseData: responseData });
    }
}

export async function deleteContact(userId, authToken) {
    let response, responseData;
    try {
        response = await fetchResource({
            endpoint: 'user/' + userId + '/contact',
            method: 'DELETE',
            headers: {
                'X-Authorization': authToken
            },
            body: null
        });
        responseData = await response.text();
    } catch (error) {
        console.loh(error);
    } finally {
        return ({ response: response, responseData: responseData });
    }
}

export async function search(query, searchIn, authToken) {
    let response, responseData;
    try {
        response = await fetchResource({
            endpoint: 'search?' + new URLSearchParams({ q: query, search_in: searchIn }),
            method: 'GET',
            headers: {
                'X-Authorization': authToken
            },
            body: null
        });
        responseData = await response.json();
    } catch (error) {
        console.log(error);
    } finally {
        return ({ response: response, responseData: responseData });
    }
}

export async function addContact(userId, authToken) {
    let response, responseData;
    try {
        response = await fetchResource({
            endpoint: 'user/' + userId + '/contact',
            method: 'POST',
            headers: {
                'X-Authorization': authToken
            },
            body: null
        });
        responseData = await response.text();
    } catch (error) {
        console.log(error);
    } finally {
        return ({ response: response, responseData: responseData });
    }
}

export async function blockContact(userId, authToken) {
    let response, responseData;
    try {
        response = await fetchResource({
            endpoint: 'user/' + userId + '/block',
            method: 'POST',
            headers: {
                'X-Authorization': authToken
            },
            body: null
        });
    } catch (error) {
        console.log(error);
    } finally {
        return ({ response: response, responseData: responseData });
    }
}

export async function getBlockedContacts(authToken) {
    let response, responseData;
    try {
        response = await fetchResource({
            endpoint: '/blocked',
            method: 'GET',
            headers: {
                'X-Authorization': authToken
            },
            body: null
        });
        responseData = await response.json();
    } catch (error) {
        console.log(error);
    } finally {
        return ({ response: response, responseData: responseData });
    }
}

export async function unblockContact(userId, authToken) {
    let response, responseData;
    try {
        response = await fetchResource({
            endpoint: 'user/' + userId + '/block',
            method: 'DELETE',
            headers: {
                'X-Authorization': authToken
            },
            body: null
        });
    } catch (error) {
        console.log(error);
    } finally {
        return ({ response: response, responseData: responseData });
    }
}

export async function getChats(authToken) {
    let response, responseData;
    try {
        response = await fetchResource({
            endpoint: 'chat',
            method: 'GET',
            headers: {
                'X-Authorization': authToken
            },
            body: null,
        });
        responseData = await response.json();
    } catch (error) {
        console.log(error);
    } finally {
        return ({ response: response, responseData: responseData });
    }
}

export async function getChatDetails(chatId, authToken) {
    let response, responseData;
    try {
        response = await fetchResource({
            endpoint: 'chat/' + chatId,
            method: 'GET',
            headers: {
                'X-Authorization': authToken
            },
            body: null
        });
        responseData = await response.json();
    } catch (error) {
        console.log(error);
    } finally {
        return ({ response: response, responseData: responseData });
    }
}

export async function sendMessage(chatId, authToken, message) {
    let response
    try {
        response = await fetchResource({
            endpoint: 'chat/' + chatId + '/message',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': authToken
            },
            body: message
        });
    } catch (error) {
        console.log(error);
    } finally {
        return ({ response: response });
    }
}

export async function updateMessage(chatId, messageId, authToken, message) {
    let response;
    try {
        response = await fetchResource({
            endpoint: 'chat/' + chatId + '/message/' + messageId,
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': authToken
            },
            body: message
        });
    } catch (error) {
        console.log(error);
    } finally {
        return ({ response: response });
    }
}

export async function deleteMessage(chatId, messageId, authToken) {
    let response;
    try {
        response = await fetchResource({
            endpoint: 'chat/' + chatId + '/message/' + messageId,
            method: 'DELETE',
            headers: {
                'X-Authorization': authToken
            },
            body: null
        });
    } catch (error) {
        console.log(error);
    } finally {
        return ({ response: response });
    }
}

export async function updateChatName(chatId, chatName, authToken) {
    let response;
    try {
        response = await fetchResource({
            endpoint: 'chat/' + chatId,
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': authToken
            },
            body: chatName
        });
    } catch (error) {
        console.log(error);
    } finally {
        return ({ response: response });
    }
}

export async function removeChatParticipant(chatId, userId, authToken) {
    let response;
    try {
        response = await fetchResource({
            endpoint: 'chat/' + chatId + '/user/' + userId,
            method: 'DELETE',
            headers: {
                'X-Authorization': authToken
            },
            body: null
        });
    } catch (error) {
        console.log(error);
    } finally {
        return ({ response: response });
    }
}

export async function addChatParticipant(chatId, userId, authToken) {
    let response;
    try {
        response = await fetchResource({
            endpoint: 'chat/' + chatId + '/user/' + userId,
            method: 'POST',
            headers: {
                'X-Authorization': authToken
            },
            body: null
        });
    } catch (error) {
        console.log(error);
    } finally {
        return ({ response: response });
    }
}

export async function createNewChat(chatName, authToken) {
    let response, responseData;
    try {
        response = await fetchResource({
            endpoint: 'chat',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': authToken
            },
            body: chatName
        });
    } catch (error) {
        console.log(error);
    } finally {
        return ({ response: response, responseData: responseData });
    }
}