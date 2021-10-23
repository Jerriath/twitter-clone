



export const checkValid = (username, usersArray) => {
    let valid = true;
    for (let i = 0; i < usersArray.length; i++) {
        if (username === usersArray[i].username) {
            valid = false;
            break;
        }
    }
    return valid;
}

export const checkPasswords = (password, confirmation) => {
    if (password === confirmation) {
        return true;
    }
    else {
        return false;
    }
}