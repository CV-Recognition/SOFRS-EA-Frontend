import { contextBridge, ipcRenderer } from 'electron';

type FaceDetectionRequest = {
    tensor: number[];
    width: number;
    height: number;
    threshold?: number;
};

type FaceReasonCode =
    | 'ok'
    | 'no-face'
    | 'multiple-faces'
    | 'face-out-of-zone'
    | 'model-error'
    | 'invalid-input';

type FaceBox = {
    x: number;
    y: number;
    width: number;
    height: number;
    confidence: number;
};

type FaceDetectionResponse = {
    detected: boolean;
    confidence: number;
    modelReady: boolean;
    message: string;
    faceCount: number;
    reasonCode: FaceReasonCode;
    hasSingleForegroundFace: boolean;
    primaryFace: FaceBox | null;
    faces: FaceBox[];
};

contextBridge.exposeInMainWorld('detector', {
    detectFace: (request: FaceDetectionRequest): Promise<FaceDetectionResponse> =>
        ipcRenderer.invoke('detector:face', request),
});

contextBridge.exposeInMainWorld('relay', {
    getPort: (): Promise<number> => ipcRenderer.invoke('relay:getPort'),
    getLocalIp: (): Promise<string> => ipcRenderer.invoke('relay:getLocalIp'),
    onPhoto: (callback: (dataUrl: string) => void): void => {
        ipcRenderer.on('relay:photo', (_event, payload: string) => {
            callback(payload);
        });
    },
    removePhotoListener: (): void => {
        ipcRenderer.removeAllListeners('relay:photo');
    },
});
