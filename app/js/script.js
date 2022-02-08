function showLoader() {
    document.getElementById("loader").style.display = "block";
}

function hideLoader() {
    document.getElementById("loader").style.display = "none";
}

function transformScroll(event) {
    if (!event.deltaY) {
        return;
    }

    event.currentTarget.scrollLeft += event.deltaY + event.deltaX;
    event.preventDefault();
}

document.getElementById("tab_bar").addEventListener("wheel", transformScroll)

function validURL(str) {
    var pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol1
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

var urlbar = document.getElementById("urlbar");


window.addEventListener("keydown", (e) => {
    if (e.key == "Enter" && document.activeElement == urlbar) {
        var url = urlbar.value;
        urlbar.blur();

        if (url.substring(0, 7) == "file://") {
            navigate(url);
            return 0;
        }
        if (validURL(url) == true) {
            var pat = /^https?:\/\//i;
            if (pat.test(url)) {
                navigate(url);
            } else {
                url = "http://" + url;
                navigate(url);
            }

        } else {
            var search = ipcRenderer.sendSync("searchString") + url
            navigate(search);
        }
    }
})

//initialize menu

function openMenu() {
    ipcRenderer.send("openMenu")
}

ipcRenderer.on("command", (e, command) => {
    if (command == "reload") {
        reload();
    }

    if (command == "devtools") {
        openDevTools();
    }

    if (command == "settings") {
        showSettingsModal();
    }
})

afterinit = true;

if (settings.readKeyFromFile("experimental.conf.json", "blur") == true) {
    document.getElementById("topbar").style.backgroundColor = "rgba(27, 27, 27, 0.5)";
}

const startup_url = ipcRenderer.sendSync("openFirst");

if (startup_url != "null") {
    newTab(startup_url);
}
else {
    newTab();
}

function hideCurrentTab() {
    return ipcRenderer.sendSync("hideCurrentTab");
}

function showCurrentTab() {
    return ipcRenderer.sendSync("showCurrentTab");
}

function showSettingsModal() {
    const placeholder = document.getElementById("tab_placeholder");
    placeholder.src = hideCurrentTab();
    const modal = document.getElementById("settings_modal");

    modal.style.transform = "translate(-50%, -50%) scale(0, 0)"

    modal.style.display = "block";
    document.getElementById("settings_iframe").reload();

    setTimeout(() => {
        modal.style.transform = "translate(-50%, -50%) scale(1, 1)"
    }, 10);

    if (isDebug()) {
        document.getElementById("settings_iframe").openDevTools();
    }
    document.getElementById("settings_modal_back").style.display = "block";
}

function hideSettingsModal() {
    if (isDebug()) {
        document.getElementById("settings_iframe").closeDevTools();
    }
    const placeholder = document.getElementById("tab_placeholder");
    const modal = document.getElementById("settings_modal");
    modal.style.transform = "translate(-50%, -50%) scale(0, 0)"
    setTimeout(() => {
        modal.style.display = "none";
        document.getElementById("settings_modal_back").style.display = "none";
        showCurrentTab();
        placeholder.src = "";
    }, 300);
}