/// <reference types="vite/client" />

declare module '*.css' {
	const cssContent: string;
	export default cssContent;
}

interface ImportMetaEnv {
	readonly VITE_API_BASE_URL?: string;
	readonly VITE_API_KEY?: string;
	readonly VITE_VERIFY_ENDPOINT?: string;
	readonly VITE_MOBILE_SETUP_URL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

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

interface Window {
	detector: {
		detectFace: (request: FaceDetectionRequest) => Promise<FaceDetectionResponse>;
	};
	relay: {
		getPort: () => Promise<number>;
		getLocalIp: () => Promise<string>;
		onPhoto: (callback: (dataUrl: string) => void) => void;
		removePhotoListener: () => void;
	};
}

