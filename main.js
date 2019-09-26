const electron = require('electron');
const { app, BrowserWindow ,Menu, autoUpdater } = electron;
const url = 'https://www.hackerrank.com/contests/smart-interviews/'
let mainWindow = null;
let attempt = 3, flag = true;

function functionCall() {
    if(mainWindow == null) {
        console.log('mainwindow NULL')
        return ;
    }
    mainWindow.loadURL(url);
}

function handleClick(event) {
    // console.log('User clicked notification ' + event.id + '. Closing it immediately.');
    event.closeNotification();
}

app.on('browser-window-blur', () => {
    // console.log(electron.BrowserView)
    // console.log('app blurred');
    setTimeout(() => {
        console.log('waiting')
    }, 1000);
    if(flag) {
        if(attempt == 0) {
            setTimeout(() => {
                app.quit();
            }, 0);
        }
        const eNotify = require('electron-notify');
        if(attempt > 1) {
                eNotify.notify({
                    title: 'Warning',
                    text: 'Go to Contest tab within 5 sec, if not you will be out of contest',
                    onClickFunc: handleClick,
                    // onCloseFunc: handleClose
                });
        }
        else {
            eNotify.notify({
                title: 'Warning',
                text: 'Go to Contest tab within 5 sec, Last Chance',
                onClickFunc: handleClick,
                // onCloseFunc: handleClose
            });
        }
        setTimeout(() => {
            if(mainWindow.isFocused()) {
                console.log('focussed')
            }
            else {
                // console.log('not focussed exiting')
                setTimeout(() => {
                    app.quit();
                }, 0);
            }
        }, 5000);
        attempt -= 1;
    }
    
});

app.on('browser-window-focus', () => flag = true)

// listen for app
app.on('ready', () => {
    //create new window
    try {
        mainWindow = new BrowserWindow({
            webPreferences: {
                nodeIntegration: false
            },
            show: false,
            backgroundColor: '#09c7fa'
        }); 
        mainWindow.setFullScreen(true);
        //load html
        // mainWindow.loadURL(url);
        
        mainWindow.loadFile('mainWindow.html');
        mainWindow.webContents.openDevTools();
        
        // Build menu from template
        const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
        // insert Menu
        Menu.setApplicationMenu(mainMenu);

        mainWindow.once('ready-to-show', () => {
            mainWindow.show()
        });

        mainWindow.on('closed', function() {
            mainWindow = null;
        });
        let wc = mainWindow.webContents
        wc.on('new-window', (e, url) => {
            e.preventDefault()
            console.log(`creating new window ${url}`)
            // flag = false;
        });

        
    }
    catch(e) { }

});


const mainMenuTemplate = [
    {
        label: 'View',
        submenu: [
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'command+Q' : 'ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
        
    }, 
    {
        label: 'Contest Page', 
        click() {
            mainWindow.loadURL(url + 'challenges');
        }
    }
]

module.exports = { functionCall }