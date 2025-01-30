interface FileSystemHandlePermissionDescriptor {
    mode?: 'read' | 'readwrite';
  }
  
  interface FileSystemHandle {
    kind: 'file' | 'directory';
    name: string;
    queryPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<'granted' | 'denied' | 'prompt'>;
    requestPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<'granted' | 'denied' | 'prompt'>;
  }
  
  interface FileSystemDirectoryHandle extends FileSystemHandle {
    kind: 'directory';
  }
  
  interface Window {
    showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
  }