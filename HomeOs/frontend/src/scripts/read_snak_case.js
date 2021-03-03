

function readSnakeCase(string) {
    string = string.charAt(0).toUpperCase() + string.slice(1);
    string = string.replace("_", " ");
    return string;
}

export default readSnakeCase;
