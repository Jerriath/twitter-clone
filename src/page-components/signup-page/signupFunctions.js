//Need to check confirmation and username only; other inputs have errors built-in so only need to display username and confirmation errors



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

export const checkConfirmation = (password, confirmation) => {
    if (password === confirmation) {
        return true;
    }
    else {
        return false;
    }
}

export const checkInputs = (username, usersArray, password, confirmation) => {
    if (checkValid(username, usersArray)) {
        if (password === confirmation) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}