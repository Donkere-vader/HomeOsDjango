import blackLightIcon from '../static/icons/light_black.svg';
import whiteLightIcon from '../static/icons/light_white.svg';
import whiteCheckIcon from '../static/icons/check_white.svg';
import blackCheckIcon from '../static/icons/check_black.svg';

const ICONS = {
    "light": {
        "black": blackLightIcon,
        "white": whiteLightIcon
    },
    "check": {
        "black": blackCheckIcon,
        "white": whiteCheckIcon
    }
}

function getIcon(name, color) {
    return ICONS[name][color];
}

export default getIcon;
