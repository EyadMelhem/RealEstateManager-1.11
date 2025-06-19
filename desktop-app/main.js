const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  // إنشاء نافذة التطبيق الرئيسية
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    title: 'نظام إدارة العقارات',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false // للسماح بتحميل المحتوى المحلي
    },
    show: false, // إخفاء النافذة حتى تكتمل تحميل
    titleBarStyle: 'default'
  });

  // تحميل التطبيق
  // يمكن تحميل من الخادم المحلي أو من ملفات HTML محلية
  const startUrl = process.env.ELECTRON_START_URL || 'https://b315f60d-e12b-49e2-9583-baa2a39ac947-00-64en6afov0ku.kirk.replit.dev';
  
  mainWindow.loadURL(startUrl);

  // إظهار النافذة عند اكتمال التحميل
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // إعداد القائمة العربية
  createMenu();

  // التعامل مع إغلاق النافذة
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // فتح أدوات التطوير في وضع التطوير
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

function createMenu() {
  const template = [
    {
      label: 'ملف',
      submenu: [
        {
          label: 'جديد',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            // وظيفة إنشاء جديد
          }
        },
        {
          label: 'حفظ',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            // وظيفة الحفظ
          }
        },
        { type: 'separator' },
        {
          label: 'خروج',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'تحرير',
      submenu: [
        { label: 'تراجع', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'إعادة', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'قص', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'نسخ', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'لصق', accelerator: 'CmdOrCtrl+V', role: 'paste' }
      ]
    },
    {
      label: 'عرض',
      submenu: [
        { label: 'إعادة تحميل', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'فرض إعادة التحميل', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
        { label: 'أدوات التطوير', accelerator: 'F12', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'ملء الشاشة', accelerator: 'F11', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'مساعدة',
      submenu: [
        {
          label: 'حول البرنامج',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'حول البرنامج',
              message: 'نظام إدارة العقارات',
              detail: 'نسخة 1.0.0\nتطبيق شامل لإدارة العقارات والمستأجرين'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// تشغيل التطبيق
app.whenReady().then(createWindow);

// إنهاء التطبيق عند إغلاق جميع النوافذ
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// أمان إضافي
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
  });
});