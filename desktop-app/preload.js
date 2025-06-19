const { contextBridge, ipcRenderer } = require('electron');

// عرض APIs آمنة للتطبيق
contextBridge.exposeInMainWorld('electronAPI', {
  // وظائف النظام
  platform: process.platform,
  versions: process.versions,
  
  // وظائف التطبيق
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
  
  // وظائف الملفات (للمستقبل)
  saveFile: (data) => ipcRenderer.invoke('save-file', data),
  loadFile: () => ipcRenderer.invoke('load-file'),
  
  // إشعارات
  showNotification: (title, body) => {
    if ('Notification' in window) {
      new Notification(title, { body });
    }
  }
});

// إعداد اتجاه النص للعربية
document.addEventListener('DOMContentLoaded', () => {
  document.dir = 'rtl';
  document.lang = 'ar';
});