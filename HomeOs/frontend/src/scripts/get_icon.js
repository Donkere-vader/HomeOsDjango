import blackLightIcon from '../static/icons/light_black.svg';
import whiteLightIcon from '../static/icons/light_white.svg';
import whiteCheckIcon from '../static/icons/check_white.svg';
import blackCheckIcon from '../static/icons/check_black.svg';
import whiteSaveIcon from '../static/icons/save_white.svg';
import blackSaveIcon from '../static/icons/save_black.svg'
import whiteAddIcon from '../static/icons/add_white.svg';
import blackAddIcon from '../static/icons/add_black.svg';
import whiteArrowRightIcon from '../static/icons/arrow_right_white.svg';
import blackArrowRightIcon from '../static/icons/arrow_right_black.svg';
import whiteArrowLeftIcon from '../static/icons/arrow_left_white.svg';
import blackArrowLeftIcon from '../static/icons/arrow_left_black.svg';
import whiteHomeIcon from '../static/icons/home_white.svg';
import blackHomeIcon from '../static/icons/home_black.svg'


const ICONS = {
    "light": {
        "black": blackLightIcon,
        "white": whiteLightIcon,
    },
    "check": {
        "black": blackCheckIcon,
        "white": whiteCheckIcon,
    },
    "save": {
        "white": whiteSaveIcon,
        "black": blackSaveIcon,
    },
    "add": {
        "black": blackAddIcon,
        "white": whiteAddIcon,
    },
    "arrow_right": {
        "black":  blackArrowRightIcon,
        "white": whiteArrowRightIcon,
    },
    "arrow_left": {
        "black":  blackArrowLeftIcon,
        "white": whiteArrowLeftIcon,
    },
    "home": {
        "black":  blackHomeIcon,
        "white": whiteHomeIcon,
    },
}

function getIcon(name, color) {
    return ICONS[name][color];
}

export default getIcon;
