function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

function readSnakeCase(string) {
    string = string.charAt(0).toUpperCase() + string.slice(1);
    string = replaceAll(string, "_", " ");
    return string;
}

export default readSnakeCase;
